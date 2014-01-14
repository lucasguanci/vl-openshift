var app = app || {};

(function($){
	app.Portfolio = Backbone.Collection.extend({
		model: app.Work,
		comparator: "position",
		url: 'api/works'
	});
})(jQuery);