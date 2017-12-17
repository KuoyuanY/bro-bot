"use strict";
const fs = require("fs");
const login = require("facebook-chat-api");
const func = require('./constants');
const request = require("request");
const http = require('http');
const https = require('https');
const unirest = require('unirest');
const youtubedl = require('youtube-dl');
const wordKey = "API key";
const wolframKey = "your key";

var counterTLDR;
var banList = [];
var cheatList = [];

function ranColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 6; i++) { // Hex
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

login({
    appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
}, (err, api) => { //reads appstate file and logs in
    if (err) {
        return console.error(err); //if error occurs, return details
    }
    api.listen((err, message) => {
        function text(content, exp, TheMessage, length) { //checks if the regex matches, if so, will send a text
            //if random number is needed
            //length represents range of random number
            if (exp.test(content)) {
                var ran = Math.floor(Math.random() * (length));
                api.sendMessage(TheMessage[ran], message.threadID);
            }
        }

        function repeat(counter, interval, duration, code) { //recursively sets time interval
            if (counter < duration) {
                setTimeout(function() {
                    counter++;
                    eval(code); //executes a line of code
                    repeat(counter, interval, duration, code); //recursion
                }, interval); //changes every half a second
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

        function isBanned(id){//checks if a user is banned
            for(let i = 0; i < banList.length; i++){
                if(id==banList[i]){
                    return true;
                }
            }
            return false;
        }

        function isCheating(id){//checks if a user is using konami code
            for(let i = 0; i < cheatList.length; i++){
                if(id==cheatList[i]){
                    return true;
                }
            }
            return false;
        }

        function ban(id){//adds user to ban list
            banList.push(id);
        }

        function unban(id){//unbans a user
            var index = banList.indexOf(id);
            banList.splice(index, 1);
        }

        function unCheat(id){//uncheat a user
            if(isCheating(id)){
                var index = cheatList.indexOf(id);
                cheatList.splice(index, 1);
            }
        }

        function cheat(id){//adds user to cheat list
            cheatList.push(id);
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

    function download(url, filename, callback) {//downloads an image
        request.head(url, function(err, res, body){
            request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

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

    function addGroups() {//stores groups
        var limit = 50;
        api.getThreadList(0, limit, 'inbox', (err, arr) => {
            for (let i = 0; i < limit; i++) {

            }
        });
    }

    function vote(upOrDown, groupID) {//up or down voting someone
        api.getThreadInfo(groupID, (err, info) => {
            for (let i = 0; i < info.participantIDs.length; i++) {

            }
        });
    }

    function reddit(query){
        if(/[^a-zA-Z0-9_\/]+/i.test(query)){//checks for valid query
            api.sendMessage("Invalid subreddit", message.threadID);
        } else{
            console.log("in reddit");
            console.log(query);
            const url = `https://www.reddit.com/` + query + `/top.json?t=all&sort=top&limit=1000`;
            request.get(url, (error, response, Body) => { //gets top posts from r/dankmemes
                if(response){
                    if(response.statusCode === 200){
                        const answer = JSON.parse(Body);
                        var rng = Math.floor(Math.random()*answer.data.children.length);
                        console.log(answer.data.children[rng]);
                        var link = answer.data.children[rng].data.url;
                        if(/comment/i.test(link)){//the post is text only
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
                            download(link, "subreddit.gif", () => {
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
                            var pos = answer.data.children[rng].data.url.search(".gifv");
                            var identifier = answer.data.children[rng].data.url.substring(0, pos);
                            identifier+=".mp4";
                            console.log(identifier);
                            download(identifier, 'dank.mp4', ()=> {//downloads the image
                                api.sendMessage("Hold on, this is going to take a while...", message.threadID);
                                console.log("downloaded mp4");
                                var msg = {
                                    body: answer.data.children[rng].data.title,
                                    attachment: fs.createReadStream('dank.mp4')
                                };
                                api.sendMessage(msg, message.threadID, ()=>{
                                    fs.unlink('dank.mp4', (err) => {//deletes the image after use
                                        if (err) throw err;
                                        console.log('deleted mp4');
                                    });
                                });
                            });
                        }else if(/\.(png|jpg)$/i.test(link)){// the post is a picture
                            download(link, 'dank.png', ()=> {//downloads the image
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
                        }else if(/imgur\.com/i.test(link)){//from imgur
                            request({
                               url : link
                            }, (err, res, body) =>{
                               var curr = body;
                               var pos = curr.search(/<div class="post-image">/);
                               curr = curr.substring(pos);
                               var imgurPos = curr.search(/i\.imgur/);
                               curr = curr.substring(imgurPos);
                               var endPos = curr.search(/\.(jpg|png)/) + 4;
                               var imageurl = "http://" + curr.substring(0, endPos);


                               download(imageurl, "dank.png", ()=> {//downloads the image
                                   console.log("downloaded image");
                                   var msg = {
                                       body: answer.data.children[rng].data.title,
                                       attachment: fs.createReadStream("dank.png")
                                   };
                                   api.sendMessage(msg, message.threadID, ()=>{
                                       fs.unlink("dank.png", (err) => {//deletes the image after use
                                           if (err) throw err;
                                           console.log('deleted image');
                                       });
                                   });
                               });
                           });
                        }else {//can't identify the type of post
                             api.sendMessage("Something went wrong, \nTry again." ,message.threadID)
                        }
                    }
                }
            });
        }
    }

    if(!isBanned(message.senderID)){//checks if a user is banned
        //checks for easter eggs and sends messages
            //these are reation easter eggs
            //angry react

            //laugh react
            if(func.triggers.mank.test(message.body)){
                api.setMessageReaction(":haha:", message.messageID);
            }
            //love react
            if(func.triggers.loveReacts.test(message.body) ||
            func.triggers.youRight.test(message.body)){
                api.setMessageReaction(`😍`, message.messageID);
            }
            //These are picture easter eggs
            if(func.triggers.pregnant.test(message.body)){
                const msg = {
                    attachment: fs.createReadStream(__dirname + '/pics/pregnant.png')
                };
                api.sendMessage(msg, message.threadID);
            }
            if (func.triggers.wtf.test(message.body)) {
                const msg = {
                    attachment: fs.createReadStream(__dirname + '/pics/WTF.png')
                };
                api.sendMessage(msg, message.threadID);
            }
            if (func.triggers.holyShit.test(message.body)) {
                const msg = {
                    attachment: fs.createReadStream(__dirname + '/pics/holyshit.png')
                };
                api.sendMessage(msg, message.threadID);
            }
            //These are message easter eggs
            easter(message.body, func.triggers.konami, func.easterEggs.konami);
            easter(message.body, func.triggers.broCode, func.easterEggs.broCode);
            easter(message.body, func.triggers.wasabi, func.easterEggs.wasabi);
            easter(message.body, func.triggers.merit, func.easterEggs.merit);
            easter(message.body, func.triggers.brownie, func.easterEggs.brownie);
            easter(message.body, func.triggers.fbla, func.easterEggs.fbla);
        //checks for help commands
        easter(message.body, func.commands.triviaNumber, func.triggers.commandExplanation.triviaNumber);
        easter(message.body, func.commands.triviaMath, func.triggers.commandExplanation.triviaMath);
        easter(message.body, func.commands.triviaDate, func.triggers.commandExplanation.triviaDate);
        easter(message.body, func.commands.triviaYear, func.triggers.commandExplanation.triviaYear);
        easter(message.body, func.commands.r, func.triggers.commandExplanation.r);
        easter(message.body, func.commands.greet, func.triggers.commandExplanation.greet);
        easter(message.body, func.commands.answer, func.triggers.commandExplanation.answer);
        easter(message.body, func.commands.honest, func.triggers.commandExplanation.honest);
        easter(message.body, func.commands.search, func.triggers.commandExplanation.search);
        easter(message.body, func.commands.gtfo, func.triggers.commandExplanation.gtfo);
        easter(message.body, func.commands.kick, func.triggers.commandExplanation.kick);
        easter(message.body, func.commands.add, func.triggers.commandExplanation.add);
        easter(message.body, func.commands.wakeUp, func.triggers.commandExplanation.wakeUp);
        easter(message.body, func.commands.set, func.triggers.commandExplanation.set);
        easter(message.body, func.commands.define, func.triggers.commandExplanation.define);
        easter(message.body, func.commands.synonym, func.triggers.commandExplanation.synonym);
        //these are messages that require random number
        text(message.body, func.triggers.why, func.triggers.reasons, func.triggers.reasons.length);
        text(message.body, func.triggers.what, func.triggers.things, func.triggers.things.length);
        text(message.body, func.triggers.when, func.triggers.times, func.triggers.times.length);
        text(message.body, func.triggers.where, func.triggers.places, func.triggers.places.length);
        text(message.body, func.triggers.howMuch, func.triggers.amount, func.triggers.amount.length);
        if (!func.triggers.howMuch.test(message.body)) {
            text(message.body, func.triggers.how, func.triggers.ways, func.triggers.ways.length);
        }
        text(message.body, func.triggers.who, func.triggers.people, func.triggers.people.length);
        if (!func.triggers.why.test(message.body) && !func.triggers.what.test(message.body)
        && !func.triggers.when.test(message.body) && !func.triggers.when.test(message.body)
        && !func.triggers.where.test(message.body) && !func.triggers.howMuch.test(message.body)
        && !func.triggers.how.test(message.body) && !func.triggers.who.test(message.body)) {
            text(message.body, func.triggers.honestAnswer, func.triggers.answers, func.triggers.answers.length);
        }

        if(func.triggers.tldr.test(message.body)){

        }

        if(func.triggers.endTopic.test(message.body)){

        }

        if(func.triggers.startTopic.test(message.body)){

        }

        if(func.triggers.trivia.test(message.body)){
            const position = message.body.indexOf(func.triggers.trivia) + 12;
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

        if (func.triggers.cheat.test(message.body)) { //super command that can only be accessed with konami code
            api.getUserInfo(message.senderID, (err, info)=>{
                setTimeout(()=> {
                    unCheat(message.senderID);
                    api.sendMessage("Cheat deactivated for " + info[message.senderID].name,message.threadID);
                }, 20000);
                cheat(message.senderID);
                api.sendMessage("Cheat activated. You have a 10 second window to use the super command: bro mess up {user}"
                , message.threadID);
            });
        }

        if(func.triggers.ban.test(message.body)){//bans a user
            if(message.senderID == 100006135968528){
                const name = message.body.substring(8);
                api.getUserID(name, (err, data)=>{
                    const id = data[0].userID;
                    existsInGroup(id, message.threadID, (exists)=>{
                        if(exists){
                            if(banList.includes(id)){
                                api.sendMessage(name + " is already banned", message.threadID);
                            }else{
                                ban(id);
                                api.sendMessage("User is now banned.", message.threadID);
                            }
                        }else{
                            api.sendMessage(name + " isn't in this groupchat", message.threadID);
                        }
                    });
                });
            } else {
                api.sendMessage("You do not have permission to this command", message.threadID)
            }
        }

        if(func.triggers.r.test(message.body)){
            const pos = message.body.search(func.triggers.r) + 4;
            var query = message.body.substring(pos);
            reddit(query);
        }

        if(/^bro food/i.test(message.body)){
            var list = ["r/prettygirls", "r/gentlemanboners", "r/celebs"];
            var subreddit = list[Math.floor(Math.random()*3)];
            reddit(subreddit);
        }
        if(/^bro mooncake/i.test(message.body)){
            reddit("r/realasians");
        }

        if(/^bro paneer/i.test(message.body)){
            reddit("r/indiangirls");
        }


        if(func.triggers.unban.test(message.body)){//unbans a user
            if(message.senderID == 100006135968528){
                const name = message.body.substring(10);
                api.getUserID(name, (err, data)=>{
                    const id = data[0].userID;
                    existsInGroup(id, message.threadID, (exists)=>{
                        if(exists){
                            if(banList.includes(id)){
                                unban(id);
                                api.sendMessage(name + " is now unbanned", message.threadID);
                            }else{
                                api.sendMessage("User is not banned", message.threadID);
                            }
                        }else{
                            api.sendMessage(name + " isn't in this groupchat", message.threadID);
                        }
                    });
                });
            } else {
                api.sendMessage("You do not have permission to this command", message.threadID)
            }
        }

        if(func.triggers.messUp.test(message.body)){//super command
            const name = message.body.substring(11);
            if(isCheating(message.senderID)){

                api.sendMessage("I'm gonna mess em up. Here I come!",message.threadID);
                unCheat(message.senderID);
            }else{
                api.sendMessage("You do not have permission to this command", message.threadID);
            }
        }
        // if(func.triggers.upvote.test(message.body)){//checks for the command upvote
        //   const name = message.body.split(" ")[2];
        //
        //
        // } else if(func.triggers.downvote.test(message.body){//checks for the command downvote
        //
        // }
        if (func.triggers.greet.test(message.body)) {
            var ran = Math.floor(Math.random() * func.triggers.greetings.length);
            var aMessage = func.triggers.greetings;
            api.sendMessage(aMessage[ran], message.threadID);
        }

        if (func.triggers.define.test(message.body)) { //checking for bro define
            var word = message.body.split(" define ")[1];
            const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/definitions";
            defMashapeWord(url); //calls requestMashape function
        }

        if (func.triggers.synonym.test(message.body)) { //checking for bro define
            var word = message.body.split(" synonym ")[1];
            const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms";
            synMashapeWord(url); //calls requestMashape function
        }

        if (func.triggers.antonym.test(message.body)) { //checking for bro define
            var word = message.body.split(" antonym ")[1];
            const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/antonyms";
            antMashapeWord(url); //calls requestMashape function
        }

        if (func.triggers.set.test(message.body)) { //checking for bro set
            if (func.triggers.nickname.test(message.body)) { //checking for keyword nickname
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
        if (func.triggers.search.test(message.body)) { //searches for a fb user
            const name = message.body.substring(message.body.search(func.triggers.search) + 11);
            api.getUserID(name, (err, data) => {
                if (err) {
                    var errMessage = err.error.replace("Bes", "Best");
                    api.sendMessage(errMessage, message.threadID);
                } else {
                    const id = data[0].userID;
                    api.getUserInfo(id, (err, info) => {
                        const url ='http://graph.facebook.com/'+id+'/picture?type=large';
                        download(url, 'profile.png', ()=> {//downloads the image
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
        if (func.triggers.answer.test(message.body)) { //implements wolfram alpha short answer api
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
        if (func.triggers.wake.test(message.body)) { //if calls bro wake up
            const delay = 500;
            const name = message.body.substring(message.body.search(func.triggers.wake) + 12);
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
    if (func.triggers.kick.test(message.body)) { //if calls bro kick
        var name = message.body.substring(message.body.search(func.triggers.kick) + 9);
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


    if (func.triggers.add.test(message.body)) { //if calls bro add
        const name = message.body.substring(message.body.search(func.triggers.add) + 8);
        add(name, 0);
    }
    if (func.triggers.help.test(message.body)) { // description of what bot can do
        api.sendMessage(func.triggers.basic, message.threadID);
    }
}
});
});
