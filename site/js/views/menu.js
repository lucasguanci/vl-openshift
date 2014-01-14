var app = app || {};

(function($){
  app.MenuView = Backbone.View.extend({
    el: '#main-nav',
    template: _.template( $('#menuTpl').html() ),
    render: function(collection,selected_work) {
      // when no filter is applied, works in preview need to be filtered out from collection
      if ( app.WorkFilter=="all" || app.WorkFilter==undefined ) {
        new_collection = new Backbone.Collection();
        collection.each(function(item) {
          if ( item.get("media")!="preview" ) {
            new_collection.add(item);
          }
        });
        collection = new_collection;
      }
      // render template and menu items
      this.$el.html( this.template() );
      collection.each(function(item) {
        this.renderItem(item,selected_work);
      }, this);
      return this.$el;
    },    
    renderItem: function(item,work) {      
      var menuItemView = new app.MenuItemView({model: item, selected_work: work});
      if ( item.get("status") == "active" ) {
        this.$el.find('ul.lavori').append( menuItemView.render() );
      }
      // clear active class on filter and apply active class to present filter
      $('a.filter').removeClass("active");
      $('a.filter[data-id="'+app.WorkFilter+'"]').addClass("active");
      if ( app.WorkFilter==undefined ) {
        $('a.filter[data-id="all"]').addClass("active");
      }
    }
  });
})(jQuery);