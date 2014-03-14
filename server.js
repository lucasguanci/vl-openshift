var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  fs = require('fs'),
  util = require('util'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  mongodb = require('mongodb'),
  mongoose = require('mongoose'),
  ei = require('easyimage'),
  EventEmitter = require('events').EventEmitter;

// create server
var app = express();
// configure server
app.configure(function(){
//  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' })); // --
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(application_root,'site')));
  app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

// start server
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
if (typeof ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    ipaddress = "127.0.0.1";
    port = 4714;
}
app.listen(port, ipaddress, function(){
  console.log('Express server listening on %s:%s in %s mode', port, ipaddress,  app.settings.env);
});

/**
 * mongoDB
 */
// connecting to mongoDB
mongodb_url = process.env.OPENSHIFT_MONGODB_DB_URL;
mongodb_port = process.env.OPENSHIFT_MONGODB_DB_PORT;
if ( typeof mongodb_url === "undefined" ) {
  mongodb_url = 'localhost/vlnet';
  mongodb_port = 27017;
}
mongoose.connect('mongodb://'+mongodb_url, function(err) {
  if (err) {
    console.log("Error starting mongoose: "+err);
  } else {
    console.log("Started mongoose.");
  }
});
// Work Schema
var WorkSchema = new mongoose.Schema({
  title: String,
  title_url: String,
  images: [{
    url: String,
    caption: String,
    orientation: String
  }],
  video: String,
  year: String,
  text: String,
  technique: String,
  status: { type: String, enum: ["active", "disabled"] },
  media: { type: String, enum: ["foto","installazione","video","performance","preview"] },
  displayFront: Boolean,
  position: Number
});
var Work = mongoose.model('Work', WorkSchema);
// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});
userSchema.methods.validPassword = function (candidatePassword) {
  if ( candidatePassword === this.password ) {
    return true;
  } else {
    return false;
  }
};
var User = mongoose.model('User', userSchema);
// seeding user db if empty
User.count(function(err, count) {
  if ( !err && count===0 ) {
    seedDB();
  } else {
    console.log("DB is already populated.");
  }
});
var seedDB = function() {
  var user = new User(
    { username: 'luke', email: 'luca.sguanci@gmail.com', password: 'password', role: 'admin' }
  );
  user.save(function(err) {
    if (err) { console.log(err); }
    else { console.log('User: '+user.username+" saved."); }
  });  
};


/**
 * Passport
 */
passport.serializeUser(function(user, done) {
 done(null, user.id);
});
passport.deserializeUser(function(id, done) {
 User.findById(id, function (err, user) {
   done(err, user);
 });
});
passport.use(new LocalStrategy(
 function(username, password, done) {
   User.findOne({username: username}, function(err, user) {
     if (err) { return done(err); }
     if (user) {
      user.id = user._id; 
      if (!user) {
       return done(null, false, { message: 'Unknown user '+username });
      }
      if ( !user.validPassword(password) ) {
       return done(null, false, { message: 'Invalid password' });
      } else {
       console.log('authorized '+user.username);
       return done(null,user, { message: 'Welcome '+username });       
      }
     }     
   });
 }
));


/**
  * RESTful API
  */
// GET /api
app.get( '/api', function( request, response ) {
    response.send( 'Library API is running' );
});
// GET /api/works
app.get('/api/works', function( req, res ) {
  return Work.find( function( err, works ) {
    if( !err ) {
      return res.send( works );
    } else {
      return console.log( err );
    }
  });
});
// GET /api/works/:id
app.get('/api/works/:id', function(req,res) {
  var id = req.params.id;
  return Work.findById(id, function(err,work) {
    if( !err ) {
      return res.send(work);
    } else {
      return console.log(err);
    }    
  });
});
// POST /api/works
app.post('/api/works', function(req,res) {
  var work = new Work({
    title: req.body.title,
    title_url: req.body.title_url,
    video: req.body.video,
    year: req.body.year,
    text: req.body.text,
    technique: req.body.technique,
    status: req.body.status,
    media: req.body.media,
    displayFront: req.body.displayFront,
    position: req.body.number
  });
  // process images to create image object
  var t_images = [];
  req.body.images.forEach(function(image,i,s_images) {
    t_images[i] = {};
    t_images[i].caption = image.caption;
    t_images[i].url = image.url;
    // resized images have __R suffix in filename, e.g. image-name__R.jpg
    if ( image.url.match(/^(.*)__R\.(.*)$/)===null ) {
      // img has not been resized yet
      imgResize(image.url);      
      // append __R suffix to image's filename
      re = /(img\/.*)\.(.*)/;
      var match = image.url.match(re);
      t_images[i].url = match[1] + "__R." + match[2];      
    }
  });
  work.images = t_images;
  work.save(function(err,work){
    if( !err ) {
      return true;
    } else {
      return console.log(err);
    }    
  });
  return res.send(work);
});

// PUT /api/works/:id
app.put('/api/works/:id', function(req,res) {
  console.log('UPDATE req.body.title');
  var id = req.params.id;
  return Work.findById(id, function(err,work) {
    work.title = req.body.title;
    work.title_url = req.body.title_url;
    work.video = req.body.video;
    work.year = req.body.year;
    work.text = req.body.text;
    work.technique = req.body.technique;
    work.status = req.body.status;
    work.media = req.body.media;
    work.displayFront = req.body.displayFront;
    work.position = req.body.position;    
    // process images to create image object
    var t_images = [];
    req.body.images.forEach(function(image,i,s_images) {
      t_images[i] = {};
      t_images[i].caption = image.caption;
      t_images[i].url = image.url;
      // resized images have __R suffix in filename, e.g. image-name__R.jpg
      if ( image.url.match(/^(.*)__R\.(.*)$/)===null ) {
        // img has not been resized yet
        imgResize(image.url);      
        // append __R suffix to image's filename
        re = /(img\/.*)\.(.*)/;
        var match = image.url.match(re);
        t_images[i].url = match[1] + "__R." + match[2];      
      }
    });
    work.images = t_images;
    // update work
    work.save(function(err,work){
      if( !err ) {
        console.log(req.body.title+' has been updated.');
        return true;
      } else {
        return console.log(err);
      }    
    });
    return res.send(work);
  });
});

// DELETE /api/works/:id
app.delete('/api/works/:id', function(req,res) {
  var id = req.params.id;
  return Work.findById(id, function(err,work) {
    return work.remove(function(err,work) {
      if( !err ) {
        console.log('Work removed.');
        return res.send('');
      } else {
        console.log(err);
      }          
    });
  });
});

// POST /login
app.post('/login',
  passport.authenticate('local'), 
  function(req,res) {
    console.log(req.user.username);
    var dst = req.body.dst;
    console.log(util.inspect(req.body));
    switch (dst) {
      case "admin":
        res.redirect('/#!/admin');
        console.log('case admin');
        req.user.role = "admin";
        break;
      case "preview":
        res.redirect('/#!/filters/preview');
        req.user.role = "preview";
        break;
    }
  }
);
// GET /login
app.get('/login', function(req,res) {
  res.redirect('/#!/login');
});
// GET /logout
app.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

// GET /user
app.get('/user', function(req,res) {
  if ( typeof(req.user)!=='undefined' ) {
    res.json({username: req.user.username, role: req.user.role});
    console.log("user: "+req.user.username);
  } else {
    console.log("user: nobody");
    res.json({username: "nobody"});
  }
});

// POST /api/files/upload
app.post('/api/files/upload', function(req,res) {
  // we consider the last element in the form, 
  // i.e. more than one file could have been previously uploaded
  var keys = Object.keys(req.files);
  var keysArray = []; 
  keys.forEach(function(item){
    keysArray.push(item);
  });
  key = keysArray[0];
  var path = {};
  var file = {};
  var response = [];
//  console.log(req.files);
//  console.log(Object.keys(req.files).length);
  file.url = req.files[key].path;
  file.name = req.files[key].name;
  file.relname = "img/"+file.name;
  path.s = file.url;
  path.t = __dirname+"/site/img/"+file.name;
  var is = fs.createReadStream(path.s);
  var os = fs.createWriteStream(path.t);
  is.pipe(os);
  is.on('end', function() {
    console.log('fs pipe ended.');
    // image resize
    fs.unlink(path.s, function(err) {
      if (err) {
        console.log("Error unlinkSync: "+err);
      } else {
        console.log("unlinkSync of %s was successfull.", path.s);
        res.send({url: file.relname});
      }
    });
  });
});

// POST /api/files/delete
app.post('/api/files/delete', function(req,res) {
  console.log(req.body);  
  var path = __dirname + "/site/" + req.body.fileUrl;
  console.log("going to delete %s", path);
  fs.unlink(path, function(err) {
    if (err) {
      console.log("Error unlinkSync: "+err);
      res.send({response: "failed."});
    } else {
      console.log("Deleting of %s was successfull.", path);
      res.send({response: "succeded."});
    }
  });
});

/**
 * Utility 
**/
var imgResize = function(image_url) {
  console.log("image_url: "+image_url);
  var s_url = 'site/'+image_url;
  re = /(img\/.*)\.(.*)/;
  var match = s_url.match(re);
  var d_url = 'site/' + match[1] + "__R." + match[2];
  var ret_url = match[1] + "__R." + match[2];
  var img = {};
  console.log("src: %s, dst: %s", s_url, d_url);
  ei.info(s_url, function(err,stdout,stderr) { 
    if (err) {
      throw err;
    } else {
      img = stdout;
      console.log("image info: %o",img);
      var r = parseInt(img.width)/parseInt(img.height);
      // fixed image height, 486px
      var h = parseInt(486);
      var w = Math.round(h*r);
      // prevent images already resized to undergo resize again
      if ( parseInt(img.height)!=486 ) {
        ei.resize({src: s_url, dst: d_url, width: w, height: h}, function(err) {
          if (err) {
            throw err;
          } else {
            console.log('Resized');  
          }    
        });        
      }     
    }
  });
  // we suppose resizeFn to be successfull
  return ret_url;      
}
