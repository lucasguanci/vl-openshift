var app = app || {};

(function($){
  app.LoginView = Backbone.View.extend({
    el: "#app-wrapper",
    template: _.template( $('#LoginTpl').html() ),
    initialize: function() {
      this.render();
    },
    events: {    
      'click #login-submit': 'login',
      'click #login-cancel': 'cancel'
    },
    render: function() {
      this.$el.empty().append( this.template() ).removeClass('index');
      return this.$el;
    },
    login: function(e) {
      var dst = this.options.dst;
      $hidden = $('<input/>').attr("type","hidden").attr("name","dst").attr("value",dst.dst);
      $('#login-form').append($hidden);
      return;
    },
    cancel: function(e) {
      app.Router.index();
    }
  });
})(jQuery);