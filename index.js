var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
     app.use(express.static('public'))
     res.sendFile(path.join(__dirname + '/index.html'));

});

app.listen(process.env.PORT || 3000);
