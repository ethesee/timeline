define([
  'jquery',
  'underscore',
  'backbone',
  'dispatcher',
  'sapp',
  'text!templates/protocoltemplate.html'
  //'text!templates/serviceTemplate.html'
], function($,_, Backbone, dispatcher,sapp,protocolTemplate) {
// This view turns a Service model into HTML
	var ProtocolView = Backbone.View.extend({
		//tagName: 'li',
		tagName: 'div',
		template: protocolTemplate,
		events:{
			//'click [type="checkbox"]': 'toggleService'
			//'click' : 'selectThumb',
			// 'click #swipe-right': "swipeRight",
			// 'click #swipe-left': "swipeLeft",
			'click': 'showme'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			dispatcher.on('showim', this.toggleDiv, this);
		},

		render: function(){
            var tmpl = _.template(this.template);
            if ( this.model.get('id')){
            	this.$el.html(tmpl(this.model.toJSON()));
            	//this.$('input').prop('checked', this.model.get('checked'));
            }
			return this;
		},
		
		toggleService: function(e){	
			this.model.toggle();			
		},
		
		showme : function(e){
			e.preventDefault();
			console.log("showme called from protocolview.js with id:" + this.model.get("_id"))
			//dispatcher.trigger("protocol",{id: this.model.get("_id")});
			sapp.router.navigate('protocol/' + this.model.get("_id"), true);
		}
	});
	return ProtocolView;
});
