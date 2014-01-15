$(document).ready(function() {
  // start Bootstrap tooltip
  // $('a[data-toggle=tooltip]').tooltip();
  $("#btn-add-new").bind('click', function() {
    $('#addWork').toggle();
  });
  $('.nav li').on('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
  });
});


/**
 * file Uploader
**/
// Upload functions
function uploadAddFile(file) {
  // create li element and delete button 
  var $li = $('<li/>').attr("data-id",file).html('<img src="'+file+'" alt="'+file+'" style="height:80px"/>');
  var $delete = $('<button/>').addClass('delete btn btn-primary btn-xs').attr("href","#").attr("data-target",file).html('<span class="glyphicon glyphicon-remove"></span> delete');
  // add to DOM
  $('ul.upload-index').append($li);
  $li.append($delete);
  // bind delete event to $delete
  uploadBindDelEvent('button.delete','click');
  // create input hidden form element
  $hidden = $('<input/>').attr("type","hidden").attr("value",file).attr("data-id",file);
  $('#upload-form-index').append($hidden);  
}
function uploadBindDelEvent(selector,eventType) {
  // delete li item and remove hidden input element
  $(selector).on(eventType, function(e) {
    console.log('ciao');
    e.preventDefault();
    target = $(e.target).attr('data-target');          
    var jqxhr = $.post('/api/files/delete', { fileUrl: target }, function() {
      $('li[data-id="'+target+'"]').remove();
      $('input[data-id="'+target+'"]').remove();
    })
      .done(function() {
        console.log("%s has been removed.", target);
    });
  });  
}

/**
 * Utility functions
**/
function resetForm(form) {
  $(form).find('input:text, input:password, input:file, select, textarea').val('');
  $(form).find('input:radio, input:checkbox')
       .removeAttr('checked').removeAttr('selected');
}
