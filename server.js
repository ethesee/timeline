// Module dependencies.
var application_root = '.',
    express = require("express"), //Web framework
    formidable = require('formidable'), //middleware helps in parsing form data.
    path = require("path"), //Utilities for dealing with file paths
    util = require('util'),
    multer = require('multer'),
    fs = require('fs-extra'),
    mongoose = require('mongoose'); //MongoDB integration


 
//Create server
var app = express.createServer();
 
// Configure server
app.configure(function () {
    app.use(express.bodyParser()); //parses request body and populates req.body
    //app.use(express.bodyParser({uploadDir:'./uploads'}));
    app.use(express.methodOverride()); //checks req.body for HTTP method overrides
    app.use(app.router); //perform route lookup based on url and HTTP method
    app.use(express.static(path.join(application_root, "public"))); //Where to serve static content
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true })); //Show all errors in development
    
});
 
//Start server
app.listen(4711, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Routes
app.get('/api', function(req, res){
    res.send('service API is running');
});

//Connect to database
mongoose.connect('mongodb://localhost/amd_database');

//Schemas
// var Keywords = new mongoose.Schema({
    // keyword: String
// });



var Protocol = new  mongoose.Schema({
    company:String,
    protocol:String,
    checked: Boolean,
    emails: [String],
    timeline: [{id: Number, content: String, start: Date, end: Date}]
});
 
//Models
var ProtocolModel = mongoose.model('Protocol', Protocol);

//Get a list of all books
app.get('/api/protocols', function (req, res) {
    return ProtocolModel.find(function (err, protocols) {
        if (!err) {
            console.log("returning protocols");
            return res.send(protocols);
        } else {
            console.log("error getting protocols")
            return console.log(err);
        }
    });
});

app.get('/api/protocols/:id', function(req, res){
    return ProtocolModel.findById(req.params.id, function(err, protocol){
        if(!err){

            return res.send(protocol);
        } else {
            return console.log(err);
        }
    });
});


app.post('/api/protocols', function (req, res) {
    
    console.log("post req:", req);
    var protocol = new ProtocolModel({
        company:req.body.company,
        protocol:req.body.protocol,
        checked: req.body.checked,
        emails: req.body.emails,
        timeline: req.body.timeline
    });
    protocol.save(function (err) {
            if (!err) {
                return console.log('created');
            } else {
                return console.log(err);
            }
    });
     
   
    
    
    return res.send(protocol);
});

app.put('/api/protocols/:id', function(req, res){
    console.log('Updating protocol ' + req.body.company);
    return ProtocolModel.findById(req.params.id, function(err, protocol){
        protocol.company = req.body.company;
        protocol.protocol = req.body.protocol;
        protocol.checked = req.body.checked;
        protocol.emails = req.body.emails;
        protocol.timeline = req.body.timeline;

        return protocol.save(function(err){
            if(!err){
                console.log('protocol updated');
            } else {
                console.log(err);
            }
            return res.send(protocol);
        });
    });
});

app.delete('/api/protocols/:id', function(req, res){
    console.log('Deleting protocol with id: ' + req.params.id);
    return ProtocolModel.findById(req.params.id, function(err, protocol){
            // var imageFile = service.get('image');
            // if(imageFile){
            //     console.log("image file to be deleted:" + imageFile);
            //     var target_path = path.join(__dirname,'\\public\\uploads\\') + imageFile;
            //     fs.unlink(target_path, function() {
            //         if (err) {
            //             throw err;
            //         }else{
            //                 var profile_pic = req.files.photos[0].name;
            //                 //use profile_pic to do other stuffs like update DB or write rendering logic here.
            //         };
            //     });

            // }
        	return protocol.remove(function(err){
	            if(!err){
	                console.log('Protocol removed');
	                return res.send('');
	            } else {
	                console.log(err);
	            }
	        });
    });
});


//Persons



