var app = app || {};

(function($){
  app.MenuItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<a href="#/works/<%= title_url %>" id="menu-<%= id %>" class="circle menu" data-toggle="tooltip" data-placement="bottom" title="<%= title %>">1</a>'),
    events: {
      'a.menu click': 'route'
    },
    route: function(e) {
      app.Router.navigate('works/'+this.model.get("title_url"),{trigger:false});
      $(a.menu).removeClass('active');
    },
    render: function() {
      var model = this.options.model;
      if ( this.options.selected_work == "none" ) {
        this.$el.html(this.template( model.toJSON() ));  
      } else {
        var selected_work = this.options.selected_work;
        this.$el.html(this.template( model.toJSON() ));
        if ( model.get("title")==selected_work.get("title") ) {
          this.$el.find('a').addClass('active');
        }        
      }
      return this.$el;
    }
  });
})(jQuery);