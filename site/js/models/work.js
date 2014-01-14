var app = app || {};

(function($){
	app.Work = Backbone.Model.extend({
		defaults: {
			title: 'no title',
			status: 'active',
			year: 'nd',
			image: [ {'url':'img/placeholder.png'} ],
			video: 'nd',
			text: 'No text yet',
			technique: 'nd',
			displayFront: false
		},
		parse: function(res) {
			res.id = res._id;
			return res;
		}
	});
})(jQuery);