var app = app || {};

(function($){
  Workspace = Backbone.Router.extend({
    routes: {
      '!/admin': 'admin',
      '!/login/:destination': 'login',
      '!/works/:title_url': 'displayWork',
      '!/filters/:filter': 'setFilter',
      '*path': 'index'
    },
    start: function() {
      if ( Backbone.history.start() ) {
        console.log("History started successfully");
        return true;
      } else {
        console.log('can\'t start history');
        return false;
      }
    },
    index: function() {
      var index = new app.FrontendView();
      this.navigate('!/index')
    },
    admin: function() {
      var self = this;
      $.get('/user', function(data) {
        if ( data.username != "nobody" && data.role == 'admin' ) {
          var admin = new app.BackendView();
        } else {
          self.login({dst: "admin"});
        }
      });      
      // var admin = new app.BackendView();
      // this.navigate('admin');
    },
    displayWork: function(title_url) {
      var frontendView = new app.FrontendView({title_url: title_url});
      this.navigate('!/works/'+title_url);
    },
    setFilter: function(filter) {
      app.WorkFilter = filter;
      switch (app.WorkFilter) {
        case "all":
          this.index();
          break;
        case "preview":
          if ( app.User != "nobody" ) {
            var frontendView = new app.FrontendView();              
          } else {
            this.login({dst: "preview"});
          }
          break;
        default:
          var frontendView = new app.FrontendView();  
          break;
      }
    },
    login: function(dst) {
      var login = new app.LoginView({dst: dst});
      this.navigate('!/login');
    }
  });
})(jQuery);