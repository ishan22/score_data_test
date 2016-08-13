var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var request =  require('request');

var score;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/diabetic', function(req, res) {
  res.sendFile(path.join(__dirname + '/diabetic_form.html'));
});

app.get('/cancer', function(req, res) {
  res.sendFile(path.join(__dirname + '/cancer_form.html'));
});

//post request from cancer_form.html
app.post('/cancerApp', function(req, res) {
  var data = req.body;
  request({
    url: 'http://ishan:ScoreData4321@console.scoredata.com/api/score/',
    method: 'POST',
    headers: {
       'Content-Type': "application/json"
    },
    json: true,
    body: {
      'app_id': "32de6aca577a11e6862106f4115cbc5d",
      'feature_data': data.patient_id+','+data.clump+','+data.cell_size+','+data.cell_shape+','+data.adhesion+','+data.single_cell+','
      +data.bare_nuclei+','+data.chromatin+','+data.nucleoli+','+data.mitoses+',0',
      'debug_mode': '1'
    }
  }, function(err, response, body) {
    console.log(body);
    score = body.data.predict_score_response.pred_list[0] === 1 ? body.data.predict_score_response.prediction.class1 : body.data.predict_score_response.prediction.class0;
  //  console.log("Error" + err);
    console.log("Score: " + score);
    if(body.data.predict_score_response.pred_list[0] === 1) {
      res.sendFile(path.join(__dirname + '/malignant.html'));
    } else {
      res.sendFile(path.join(__dirname + '/benign.html'));
    }
  });
});

//post request from diabetic_form.html
app.post('/diabeticApp', function(req, res) {
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
      'feature_data': data.num_pregnant+','+data.glucose+','+data.pressure+','+data.riceps+','+data.serum+','+data.BMI+','+data.pedigree+','+data.age+',0',
      'debug_mode': '1'
    }
  }, function(err, response, body) {
    console.log(body.data);
    score = body.data.predict_score_response.pred_list[0] === 1 ? body.data.predict_score_response.prediction.class1 : body.data.predict_score_response.prediction.class0;
  //  console.log("Error" + err);
    console.log("Score: " + score);
    if(body.data.predict_score_response.pred_list[0] === 1) {
      res.sendFile(path.join(__dirname + '/diabetic.html'));
    } else {
      res.sendFile(path.join(__dirname + '/nondiabetic.html'));
    }
  });
});

app.get('/sendFeatures', function(req, res) {
  res.send({
    'score': score
  });
});


app.listen(8080);
