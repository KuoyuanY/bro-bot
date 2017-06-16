"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const fs = require("fs");
const login = require("facebook-chat-api");
const func = require('./functions');
const cons = require('./constants');
const request = require("request");
const http = require('http');
const https = require('https');
const unirest = require('unirest');
const youtubedl = require('youtube-dl');
const wordKey = "YOUR_MASHAPE_API_KEY";
const wolframKey = "YOUR_WOLFRAM_ALPHA_API_KEY";

function isMuted(){

}

function isBanned(){

}

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
}, (err, api) => {
    api.setOptions({listenEvents: true});
    if (err) {
        return console.error(err); //if error occurs, return details
    }
    api.listen((err, message) => {
        if(){//check if current thread is stored in database, if not will add to database
            //when message is an event
            if(message.type === 'event'){

            }
            //when message is a message
            else if(message.type === 'message'){
                if(!isBanned(message.senderID)){//checks if a user is banned

                    //checks for easter eggs and sends messages
                    if (!isMuted(message.threadID)) {
                        //these are reation easter eggs
                        //angry react
                        if(cons.triggers.angryReacts.test(message.body)){
                            api.setMessageReaction(`😠`, message.messageID);
                        }
                        //laugh react
                        if(cons.triggers.mank.test(message.body)){
                            api.setMessageReaction(":haha:", message.messageID);
                        }
                        //love react
                        if(cons.triggers.loveReacts.test(message.body) ||
                        cons.triggers.youRight.test(message.body)){
                            api.setMessageReaction(`😍`, message.messageID);
                        }
                        //These are picture easter eggs
                        if(cons.triggers.nuts.test(message.body)){
                            const msg = {
                                attachment: fs.createReadStream(__dirname + '/pics/nuts.png')
                            };
                            api.sendMessage(msg, message.threadID);
                        }
                        if(cons.triggers.pregnant.test(message.body)){
                            const msg = {
                                attachment: fs.createReadStream(__dirname + '/pics/pregnant.png')
                            };
                            api.sendMessage(msg, message.threadID);
                        }
                        if (cons.triggers.wtf.test(message.body)) {
                            const msg = {
                                attachment: fs.createReadStream(__dirname + '/pics/WTF.png')
                            };
                            api.sendMessage(msg, message.threadID);
                        }
                        if (cons.triggers.holyShit.test(message.body)) {
                            const msg = {
                                attachment: fs.createReadStream(__dirname + '/pics/holyshit.png')
                            };
                            api.sendMessage(msg, message.threadID);
                        }
                        //These are message easter eggs
                        easter(message.body, cons.triggers.konami, cons.easterEggs.konami);
                        easter(message.body, cons.triggers.broCode, cons.easterEggs.broCode);
                        easter(message.body, cons.triggers.wasabi, cons.easterEggs.wasabi);
                        easter(message.body, cons.triggers.merit, cons.easterEggs.merit);
                        easter(message.body, cons.triggers.brownie, cons.easterEggs.brownie);
                        easter(message.body, cons.triggers.fbla, cons.easterEggs.fbla);
                    }
                    //checks for help commands
                    easter(message.body, cons.commands.triviaNumber, cons.triggers.commandExplanation.triviaNumber);
                    easter(message.body, cons.commands.triviaMath, cons.triggers.commandExplanation.triviaMath);
                    easter(message.body, cons.commands.triviaDate, cons.triggers.commandExplanation.triviaDate);
                    easter(message.body, cons.commands.triviaYear, cons.triggers.commandExplanation.triviaYear);
                    easter(message.body, cons.commands.r, cons.triggers.commandExplanation.r);
                    easter(message.body, cons.commands.mute, cons.triggers.commandExplanation.mute);
                    easter(message.body, cons.commands.unmute, cons.triggers.commandExplanation.unmute);
                    easter(message.body, cons.commands.greet, cons.triggers.commandExplanation.greet);
                    easter(message.body, cons.commands.hitTheLights, cons.triggers.commandExplanation.hitTheLights);
                    easter(message.body, cons.commands.answer, cons.triggers.commandExplanation.answer);
                    easter(message.body, cons.commands.honest, cons.triggers.commandExplanation.honest);
                    easter(message.body, cons.commands.search, cons.triggers.commandExplanation.search);
                    easter(message.body, cons.commands.gtfo, cons.triggers.commandExplanation.gtfo);
                    easter(message.body, cons.commands.kick, cons.triggers.commandExplanation.kick);
                    easter(message.body, cons.commands.add, cons.triggers.commandExplanation.add);
                    easter(message.body, cons.commands.wakeUp, cons.triggers.commandExplanation.wakeUp);
                    easter(message.body, cons.commands.set, cons.triggers.commandExplanation.set);
                    easter(message.body, cons.commands.define, cons.triggers.commandExplanation.define);
                    easter(message.body, cons.commands.synonym, cons.triggers.commandExplanation.synonym);
                    //these are messages that require random number
                    text(message.body, cons.triggers.why, cons.triggers.reasons, cons.triggers.reasons.length);
                    text(message.body, cons.triggers.what, cons.triggers.things, cons.triggers.things.length);
                    text(message.body, cons.triggers.when, cons.triggers.times, cons.triggers.times.length);
                    text(message.body, cons.triggers.where, cons.triggers.places, cons.triggers.places.length);
                    text(message.body, cons.triggers.howMuch, cons.triggers.amount, cons.triggers.amount.length);
                    if (!cons.triggers.howMuch.test(message.body)) {
                        text(message.body, cons.triggers.how, cons.triggers.ways, cons.triggers.ways.length);
                    }
                    text(message.body, cons.triggers.who, cons.triggers.people, cons.triggers.people.length);
                    if (!cons.triggers.why.test(message.body) && !cons.triggers.what.test(message.body)
                    && !cons.triggers.when.test(message.body) && !cons.triggers.when.test(message.body)
                    && !cons.triggers.where.test(message.body) && !cons.triggers.howMuch.test(message.body)
                    && !cons.triggers.how.test(message.body) && !cons.triggers.who.test(message.body)) {
                        text(message.body, cons.triggers.honestAnswer, cons.triggers.answers, cons.triggers.answers.length);
                    }

                    if(cons.triggers.tldr.test(message.body)){

                    }

                    if(cons.triggers.endTopic.test(message.body)){

                    }

                    if(cons.triggers.startTopic.test(message.body)){

                    }

                    if(cons.triggers.trivia.test(message.body)){
                        const position = message.body.indexOf(cons.triggers.trivia) + 12;
                        const substring = message.body.substring(position);
                        const query = substring.split(" ")[1];
                        const type = substring.split(" ")[0];
                        console.log(query + " and " + type);
                        var url = 'http://numbersapi.com/';
                        switch (type) {
                            case 'number':
                            url += query;
                            parseBody(url);
                            break;
                            case 'year':
                            url += query + '/year';
                            parseBody(url);
                            break;
                            case 'date':
                            url += query + '/date';
                            parseBody(url);
                            break;
                            case 'math':
                            url += query + '/math';
                            parseBody(url);
                            break;
                            default:
                            api.sendMessage("Error input", message.threadID);
                        }
                    }

                    if(/bro alive/i.test(message.body)){
                        api.sendMessage('<3' ,message.threadID);
                    }

                    if(cons.triggers.r.test(message.body)){
                        const pos = message.body.search(cons.triggers.r) + 4;
                        var query = message.body.substring(pos);
                        if(/[^a-zA-Z0-9\/]+/i.test(query)){//checks for valid query
                            api.sendMessage("Invalid subreddit", message.threadID);
                        } else{
                            const url = `https://www.reddit.com/` + query + `/top.json?t=all&sort=top&limit=1000`;
                            request.get(url, (error, response, Body) => { //gets top posts from r/dankmemes
                                if(response){
                                    if(response.statusCode === 200){
                                        const answer = JSON.parse(Body);
                                        var rng = Math.floor(Math.random()*answer.data.children.length);
                                        console.log(answer.data.children[rng]);
                                        var link = answer.data.children[rng].data.url;
                                        if(/comment/i.test(link)){//the post is text only
                                            api.sendMessage("Hold on, this is going to take a while...", message.threadID);
                                            var msg = {
                                                body: `Title: \n${answer.data.children[rng].data.title}`,
                                                url: link
                                            };
                                            var mar;
                                            if (answer.data.children[rng].data.selftext!==''){//if the post has a body text
                                                var words = answer.data.children[rng].data.selftext.split(" ");
                                                if(words.length > 60){//only select first 60 words
                                                    words = words.slice(0, 61);
                                                    mar = words.join(" ");
                                                    mar += " ...";
                                                } else {
                                                    mar = words.join(" ");
                                                }
                                                msg.body+="\nBody:\n" + mar;
                                            }
                                            api.sendMessage(msg, message.threadID);
                                        }else if(/youtu\.be|youtube\.com|vid\.me|streamable\.com/i.test(link)){//the post is a video
                                            var msg = {
                                                body: `Title: ${answer.data.children[rng].data.title}`,
                                                url: link
                                            };
                                            api.sendMessage(msg, message.threadID);
                                        }else if(/\.gif$/i.test(link)){//the post is a gif file
                                            api.sendMessage("Give me a sec...", message.threadID);
                                            func.download(link, "subreddit.gif", () => {
                                                console.log("downloaded gif");
                                                var msg = {
                                                    body: answer.data.children[rng].data.title,
                                                    attachment: fs.createReadStream('subreddit.gif')
                                                }
                                                api.sendMessage(msg, message.threadID, ()=>{
                                                    fs.unlink('subreddit.gif', (err) => {//deletes the gif after use
                                                        if (err) throw err;
                                                        console.log('deleted gif');
                                                    });
                                                })
                                            })
                                        }else if(/gfycat\.com/i.test(link)){//the post is a gif link
                                            var msg = {
                                                body: answer.data.children[rng].data.title,
                                                url: link
                                            };
                                            api.sendMessage(msg, message.threadID);
                                        }else if(/\.gifv/i.test(link)){//gif from imgur
                                            api.sendMessage("Hold on, this is going to take a while...", message.threadID);
                                            var start = new Date().getTime();
                                            var pos = answer.data.children[rng].data.url.search(".gifv");
                                            var identifier = answer.data.children[rng].data.url.substring(0, pos);
                                            identifier+=".mp4";
                                            console.log(identifier);
                                            func.download(identifier, 'dank.mp4', ()=> {//downloads the image
                                                console.log("downloaded gif");
                                                var msg = {
                                                    body: answer.data.children[rng].data.title,
                                                    attachment: fs.createReadStream('dank.mp4')
                                                };
                                                api.sendMessage(msg, message.threadID, ()=>{
                                                    fs.unlink('dank.mp4', (err) => {//deletes the image after use
                                                        if (err) throw err;
                                                        console.log('deleted gif');
                                                        var end = new Date().getTime();
                                                        console.log(end-start + " ms");
                                                    });
                                                });
                                            });
                                        }else {//the post is a picture
                                            func.download(link, 'dank.png', ()=> {//downloads the image
                                                console.log("downloaded image");
                                                var msg = {
                                                    body: answer.data.children[rng].data.title,
                                                    attachment: fs.createReadStream('dank.png')
                                                };
                                                api.sendMessage(msg, message.threadID, ()=>{
                                                    fs.unlink('dank.png', (err) => {//deletes the image after use
                                                        if (err) throw err;
                                                        console.log('deleted image');
                                                    });
                                                });
                                            });
                                        }
                                        //  else {//can't identify the type of post
                                        //     api.sendMessage("Uhhh...\nTry again..." ,message.threadID)
                                        // }
                                    }
                                }
                            });
                        }
                    }

                    if (cons.triggers.greet.test(message.body)) {
                        var ran = Math.floor(Math.random() * cons.triggers.greetings.length);
                        var aMessage = cons.triggers.greetings;
                        api.sendMessage(aMessage[ran], message.threadID);
                    }

                    if (cons.triggers.define.test(message.body)) { //checking for bro define
                        var word = message.body.split(" define ")[1];
                        const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/definitions";
                        defMashapeWord(url); //calls requestMashape function
                    }

                    if (cons.triggers.synonym.test(message.body)) { //checking for bro define
                        var word = message.body.split(" synonym ")[1];
                        const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms";
                        synMashapeWord(url); //calls requestMashape function
                    }

                    if (cons.triggers.antonym.test(message.body)) { //checking for bro define
                        var word = message.body.split(" antonym ")[1];
                        const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/antonyms";
                        antMashapeWord(url); //calls requestMashape function
                    }

                    if (cons.triggers.set.test(message.body)) { //checking for bro set
                        if (cons.triggers.nickname.test(message.body)) { //checking for keyword nickname
                            const arr = message.body.split(" nickname"); //array of split string
                            const nick = arr[1]; //the desired nickname for a user
                            const name = arr[0].substring(8);
                            api.getUserID(name, (err, data) => {
                                const id = data[0].userID;
                                existsInGroup(id, message.threadID, (exists) => {
                                    if (exists) {
                                        api.changeNickname(nick, message.threadID, id);
                                    } else {
                                        api.sendMessage(name + " isn't in this groupchat", message.threadID);
                                    }
                                });
                            });
                        }
                    }
                    if (cons.triggers.search.test(message.body)) { //searches for a fb user
                        const name = message.body.substring(message.body.search(cons.triggers.search) + 11);
                        api.getUserID(name, (err, data) => {
                            if (err) {
                                var errMessage = err.error.replace("Bes", "Best");
                                api.sendMessage(errMessage, message.threadID);
                            } else {
                                const id = data[0].userID;
                                api.getUserInfo(id, (err, info) => {
                                    const url ='http://graph.facebook.com/'+id+'/picture?type=large';
                                    func.download(url, 'profile.png', ()=> {//downloads the image
                                        console.log("downloaded");
                                        const msg = {
                                            body:"Best match: " + info[id].name + "\n" + info[id].profileUrl,
                                            attachment: fs.createReadStream('profile.png')
                                        }
                                        api.sendMessage(msg, message.threadID, ()=>{
                                            fs.unlink('profile.png', (err) => {//deletes the image after use
                                                if (err)
                                                console.log(err);
                                                console.log('successfully deleted image');
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                    if (cons.triggers.answer.test(message.body)) { //implements wolfram alpha short answer api
                        const mess = message.body.split(" answer ");
                        const original = mess[1];
                        const lmgtfyQuest = "http://lmgtfy.com/?q="+original.replace(/ /g, "+");
                        const question = encodeURIComponent(original); // question to be put in url
                        const url = `http://api.wolframalpha.com/v1/result?appid=${wolframKey}` + question;
                        request.get(url, (error, response, body) => { //gets response from wolfram alpha short answer api
                            if (body.toString() === "Wolfram|Alpha did not understand your input") {
                                api.sendMessage(lmgtfyQuest, message.threadID);
                            } else if (body.toString().match(/wolfram alpha/i)) {
                                api.sendMessage(lmgtfyQuest, message.threadID);
                            } else
                            api.sendMessage(body, message.threadID);
                        });
                    }
                    if (cons.triggers.wake.test(message.body)) { //if calls bro wake up
                        const delay = 500;
                        const name = message.body.substring(message.body.search(cons.triggers.wake) + 12);
                        api.getUserID(name, (err, data) => {
                            const id = data[0].userID; //user id for input name
                            existsInGroup(id, message.threadID, (exists) => {
                                if (exists) { //user is in this chat
                                    api.sendMessage("messaged " + name + " 10 times", message.threadID);
                                    for (let i = 0; i < 10; i++) {
                                        setTimeout(() => { //delay between messages
                                            api.sendMessage("hey, wake up!", id);
                                        }, delay + i * delay);
                                    }
                                } else { //the user isn't in this group chat
                                var senderID = message.senderID;
                                api.getUserInfo(senderID, (err, info) => {
                                    api.sendMessage("Hi, " + info[senderID].name +
                                    " wanted me to wake you up", id);
                                    api.sendMessage("messaged " + name, message.threadID);
                                });
                            }
                        });
                    });
                }
                if (cons.triggers.kick.test(message.body)) { //if calls bro kick
                    var name = message.body.substring(message.body.search(cons.triggers.kick) + 9);
                    var hasDuration = false;
                    var exists = false;
                    var arr = [0, 0]; //placeholder
                    var duration = 0; //placeholder
                    if (/\d/g.test(name)) {
                        hasDuration = true;
                        arr = name.split(" ");
                        duration = arr[arr.length - 1];
                        var temp = arr.join(" ");
                        name = temp.substring(0, temp.length - 1 - duration.length);
                    }
                    api.getUserID(name, (err, data) =>{
                        var id = data[0].userID;
                        if(id == 100015471968272){
                            api.sendMessage("Nice try", message.threadID);
                        } else {
                            if (!hasDuration) {
                                setTimeout(() => { //delay between messages
                                    kick(name);
                                }, 1000);
                                api.sendMessage("You don't belong here, " + name, message.threadID);
                            } else {//add back after duration
                                existsInGroup(id, message.threadID, (exists) => {
                                    if(exists){
                                        setTimeout(() => {
                                            add(name, 0);
                                        }, duration * 1000);
                                        kick(name);
                                    } else {
                                        api.sendMessage("User is not in this chat", message.threadID);
                                    }
                                })
                            };
                        }
                    })

                }


                if (cons.triggers.add.test(message.body)) { //if calls bro add
                    const name = message.body.substring(message.body.search(cons.triggers.add) + 8);
                    add(name, 0);
                }

                if (cons.triggers.hitTheLights.test(message.body)) {
                    func.repeat(0, 500, 10, "api.changeThreadColor(func.ranColor(), message.threadID)");
                }
                if (cons.triggers.help.test(message.body)) { // description of what bot can do
                    api.sendMessage(cons.triggers.basic, message.threadID);
                }
            }
            function text(content, exp, TheMessage, length) { //checks if the regex matches, if so, will send a text
                //if random number is needed
                //length represents range of random number
                if (exp.test(content)) {
                    var ran = Math.floor(Math.random() * (length));
                    api.sendMessage(TheMessage[ran], message.threadID);
                }
            }



            function easter(content, exp, TheMessage) { //for easter egg
                if (exp.test(content)) {
                    api.sendMessage(TheMessage, message.threadID); //sends message to the group
                }
            }

            function synMashapeWord(url) {
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

            function antMashapeWord(url) {
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

            function defMashapeWord(url) { //request to Mashape server
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

            function isAGroup(groupID) {//checks if a thread is a group
                api.getThreadInfo(groupID, (err, info) => {
                    return info.participantIDs.length > 2;
                });
            }

            function kick(name){
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

            function add(name, counter){
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

        function existsInGroup(id, threadID, callback) {//checks if a user exists in a group
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

        function downloadYT(link, filename, callback){
            var video = youtubedl(link);
            video.on('info', function(info) {
                api.sendMessage("This is gonna take a few seconds...", message.threadID);
                console.log('Download started');
                console.log('filename: ' + info._filename);
                console.log('size: ' + info.size);
            });
            video.pipe(fs.createWriteStream(filename)).on('close', callback);
        }

        function parseBody(url){
            request.get(url, (error, response, body) => { //gets response from a url
                if(error){
                    api.sendMessage("Error",message.threadID);
                }else {
                    api.sendMessage(body, message.threadID);
                }
            });
        }

        function member(Fname, Lname, name, pid, score){//member class
            this.Fname = Fname;
            this.Lname = Lname;
            this.name = name;
            this.pid = pid;
            this.score = score;

            member.prototype.Json = function Json(){//returns json format of the member
                var json = {
                    "First Name" : Fname,
                    "Last Name" : Lname,
                    "Full Name" : name,
                    "Facebook ID" : pid,
                    "Score" : score
                };
                return json;
            }
        }
    }
        } else {
            func.connectDB((err, db)=>{//open connection
                if(db){
                    api.getThreadInfo(message.threadID, (err, info)=>{
                        console.log(info);
                        var data = {//to be stored

                        };
                        func.insert(db, ?, message.threadID, ()=>{
                            db.close();
                        });
                    });
                }else{
                    console.log(err);
                }
            });
        }
});
});
