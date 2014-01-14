var app = app || {};

(function($){
  app.AdminWorkView = Backbone.View.extend({
    tagName: 'li',
    className: 'admin-list',
    template: _.template( $('#tpl-admin-list-works').html() ),
    initialize: function() {
      this.listenTo(this.model,'change', this.render);
    },
    events: {
      'click button.view': 'viewWork',
      'click button.delete': 'removeWork',
      'click button.edit': 'editWork',
    },
    render: function() {
      this.$el.html( this.template(this.model.toJSON()) );
      this.$el.attr("id", this.model.id);
      return this.$el;
    },
    viewWork: function(e) {
      e.preventDefault();
      app.Router.displayWork(this.model.get("title_url"));
    },
    removeWork: function(e) {
      e.preventDefault();
      if ( window.confirm('Sicuro di voler elimiare il contenuto?') ) {
        this.model.destroy();
        this.remove();
        $('div.form-wrapper').empty();    
        $('li.admin-list.active').removeClass('active');
        resetForm('#addEditWorkForm-header');
        resetForm('#addEditWorkForm-upload');
        resetForm('#addEditWorkForm');         
      }
    },
    editWork: function(e) {
      e.preventDefault();
      if ( $('li.admin-list.active').length>0 ) {
        // another work is opened for editiing
        var m_id = this.model.get("id");
        var $active = $('div.form-wrapper.active');
        var a_id = $active.attr("data-target");
        if ( a_id==m_id ) {
          // clicked on opened work
          $('div.form-wrapper').remove();
          $('li.admin-list.active').removeClass('active');
        } else {
          // clicked on a closed work
          $('div.form-wrapper').remove();
          $('li.admin-list.active').removeClass('active');
          resetForm('#addEditWorkForm-header');
          resetForm('#addEditWorkForm-upload');
          resetForm('#addEditWorkForm');
          $('li#'+m_id).addClass("active");          
          var addEditWorkView = new app.AddEditWorkView({work: this.model});
          this.$el.after( $('<div/>').html(addEditWorkView.render().el) );
          $('div.form-wrapper').addClass('active');
        }        
      } else {
        var id = this.model.get("id");
        $('li#'+id).addClass("active");              
        var addEditWorkView = new app.AddEditWorkView({work: this.model});
        this.$el.after( $('<div/>').html(addEditWorkView.render().el) );
        $('div.form-wrapper').addClass('active');             
      }
    }
  });
})(jQuery);