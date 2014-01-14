var app = app || {};

(function($) {
  app.AddEditWorkView = Backbone.View.extend({
    className: 'form-wrapper',
    template: _.template($('#addEditWorkTpl').html()),
    initialize: function() {
      console.log("Initializing app.AddEditWorkView.");
    },
    render: function() {      
      if ( this.options.work != "" ) {
        // edit work
        this.$el.html( this.template(this.options.work.toJSON()) );
        this.$el.attr("data-target",this.options.work.get("id"));
        var images = this.options.work.get("images");
        var self = this;
        _.each(images, function(item) {
          self.uploadAddFile(item,self);
        });
      } else {
        // new work
        var m = new app.Work();
        this.$el.html( this.template(m.toJSON()) );
        this.$el.attr("data-target","none");
      } 
      this.$el.append('<script>CKEDITOR.replace("text-edit")</script>');      
      var self = this;
      this.$el.find('#upload-form').on('submit', function(e) {
        e.preventDefault();
        $img = $('<img/>').addClass("ajax-loader").attr('src','img/ajax-loader.gif');
        $('#upload-upload').after($img);            
        $(e.target).ajaxSubmit({
          error: function() {
            alert("Error uploading file.");
          },
          success: function(data) {
            console.log('File %s uploaded.', data.url); 
            $img.remove();    
            var $form = $('#upload-form');
            // hide upload form
            $form.hide();
            // add file to index
            self.uploadAddFile(data,self);
            // move upload form below UL
            resetForm('#upload-form');
            $('ul.upload-index').after($form);
            $form.show();
          }
        });
      });
      return this;
    },
    uploadAddFile: function(image,self) {
      // create li element, caption input field and delete button 
      var $row = $('<tr/>').attr("data-id",image.url);
      var $img = $("<td/>").html($('<img/>').attr("src",image.url).css("height","80px"));
      var $url = $("<td/>").html(image.url);
      var $caption = $("<td/>").html($('<input/>')
        .attr('type','text')
        .attr("name","caption")
        .attr("data-caption",image.url)
        .attr("placeholder","caption")
        .addClass('caption btn btn-default')
        .val(image.caption));
      var $delete = $("<td/>").html($('<button/>').addClass('delete btn btn-primary btn-xs').attr("href","#").attr("data-target",image.url).html('<span class="glyphicon glyphicon-remove"></span> delete'));
      // add to DOM
      this.$el.find('table.upload-index').append($row);
      $row.append($img).append($url).append($caption).append($delete);
      // bind delete event to $delete
      self.uploadBindDelEvent('button.delete','click');
      // create input hidden form element
      $hidden = $('<input/>').attr("type","hidden").attr("value",image.url).attr("data-id",image.url);
      this.$el.find('#upload-form-index').append($hidden);  
    },
    uploadBindDelEvent: function(selector,eventType) {
      // delete li item and remove hidden input element
      this.$el.find(selector).on(eventType, function(e) {
        console.log('ciao');
        e.preventDefault();
        target = $(e.target).attr('data-target');          
        var jqxhr = $.post('/api/files/delete', { fileUrl: target }, function() {
          $('tr[data-id="'+target+'"]').remove();
          $('input[data-id="'+target+'"]').remove();
        })
          .done(function() {
            console.log("%s has been removed.", target);
        });
      });  
    }    
  });
})(jQuery);
