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
				protocol = s.protocol,
				spreadsheet = s.spreadsheet;


			if ( spreadsheet ){
				//console.log("got spreadsheet:", spreadsheet);
				this.ExcelToJSON(s);
			}else{
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

				Utils.activeLink('Home');
				//this.router.navigate();
				Sapp.router.navigate('Home', true);	
			}

			

			//this.createServiceViews();
			//this.protocols.trigger('change',{});
			
			
		},

		ExcelToJSON: function(s) {
			console.log("ExcelToJSON:",file);
			var self = this;
			var company = s.company,
				protocol = s.protocol,
				file = s.spreadsheet;

		    var reader = new FileReader();
		    
		    var timeline = [];
		    reader.onload = function(e) {
		        var data = e.target.result;
		        var cfb = XLS.CFB.read(data, {type: 'binary'});
		        var wb = XLS.parse_xlscfb(cfb);
		        // Loop Over Each Sheet
		        wb.SheetNames.forEach(function(sheetName) {
		            // Obtain The Current Row As CSV
		            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);   
		            var data = XLS.utils.sheet_to_json(wb.Sheets[sheetName], {header:1});   
		            $.each(data, function( indexR, valueR ) {
		                //var sRow = "<tr>";

		                //console.log("indexR:" + indexR + " valueR:", valueR);
		                timeline.push(valueR);
		                // $.each(data[indexR], function( indexC, valueC ) {
		                //     //sRow = sRow + "<td>" + valueC + "</td>";
		                //     console.log("indexC:" + indexC + " valueC:" + valueC);
		                // });
		                //sRow = sRow + "</tr>";
		                //$("#my_file_output").append(sRow);
		            });
		        });
		    };
		    var fixDate = function (d){
		    	var separators = ['/','-'];
		    	var tokens = d.split(new RegExp(separators.join('|'),'g'));
		    	return tokens[1] + '/' + tokens[0] + '/' + tokens[2];
		    };

		    reader.onloadend = function(e){
		    	var tl = [];
		    	var itemCount = 1;
		    	for(var i=1; i < timeline.length; i++){
		    		var row = timeline[i];
		    		
	    			var start_date = moment(new Date(row[5]));
		    		var end_date = moment(new Date(row[6]));

		    		var actual_start = moment(new Date(row[7]));
		    		var actual_end = moment(new Date(row[8]));

		    		if ( !isNaN(start_date) && !isNaN(end_date)){
		    			var row5 = fixDate(row[5].replace(/\s/g, ""));
		    			var row6 = fixDate(row[6].replace(/\s/g, ""));

		    			start_date = moment(row5);
		    			end_date = moment(row6);

						//var end_date = getEnd(start_date);
						itemCount++;
						var item = {id:itemCount, content: row[0], start: new Date(start_date.format("MM/DD/YYYY")), end: new Date(end_date.format("MM/DD/YYYY"))};
						tl.push(item);
		    		}

		    		if ( ! isNaN(actual_start) ){
		    			itemCount++;
		    			var row7 = fixDate(row[7].replace(/\s/g, ""));
		    			actual_start = moment(row7);
		    			if ( !isNaN(actual_end)){
		    				var row8 = fixDate(row[8].replace(/\s/g, ""));
		    				actual_end = moment(row8);
		    			}
		    			end_date = (!isNaN(actual_end)) ? new Date(actual_end.format("MM/DD/YYYY")) : "";
						var item = {id:itemCount, content: row[0], start: new Date(actual_start.format("MM/DD/YYYY")), end: end_date};
						tl.push(item);
		    		}


			    		
		    		
		    		
		    	}
		    	self.protocols.create({ company: company, protocol: protocol, checked: false, timeline: tl});

				Utils.activeLink('Home');
				//this.router.navigate();
				Sapp.router.navigate('Home', true);	
				
		    };

		    reader.onerror = function(ex){
		        console.log(ex);
		    };

		    reader.readAsBinaryString(file);
			
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