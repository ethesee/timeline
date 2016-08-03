
// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
/*if (window.__backboneAgent) {
	  window.__backboneAgent.handleBackbone(Backbone);
}*/

require.config({
  shim: {
    'facebook' : {
      exports: 'FB'
    }
  },
  paths: {
    jquery: '../assets/js/libs/jquery/jquery-2.0.3-min',
    async: '../assets/js/libs/backbone/async',
    underscore: '../assets/js/libs/underscore/underscore-min',
    backbone: '../assets/js/libs/backbone/backbone-min',
    templates: '../assets/templates',
    'facebook': '//connect.facebook.net/en_US/sdk',
    text: '../assets/js/libs/require/text',
    'protocol': '../app/models/protocol',
    //'timeline': '../app/models/timeline',
    'protocollist': '../app/collections/protocollist',
    //'timelinecollecction': '../app/collections/timelinecollection',
    'protocolview': '../app/views/protocolview',
    'timelineview': '../app/views/timelineview',
    'mainview': '../app/views/mainview',
    'addprotocolview': '../app/views/addprotocolview',
    'flashmessageview': '../app/views/flashmessageview',
    'dispatcher': '../app/events/dispatcher',
    'utils': '../assets/js/libs/tools/utils',
    'moment': '../assets/js/libs/moment/moment',
    'sapp': '../assets/js/libs/modules/sapp'
  }

});


require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
  
});
