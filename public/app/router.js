// Filename: router.js
define([
  'jquery',
  'async',
  'underscore',
  'backbone',
  'mainview',
  'timelineview',
  'addprotocolview',
  'flashmessageview',
  'protocollist',
  'utils'
], function($, async, _, Backbone, MainView, TimelineView, AddProtocolView,FlashMessageView,ProtocolList,Utils) {
  
  
  var AppRouter = Backbone.Router.extend({
          routes: {
            // Define some URL routes
            'home' : 'defaultHome',
            'about': 'showAbout',
            'contact': 'showContact',
            'protocol/:id': 'showProtocol',
            
            // Default
            '*actions': 'defaultAction',
            '': 'defaultAction'
          },
          initialize: function(){
          	this.flashView = new FlashMessageView();
          	this.protocols = new ProtocolList();
          	//this.mainView = new ChooserView({collection: this.services});
            this.mainView = new MainView({collection: this.protocols});
          	
          	this.on('route:showAbout', function(){
      	      Utils.activeLink('Protocol');
      	      $("#Wcontainer").empty();
      	      (new AddProtocolView()).render();
      	    });

      	    this.on('route:showContact', function () {
      	      Utils.activeLink('Contact');
      	      
      	      //var mainView = new ChooserView({collection: services, router: this});
      	      this.mainView.render();
      	    });
      	    
            this.on('route:showProtocol', function(id){
              //console.log("showProtocol called with id:" + id);
              Utils.activeLink('Timeline');
              //find the protocol
              // var pr = this.protocols.get(id);
              // console.log("got back:", pr);
              var timeline = new TimelineView({model: this.protocols.get(id)});
              timeline.render();
              timeline.afterRender();
            });

      	    this.on('route:defaultHome',function(){
      	      $("#Wcontainer").empty();
      	      Utils.activeLink('Home');
      	      this.mainView.render();
      	    });
      	    
      	    this.on('route:defaultAction', function (actions) {
      	      Utils.activeLink('Home');
      	      this.mainView.render();   
      		    
      		  });
          }
          
          
        });
        
        return AppRouter;
});
