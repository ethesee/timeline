define([
  'jquery',
  'underscore',
  'backbone',
  'protocol',
  'protocollist',
  'protocolview',
  'dispatcher',
  'utils',
  'text!templates/mainviewtemplate.html',
  'sapp',
  'moment'
], function($,_, Backbone,Protocol,ProtocolList,ProtocolView,dispatcher,Utils,mainviewTemplate,Sapp,moment) {
// The main view of the application
	var MainView = Backbone.View.extend({

		// Base the view on an existing element
		el: $('#Wcontainer'),
		//template: chooserTemplate,
		idIterator: "",

		initialize: function(options){
			// this.router = options.router;
			this.protocols = options.collection;
			this.protocols.on("reset", this.render, this);
	        this.render();
			//this.listenTo(this.protocols, 'change', this.render);
			this.listenTo(this.protocols, 'add', this.render);
			this.protocols.fetch();
			dispatcher.on('insert', this.addProtocol, this);
			// dispatcher.on('page', this.pageService, this);
			

		},
		events: { 
			'click #order': "orderMessage",
			'click #del': "delProducts",
			'click #showAdd': "toggleAddForm",
			//'click #addService': "addService"
		},
		createServiceViews: function(){
			this.list.empty();
			this.total = $('#total span');
			var showNext = false;

			var grouped = this.protocols.groupBy("company");

			//console.log("grouped:", grouped);
			for(var i in grouped){
				var details = $("<details></details>");
				var summary = $("<summary>" + i + "</summary>");
				details.append(summary);

				var ul = $("<ul id='" + i + "'></ul>");
				var views = grouped[i];

				for(var x=0; x < views.length; x++){
					var protocol = views[x];
					var view = new ProtocolView({model: protocol});
					ul.append(view.render().el);
				
				}
				details.append(ul);
				this.list.append(details);
				// $("#" + i + " div>li").on('click',function(){
				// 	console.log("clicked company list:", $(this).attr('id'));
				// 	Sapp.router.navigate('protocol/' + $(this).attr('id'), true);
				// })

			}
			
		},

		render: function(){
			this.template = _.template(mainviewTemplate);
			this.$el.html(this.template());
			this.list = $('#protocols');
			this.createServiceViews();
            
			return this;

		},

		
		
		addProtocol: function(s){
		    console.log("trigger received")		
			var company = s.company,
				protocol = s.protocol;

			var getStart = function(d){
				return moment(d);
			}

			var getEnd = function(d){
				return moment(d).add(10,'days');
			}

			var tl = [];
			var start_date = moment();
			var end_date = getEnd(start_date);
			var design = {id:1, content: "Design approval", start: start_date, end: end_date};
			tl.push(design);

			start_date = getStart(end_date);
			end_date = getEnd(start_date);
			var review = {id:2, content: "Design Review", start: start_date, end: end_date};
			tl.push(review);

			start_date = getStart(end_date);
			end_date = getEnd(start_date);
			var protoType = {id:3, content: "Prototype", start: start_date, end: end_date};
			tl.push(protoType);

			start_date = getStart(end_date);
			end_date = getEnd(start_date);
			var trainer = {id:4, content: "Trainer Build", start: start_date, end: end_date};
			tl.push(trainer);
			//var elementProtocol = new Protocol({ company: company, protocol: protocol, checked: false, timeline: tl});

			//this.protocols.create({ company: company, protocol: protocol, checked: false});
			this.protocols.create({ company: company, protocol: protocol, checked: false, timeline: tl});

			//this.createServiceViews();
			//this.protocols.trigger('change',{});
			Utils.activeLink('Home');
			
			
			//this.router.navigate();
			Sapp.router.navigate('Home', true);
			
		},

		orderMessage: function(event){
			this.uncheckAll();
		},
		uncheckAll: function(){
			var total = 0;

			_.each(this.protocols.getChecked(), function(elem){
				elem.toggle();
			});
		},
		delProducts: function(event){
			
			var self = this;
			_.each(this.protocols.getChecked(), function(elem){
				
				var elemid = elem.get("_id");
				self.protocols.where({_id: elemid})[0].destroy();
				
			});
			this.createServiceViews();
			
			this.protocols.trigger('change',{});
			
		}

	});
	return MainView;

});