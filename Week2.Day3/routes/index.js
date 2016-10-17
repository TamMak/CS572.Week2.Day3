var express = require('express');
var router = express.Router();

//db part
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/locationForm', function(req, res, next) {
	  res.render('location');
	});

router.get('/locationSearchForm', function(req, res, next) {
	  res.render('locationSearch');
	});

router.get('/searchLocation', function(req, res, next){
    
	 mongoClient.connect(url, function(err,db){
		 
		 if(err){
			 throw err;
		 }else{
		 
		var currentLong = req.body.currentLongitude;
		var currentLat =  req.body.currentLatitude;
	
		var resultArray =[];
		
		db.locationdata.createIndex({location: '2d'});

		 var cursor = db.collection('locationdata').find(
				{ location : { $near : [currentLong, currentLat], $maxDistance: 1000 } }).limit(3);
		
		cursor.forEach(function(doc, err){
			       
			               resultArray.push(doc);
			               
					 }, function(){
						 
						 console.log(resultArray.length);
						
						 db.close();
						 res.render('resultPage', {items: resultArray});
					 });
		
	          }	});
	 });

router.post('/insertData', function(req, res, next) {
	//db.collection.insert{name = '', name= 'restauranr', location:[long,lat]}
	var item = {
			name: req.body.name,
			category: req.body.category,
			type: 'point',
			location:[req.body.longitude,req.body.latitude],
			address: req.body.address,
			message: req.body.message
	             };
	
	mongoClient.connect(url, function(err, db){		
		db.collection('locationdata').insert(item, function(err, result){				
			console.log('Item inserted>>>>>');
			db.close();
		});
	});
});


module.exports = router;
