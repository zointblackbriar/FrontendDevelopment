/**
 * Created by projecttest on 1/14/17.
 */

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var port = process.env.PORT || 2800; // define the port

app.use(bodyParser.json()); //parse application/json
app.use(express.static(__dirname + '/public')); //set the static files location /public/img will be /img for users

app.use(function(req, res) {
    //write into a file
    fs.writeFile('nodes.json', JSON.stringify(req.body), function(err) {
        if(err) return console.log(err);
        console.log('File created > nodes.json');
    });

    res.setHeader('Content-Type', 'application/json');
    res.write('Message taken: \n');
    res.end(req.body);
    res.send("OK");

});

//catch 404 and forwardäng to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handlers

//development error handler
// will print stacktrace
//return environment
if(app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//production error handler
//no stacktraces leaked to user
//Obviously you don't want to print a stack trace out on a production site that anyone on the web can see.
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //TODO It throws an an error. Needed to be fixed asap.
    //res.render('error', {
    //   message: err.message,
    //    error: {}
    //});
});


//routes =================================
require('./app/routes')(app); //pass our application into our routes

app.listen(port);
console.log('POC app listening on port 2800');
exports = module.exports = app;
