define([
  'jquery',
  'underscore',
  'backbone',
  'protocol',
  'protocollist',
  'protocolview',
  'text!templates/addProtocol.html',
  'dispatcher'
], function($,_, Backbone,Protocol,ProtocolList,ProtocolView,addProtocol,dispatcher) {
// The main view of the application
	var AddProtocolView = Backbone.View.extend({

		// Base the view on an existing element
		//el: $('#addForm'),
		el: $('#Wcontainer'),
		template: addProtocol,

		initialize: function(){
			//this.render();
		},

		render: function(){

			var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        	this.$el.html(tmpl(/*this.model.toJSON()*/));
        	
            return this;

		},

		events: { 
			'click #addProtocol': "addEntry",
			//'change #coverImage': "processUpload"
		},
		
       
		addEntry: function(event){
			var _this = this;
			var s = { company: $("#company").val(), protocol: $("#protocol").val()};
			console.log("addEntry in addProtocolview")
			if ( s.company && s.protocol){
				dispatcher.trigger("insert",s);
			}
			
			
			$("#company").val("");
			$("#protocol").val("");
			
			
			
		}

	});
	return AddProtocolView;

});