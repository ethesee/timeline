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
			'change #coverImage': "processUpload"
			//'change #coverImage': "processUpload"
		},
		
       
		addEntry: function(event){
			var _this = this;
			var s = { company: $("#company").val(), protocol: $("#protocol").val()};

			if ( (_this.files && _this.files.length > 0) && _this.files[0].name ){
				//s = new Service({ title: $("#sname").val(), price: $("#sprice").val(), image: _this.files[0].name});
				console.log("will be sending a spreadsheet file:", _this.files[0]);
				s = { company: $("#company").val(), protocol: $("#protocol").val(), spreadsheet: _this.files[0]};
			}
			console.log("addEntry in addProtocolview")
			if ( s.company && s.protocol){
				dispatcher.trigger("insert",s);
			}
			
			
			$("#company").val("");
			$("#protocol").val("");
			
			
			
		},

		processUpload: function(e){
            
            var fileInput = $("#coverImage");
            var files = fileInput[0].files;
            

            this.formData = new FormData();
            this.files = [];

            for (var i = 0; i < files.length; i++) {
			  var file = files[i];

			  // Check the file type.
			  // if (!file.type.match('image.*')) {
			  //   continue;
			  // }
              
			  // Add the file to the request.
			  this.files.push(file);
			  //this.formData.append('file',file);
			  this.formData.append('photos[]', file, file.name);
			}
			var fileField = $("#coverImage");
			fileField.replaceWith(fileField.val('').clone(true));
            //this.showPreview(); 
        },

        
	});
	return AddProtocolView;

});