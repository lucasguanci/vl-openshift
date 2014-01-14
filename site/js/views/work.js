var app = app || {};

(function($){
	app.WorkView = Backbone.View.extend({
    tagName: 'article',
    className: 'work',
    template: _.template( $('#workTemplate').html() ),
    initialize: function(work) {
    	this.model = work;
    	this.listenTo(this.model,'change',this.render);
    },
    render: function(work,loaded) {
    	// clear content
    	this.$el.find('#content').empty();
    	// create content
    	this.$el.html( this.template(this.model.toJSON()) );
    	// start flexslider 
    	this.$el.find('.flexslider').flexslider({
    	  animation: "fade",
    	  slideshowSpeed: 5000,
    	  directionNav: false,
    	});
    	// resolve promise when last image has loaded
    	this.$el.find('img:first').on('load', function() {
    	  loaded.resolve();
    	});
    	return this.$el;
    }
	});
})(jQuery);