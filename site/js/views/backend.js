var app = app || {};

(function($){
  app.BackendView = Backbone.View.extend({
    el: "#app-wrapper",
    template: _.template( $('#adminTpl').html() ),
    initialize: function() {
      this.collection = new app.Portfolio();
      this.collection.fetch({reset: true});
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'sort', this.render);
    },
    events: {
      'submit #addEditWorkForm-upload': 'addImage',
      'submit #addEditWorkForm': 'submit',
      'sort': 'alertSorted'
    },    
    render: function() {
      // render static page's elements
      this.$el.html( this.template() );
      this.$el.removeClass('index');
      // render 'Add new work'
      var self = this;
      $("#btn-add-work").on('click', function(e) {
        $('#list-works-content').toggle();
        $('#add-work-content').toggle();        
        self.renderAddEditWork('#add-work-content','');
      });
      // render 'Index'
      this.collection.each(function(item){
        this.listWork(item);
      }, this);
      // make #works-index sortable
      this.bindSortable();
      // toggle Add/Edit buttons
      $("#btn-list-works").on('click', function() {
        if ( $('#add-work-content').css('display')=='block' ) {
          $('#add-work-content').toggle();        
        }
        $('#list-works-content').toggle();
      });  
      // show fixed nav bar
      $('#fixed-nav').show();
      $('#app-wrapper').css('margin-top','60px');
      // add class admin to app-wrapper (used for CSS styling)
      this.$el.removeClass('index').addClass('admin');
      // toggle ON #list-works
      this.$el.find('#list-works').addClass('active');
      // return
      return this.$el;
    },
    listWork: function(work) {
      var listWorkView = new app.AdminWorkView({model: work});
      this.$el.find('#works-index').append( listWorkView.render() );
      return this;
    },
    bindSortable: function() {
      var self = this;
      this.$el.find('ul#works-index').sortable({
        update: function() {
          var order = $('#works-index').sortable('toArray');
          console.log("order: "+order);
          self.collection.each(function(model){
            var m_id = model.get("id");
            pos = _.indexOf(order, m_id);
            model.set({position: pos});
            model.save();
          });
          console.log(self.collection);
          self.collection.sort();
        }
      });
    },
    renderAddEditWork: function(target,item) {
      if ( item == '' ) {
        // add a new work
        var addEditWorkView = new app.AddEditWorkView({work: ''});
        this.$el.find(target).html( addEditWorkView.render().el );
      } else {
        // edit an existing work
        var work = this.collection.where({id: item.id})[0]; 
        var addEditWorkView = new app.AddEditWorkView({work: work});
        this.$el.find(target).html( addEditWorkView.render().el );        
      }
    },
    submit: function(e) {
      e.preventDefault();
      var that = this;
      var formData = {};
      $('#addEditWorkForm-header div').children().each(function(i,el) {
        if ( $(this).prop('tagName').toLowerCase() != 'button' ) {
          if ( $(el).val() != '' ) {
            formData[el.id] = $(el).val();
          }
        }
      });
      formData.images = [];
      $('form#upload-form-index input[type="hidden"]').each(function(i,el) {
        formData.images[i] = {};
        formData.images[i].url = $(el).attr("data-id");
        var caption = $('ul.upload-index  input[data-caption="'+$(el).attr("data-id")+'"]').val();
        formData.images[i].caption = caption;
      });
      $('#addEditWorkForm div').children().each(function(i,el) {
        if ( $(this).prop('tagName').toLowerCase() != 'button' ) {
          // input#displayFront
          if ( $(el).attr('id') == 'displayFront' ) {
            if ( $(el).attr('checked')=='checked' ) {
              formData[el.id] = true;
            } else {
              formData[el.id] = false;
            }
            return true;
          }
          if ( $(el).val() != '' ) {
            formData[el.id] = $(el).val();
          }
        }
      });
      // CREATE or UPDATE?
      var m_id = $("div.form-wrapper").attr("data-target");
      if ( m_id == "none" ) {
        // check for not empty work
        if ( typeof(formData['title'])!="undefined" ) {
          // this is a new work, CREATE
          // new work get last position
          last = this.collection.length;
          formData["position"] = last+1;
          that.collection.create(formData);
        } 
      } else {
        // the work is already in the collection, UPDATE
        var m = that.collection.findWhere({id:m_id});
        m.set(formData);
        m.save();
      }
      // detach CKeditor
      // if ( CKEDITOR.instances.text ) {
      //   CKEDITOR.instances.text.destroy(); 
      // }        
      // clear forms
      resetForm('#addEditWorkForm-header');
      resetForm('#addEditWorkForm-upload');
      resetForm('#addEditWorkForm');
      // hide form
      $('div.form-wrapper').removeClass('active').hide();
      return false;
    }
  })
})(jQuery);