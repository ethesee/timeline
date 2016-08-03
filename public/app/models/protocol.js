define([
  'underscore',
  'backbone',
], function(_, Backbone) {
	var Protocol = Backbone.Model.extend({

			// Will contain three attributes.
			// These are their default values

			defaults:{
				company: 'My company',
				protocol: 'company protocol',
				checked: false,
				emails: [],
				timeline: []
			},
			idAttribute: "_id",
			parse:function (response) {
		        //console.log(response);
		        response.id = response._id;
		        
		        return response;
		    },

			// Helper function for checking/unchecking a service
			toggle: function(){
				
				this.set('checked', !this.get('checked'));

			}
			
	});
	return Protocol;
});