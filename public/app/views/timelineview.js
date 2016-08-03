define([
  'jquery',
  'underscore',
  'backbone',
  'dispatcher',
  'sapp',
  'moment',
  'text!templates/timelinetemplate.html'
  //'text!templates/serviceTemplate.html'
], function($,_, Backbone, dispatcher,sapp,moment,timelineTemplate) {
// This view turns a Service model into HTML
	var TimelineView = Backbone.View.extend({
		//tagName: 'li',
		//tagName: 'div',
		el: $('#Wcontainer'),
		template: timelineTemplate,
		events:{
			//'click [type="checkbox"]': 'toggleService'
			//'click' : 'selectThumb',
			// 'click #swipe-right': "swipeRight",
			// 'click #swipe-left': "swipeLeft",
			//'click': 'showme'
		},

		initialize: function(){
			//this.listenTo(this.model, 'change', this.render);
			//this.model.bind('change:timeline', this.render, this);
			dispatcher.on('showim', this.toggleDiv, this);
			//this.listenTo(this.model, 'change', this.render);
			dispatcher.on('timeline:update', this.doNothing, this);
		},

		render: function(){
			console.log("render called in timelineview")

			
			
            var tmpl = _.template(this.template);
            if ( this.model.get('id')){
            	console.log("JSON:", this.model.toJSON());
            	this.$el.html(tmpl(this.model.toJSON()));
            	//this.$('input').prop('checked', this.model.get('checked'));
            }
            
			return this;
		},
		doNothing: function(){

			console.log("do doNothing called");
			return false;
		},
		afterRender: function(){
			
			var prettyConfirm = function(title, text, callback) {
				    swal({
				      title: title,
				      text: text,
				      type: 'warning',
				      showCancelButton: true,
				      confirmButtonColor: "#DD6B55"
				    }, callback);
				};

			var prettyPrompt = function(title, text, inputValue, callback) {
				    swal({
				      title: title,
				      text: text,
				      type: 'input',
				      showCancelButton: true,
				      inputValue: inputValue
				    }, callback);
				};

			// var min = new Date(2016, 3, 1); // 1 april
			// var max = new Date(2016, 3, 30, 23, 59, 59); // 30 april
			var objectTimeline = this.model.get('timeline');

			var timelineMinimum = _.bind(function(){
				objectTimeline = this.model.get('timeline');
				var min = moment();

				for(var i=0; i < objectTimeline.length; i++){
					if ( objectTimeline[i].start ){
						//see if date is lower than current min
						var nstart = moment(objectTimeline[i].start);
						if ( nstart.isBefore(min) ){
							min = nstart;
						}
					}
				}
				return min;
			},this);

			var timelineMaximum = _.bind(function(){
				objectTimeline = this.model.get('timeline');
				var maxi = moment().add(30,'days');

				for(var i=0; i < objectTimeline.length; i++){
					if ( objectTimeline[i].end ){
						//see if date is lower than current min
						var nend = moment(objectTimeline[i].end);
						if ( nend.isAfter(maxi) ){
							maxi = nend;
						}
					}
				}
				return maxi;
			},this);

			var min = timelineMinimum(); //moment();
			var max = timelineMaximum();//moment().add(30,'days');

		
			var updateTimeline = _.bind(function(item){
				console.log("trigger pulled");
				// dispatcher.trigger("timeline",{id: this.model.get('_id'), item: item});
				var tm = _.clone(this.model.get('timeline'));

				for(var i=0; i < tm.length; i++){
					if ( tm[i].id == item.id){
						tm[i].content = item.content;
						tm[i].start = item.start;
						tm[i].end = (item.end) ? item.end : tm[i].end;

						this.model.set('timeline',tm);
						console.log("model set:",tm);
						this.model.save({},{
							success: function(){
								console.log("successfully saved model");
							}
						});
						dispatcher.trigger('timeline:update');
					}
				}

			},this);

			var addTimeline = _.bind(function(item){
				var tm = _.clone(this.model.get('timeline'));
				var len = tm.length + 1;
				var istart = (item.start) ? item.start : null;
				var iend = (item.end) ? item.end: null;
				tm.push({id: len, content: item.content, start: istart, end: iend });

				this.model.set('timeline',tm);
						console.log("model set:",tm);
						this.model.save({},{
							success: function(){
								console.log("successfully saved model");
							}
						});
			},this);

			var options = {
	
			    editable: true,

			    onAdd: function (item, callback) {
			      prettyPrompt('Add item', 'Enter text content for new item:', item.content, function (value) {
			        if (value) {
			          item.content = value;
			          addTimeline(item);
			          callback(item); // send back adjusted new item
			        }
			        else {
			          callback(null); // cancel item creation
			        }
			      });
			    },

			    onMove: function (item, callback) {
			      var title = 'Do you really want to move the item to\n' +
			          'start: ' + item.start + '\n' +
			          'end: ' + item.end + '?';

			      prettyConfirm('Move item', title, function (ok) {
			        if (ok) {
			          updateTimeline(item);
			          callback(item); // send back item as confirmation (can be changed)
			        }
			        else {
			          callback(null); // cancel editing item
			        }
			      });
			    },

			    onMoving: function (item, callback) {
			      // if (item.start < min) item.start = min;
			      // if (item.start > max) item.start = max;
			      // if (item.end   > max) item.end   = max;
			      
			      callback(item); // send back the (possibly) changed item
			    },

			    onUpdate: function (item, callback) {
			      
			      prettyPrompt('Update item', 'Edit items text:', item.content, function (value) {
			        if (value) {
			          item.content = value;
			          updateTimeline(item);
			          callback(item); // send back adjusted item
			        }
			        else {
			          callback(null); // cancel updating the item
			        }
			      });
			    },

			    onRemove: function (item, callback) {
				      prettyConfirm('Remove item', 'Do you really want to remove item ' + item.content + '?', function (ok) {
				        if (ok) {
				          callback(item); // confirm deletion
				          updateTimeline(item);
				        }
				        else {
				          callback(null); // cancel deletion
				        }
				      });
			    }

			    
			};

			var container = document.getElementById('visualization');
  
  			var timeline = new vis.Timeline(container, this.model.get('timeline'), options);

		},

		
		
		toggleService: function(e){	
			this.model.toggle();			
		},
		
		// showme : function(e){
		// 	e.preventDefault();
		// 	dispatcher.trigger("protocol",{id: this.model.get("_id")});
		// }
	});
	return TimelineView;
});
