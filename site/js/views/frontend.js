var app = app || {};

(function($){
	app.FrontendView = Backbone.View.extend({
		el: '#app-wrapper',
		className: 'index',
		template: _.template( $('#indexTpl').html() ),
		initialize: function() {
      if ( app.WorkFilter!==undefined && app.WorkFilter != "all" ) {
        // apply filter app.WorkFilter
        this.collection = new app.Portfolio;
        this.collection.fetch({reset: true});
        this.listenTo(this.collection,'reset',this.displayWorkFiltered);
      } else {
        // no filtering
        var title_url = this.options.title_url;
        if ( title_url!==undefined ) {
          // call to display a chosen work
          if ( !$.isEmptyObject(this.collection) ) {
            // link from menu
            var work = this.collection.where({title_url: title_url})[0];
            this.displayWork(work);
          } else {
            // external direct link
            this.collection = new app.Portfolio();
            this.collection.fetch({reset:true});
            this.SelectedWorkTitleUrl = title_url;
            this.listenTo(this.collection,'reset',this.displayWorkExternal);          
          }
        } else {
          // call with no work being chosen, i.e. init
          this.collection = new app.Portfolio();
          this.collection.fetch({reset:true});
          this.listenTo(this.collection,'reset',this.render);
        }
      }
      // chek for logged in user, if so show #fixed-nav
      this.checkLoggedIn();
		},
		render: function() {
      console.log("FrontendView: render..");
			// render static page elements
			this.renderStatic();
      // select a random work
      // var work = this.pickRndWork();
      // no work will be shown when var work = "none";
      var work = this.collection.at(0);
			// render menu
      this.renderMenu(work);
			// render work
			this.renderWork(work);
		},
    renderStatic: function() {
      this.$el.html( this.template() );
      this.$el.addClass('index');
    },
    renderWork: function(work) {
      // render selected work
      var loaded = new $.Deferred();
      var self = this;
      var workView = new app.WorkView(work);
      var cnt_body = workView.render(work,loaded);
      loaded.done(function() {
        self.$el.find("#content").append(cnt_body);
      })
    },
    renderMenu: function(work) {
      var menu = new app.MenuView();
      this.$el.find('#main-nav').append( menu.render(this.collection,work) );
    },
		filter: function() {
			;
		},
    pickRndWork: function() {
      // render a random work
      var N = this.collection.length;
      var n = Math.floor(Math.random()*N)
      return this.collection.at(n);
    },
    displayWork: function(work) {
      // render menu and work
      this.renderMenu(work);
      this.renderWork(work);
    },
    displayWorkExternal: function() {
      // find work by title, render static page elements and selected work
      var work = this.collection.where({title_url: this.SelectedWorkTitleUrl})[0];
      this.renderStatic();
      this.displayWork(work);
    },
    displayWorkFiltered: function() {
      var filtered_array = this.collection.where({media: app.WorkFilter});
      this.collection = new Backbone.Collection(filtered_array);
      // apply filter
      if ( this.options.title_url===undefined ) {
        var work = this.collection.at(0);
      } else {
        var work = this.collection.findWhere({title_url: this.options.title_url});
      }
      this.renderStatic();
      this.displayWork(work);
    },
    checkLoggedIn: function() {
      $.get('/user', function(data) {
        if ( data.username != "nobody" && data.role == "admin" ) {          
          $('#fixed-nav').show();
          $('#app-wrapper').css('margin-top',"60px");
        }
        app.User = data.username;
      });
    }
	});
})(jQuery);