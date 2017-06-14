const login = require("facebook-chat-api");
const fs = require('fs');
var exports = module.exports= {};
var api;
login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, fbapi) => {
    api = fbapi;
});

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
        setTimeout(() => {
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

exports.text = function(content, exp, TheMessage, length) { //checks if the regex matches, if so, will send a text
    //if random number is needed
    //length represents range of random number
    if (exp.test(content)) {
        var ran = Math.floor(Math.random() * (length));
        api.sendMessage(TheMessage[ran], message.threadID);
    }
}

exports.easter = function(content, exp, TheMessage) { //for easter egg
    if (exp.test(content)) {
        api.sendMessage(TheMessage, message.threadID); //sends message to the group
    }
}

exports.synMashapeWord = function(url) {
    var msg = "";
    unirest.get(url).header("X-Mashape-Key", wordKey) //set header
    .header("Accept", "application/json") //set header
    .end((result) => {
        if (result.statusCode == 200) { //if no error in status code
            if (result.body.synonyms.length > 0) {
                for (let i = 0; i < result.body.synonyms.length; i++) { //adds each synonym in the list to the message
                    if (i === result.body.synonyms.length - 1)
                    msg += result.body.synonyms[i];
                    else
                    msg += result.body.synonyms[i] + ", ";
                }
                api.sendMessage(msg, message.threadID);
            } else {
                api.sendMessage("Error: No synonym found", message.threadID);
            }
        } else {
            api.sendMessage("Error: No synonym found", message.threadID);
        }
    });
}

exports.antMashapeWord = function(url) {
    var msg = "";
    unirest.get(url).header("X-Mashape-Key", wordKey) //set header
    .header("Accept", "application/json") //set header
    .end((result) => {
        if (result.statusCode == 200) { //if no error in status code
            if (result.body.antonyms.length > 0) {
                for (let i = 0; i < result.body.antonyms.length; i++) { //adds each synonym in the list to the message
                    if (i === result.body.antonyms.length - 1)
                    msg += result.body.antonyms[i];
                    else
                    msg += result.body.antonyms[i] + ", ";
                }
                api.sendMessage(msg, message.threadID);
            } else {
                api.sendMessage("Error: No antonyms found", message.threadID);
            }
        } else {
            api.sendMessage("Error: No antonyms found", message.threadID);
        }
    });
}

exports.defMashapeWord = function(url) { //request to Mashape server
    unirest.get(url).header("X-Mashape-Key", wordKey) //set header
    .header("Accept", "application/json") //set header
    .end((result) => {
        if (result.statusCode == 200) { //if no error in status code
            if (result.body.definitions.length >= 2) { //returns the first 2 definitions
                setTimeout(() => { //makes sure definition 2 comes after definition 1
                    api.sendMessage("-Definition 2: " + result.body.definitions[1].definition +
                    "\n-Part of Speech: " + result.body.definitions[1].partOfSpeech,
                    message.threadID);
                }, 300);
                api.sendMessage("-Definition 1: " + result.body.definitions[0].definition +
                "\n-Part of Speech: " + result.body.definitions[0].partOfSpeech, message.threadID);
            } else if (result.body.definitions.length >= 1) {
                api.sendMessage("-Definition 1: " + result.body.definitions[0].definition +
                "\n-Part of Speech: " + result.body.definitions[0].partOfSpeech, message.threadID);
            } else {
                api.sendMessage("Error: No definition found", message.threadID);
            }
        } else {
            api.sendMessage("Error: No definition found", message.threadID);
        }
    });
}

exports.kick = function(name){
    api.getUserID(name, (err, data) => {
        const id = data[0].userID; //user id for input name
        existsInGroup(id, message.threadID, (check) => {
            if (check) {
                api.removeUserFromGroup(id, message.threadID);
            } else {
                api.sendMessage(name + " is not in this group chat", message.threadID);
            }
        });
    });
}

exports.addToGroup = function(name, counter){
    api.getUserID(name, (err, data) => {
        const id = data[0].userID; //user id for input name
        existsInGroup(id, message.threadID, (exists) => {
            if (exists) { //the user is in this group chat
                api.sendMessage(name + " is already in this group chat", message.threadID);
            } else { //the user isn't in this group chat
            // setTimeout(() => { //delay between messages
            //     api.sendMessage("welcome, " + name, message.threadID);
            // }, 1);
            api.addUserToGroup(id, message.threadID, ()=>{
                existsInGroup(id, message.threadID, (exists) => {
                    if(!exists){
                        if(counter < 10){
                            add(name, counter+1);
                        }
                    }
                });
            });
        }
    });
});
}

exports.existsInGroup = function(id, threadID, callback) {//checks if a user exists in a group
var exist = false;
api.getThreadInfo(threadID, (err, info) => {
    for (let i = 0; i < info.participantIDs.length; i++) {
        if (info.participantIDs[i] == id) { //the user is in this group chat
            exist = true;
        }
    }
    if (exist) {
        callback(true);
    } else {
        callback(false);
    }
});
}

exports.downloadYT = function(link, filename, callback){
var video = youtubedl(link);
video.on('info', function(info) {
    api.sendMessage("This is gonna take a few seconds...", message.threadID);
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
});

video.pipe(fs.createWriteStream(filename)).on('close', callback);

}

exports.parseBody = function(url){
request.get(url, (error, response, body) => { //gets response from a url
    if(error){
        api.sendMessage("Error",message.threadID);
    }else {
        api.sendMessage(body, message.threadID);
    }
});
}
