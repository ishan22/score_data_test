var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var request =  require('request');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//post request from index.html
app.post('/sendFeatures', function(req, res) {
  var data = req.body;
  request({
    url: 'http://ishan:ScoreData4321@console.scoredata.com/api/score/',
    method: 'POST',
    headers: {
       'Content-Type': "application/json"
    },
    json: true,
    body: {
      'app_id': "03523f3a331b11e694f706f4115cbc5d",
      'feature_data': data.num_pregnant+','+data.glucose+','+data.pressure+','+data.riceps+','+data.serum+','+data.BMI+','+data.pedigree+','+data.age+','+data.diabetic,
      'debug_mode': '2'
    }
  }, function(err, response, body) {
    console.log(body.data.predict_score_response.pred_list[0]);
    console.log("Error" + err);
    if(body.data.predict_score_response.pred_list[0] === 1) {
      res.sendFile(path.join(__dirname + '/diabetic.html'));
    } else {
      res.sendFile(path.join(__dirname + '/nondiabetic.html'));
    }
  });
});

app.listen(8080);
