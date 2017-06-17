var url = 'mongodb://localhost:27017/myproject';
var exports = module.exports = {};
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

exports.connectDB = function(callback){
    MongoClient.connect(url, (err, db) => {
        if(err){
            callback(err, null);
        }else{
            console.log("Connected successfully to db");
            callback(null, db);
        }
    });
}

exports.collectionExists = function(db, collectionName, callback){
    var exists = false;
    db.collections((err, collections) => {
       if(err){
           throw err;
       } else {
           for(let i = 0; i < collections.length; i++){
               if(collections[i].s.name === collectionName){
                   exists = true;
               }
           }
           if(exists){
               callback(true);
           } else{
               callback(false);
           }
       }
  });
}

exports.insert = function(db, object, collection, callback){//insert document
    db.collection(collection).insertOne(object, (err, result) => {
        assert.equal(err, null);
        console.log(`Inserted a document into the ${collection} collection.`);
        callback();
    });
}

exports.deleteCol = function(db, collection, callback){//delete a collection
    db.collection(collection).drop((err, response) => {
        console.log(response);
        callback();
    });
}

exports.deleteDoc = function(db, object, collection, callback){//delete a document that satisfy the condition(object)
    db.collection(collection).deleteOne(object, (err, results) => {
         console.log(results);
         callback();
    });
}

exports.deleteMultiDoc = function(db, object, collection, callback){//delete all documents that satisfy the condition
    db.collection(collection).deleteMany(object, (err, results) => {//object(condition) can be a field for a document
         console.log(results);
         callback();
    });
}

exports.findAllDoc = function(db, collection, callback) {//return all documents in a collection
    var cursor = db.collection(collection).find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
}

exports.findDoc = function(db, object, collection, callback) {//returns the document that satisfy condition
    var cursor =db.collection(collection).find(object);
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
}
//Conditions can be specified by operators : $gt, $lt,
//{ <field1>: { <operator1>: <value1> } }
//{ "grades.score": { $gt: 30 }

//logical or : $or
//$or: [ { "cuisine": "Italian" }, { "address.zipcode": "10075" } ]

exports.updateDoc = function(db, condition, collection, callback) {
    db.collection(collection).updateOne(
        condition,
        {
            $set: { "FIELD": "NEW VALUE" }, //changes a field
            $currentDate: { "lastModified": true } //changes current date?
        }, function(err, results) {
            console.log(results);
            callback();
        });
}

exports.updateMultiDoc = function(db, condition, collection, callback) {
    db.collection(collection).updateMany(
        condition,
        {
            $set: { "FIELD": "NEW VALUE" }, //changes a field
            $currentDate: { "lastModified": true } //changes current date?
        }, function(err, results) {
            console.log(results);
            callback();
    });
}

exports.replaceDoc = function(db, condition, newDoc, collection, callback) {//replaces a document
    db.collection(collection).replaceOne(condition, newDoc, function(err, results) {
        console.log(results);
        callback();
    });
}

exports.ranColor = function() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 6; i++) { // Hex
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

exports.repeat = function(counter, interval, duration, code) { //recursively sets time interval
    if (counter < duration) {
        setTimeout(function() {
            counter++;
            eval(code); //executes a line of code
            repeat(counter, interval, duration, code); //recursion
        }, interval); //changes every half a second
    }
}

exports.download = function(url, filename, callback) {//downloads an image
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}
