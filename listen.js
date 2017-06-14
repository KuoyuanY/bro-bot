'use strict';
const fs = require("fs");
const login = require("facebook-chat-api");
const func = require('./functions');
const request = require("request");
const http = require('http');
const https = require('https');
const unirest = require('unirest');
const youtubedl = require('youtube-dl');
const wordKey = "API key";
const wolframKey = "wolframKey";

var counterTLDR;

login({
    appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
}, (err, api) => { //reads appstate file and logs in
    if (err) {
        return console.error(err); //if error occurs, return details
    }
    api.listen((err, message) => {
            if (cons.triggers.mute.test(message.body)) { //checks if bot is muted
                muted = true;
                api.sendMessage("bot muted", message.threadID);
            } else if (cons.triggers.unmute.test(message.body)) {
                muted = false;
                api.sendMessage("bot unmuted", message.threadID);
            }
            //checks for easter eggs and sends messages
            if (!muted) {
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
                func.easter(message.body, cons.triggers.konami, cons.easterEggs.konami);
                func.easter(message.body, cons.triggers.broCode, cons.easterEggs.broCode);
                func.easter(message.body, cons.triggers.wasabi, cons.easterEggs.wasabi);
                func.easter(message.body, cons.triggers.merit, cons.easterEggs.merit);
                func.easter(message.body, cons.triggers.brownie, cons.easterEggs.brownie);
                func.easter(message.body, cons.triggers.fbla, cons.easterEggs.fbla);
            }
            //checks for help commands
            func.easter(message.body, cons.commands.triviaNumber, cons.triggers.commandExplanation.triviaNumber);
            func.easter(message.body, cons.commands.triviaMath, cons.triggers.commandExplanation.triviaMath);
            func.easter(message.body, cons.commands.triviaDate, cons.triggers.commandExplanation.triviaDate);
            func.easter(message.body, cons.commands.triviaYear, cons.triggers.commandExplanation.triviaYear);
            func.easter(message.body, cons.commands.r, cons.triggers.commandExplanation.r);
            func.easter(message.body, cons.commands.mute, cons.triggers.commandExplanation.mute);
            func.easter(message.body, cons.commands.unmute, cons.triggers.commandExplanation.unmute);
            func.easter(message.body, cons.commands.greet, cons.triggers.commandExplanation.greet);
            func.easter(message.body, cons.commands.hitTheLights, cons.triggers.commandExplanation.hitTheLights);
            func.easter(message.body, cons.commands.answer, cons.triggers.commandExplanation.answer);
            func.easter(message.body, cons.commands.honest, cons.triggers.commandExplanation.honest);
            func.easter(message.body, cons.commands.search, cons.triggers.commandExplanation.search);
            func.easter(message.body, cons.commands.gtfo, cons.triggers.commandExplanation.gtfo);
            func.easter(message.body, cons.commands.kick, cons.triggers.commandExplanation.kick);
            func.easter(message.body, cons.commands.add, cons.triggers.commandExplanation.add);
            func.easter(message.body, cons.commands.wakeUp, cons.triggers.commandExplanation.wakeUp);
            func.easter(message.body, cons.commands.set, cons.triggers.commandExplanation.set);
            func.easter(message.body, cons.commands.define, cons.triggers.commandExplanation.define);
            func.easter(message.body, cons.commands.synonym, cons.triggers.commandExplanation.synonym);
            //these are messages that require random number
            func.text(message.body, cons.triggers.why, cons.triggers.reasons, cons.triggers.reasons.length);
            func.text(message.body, cons.triggers.what, cons.triggers.things, cons.triggers.things.length);
            func.text(message.body, cons.triggers.when, cons.triggers.times, cons.triggers.times.length);
            func.text(message.body, cons.triggers.where, cons.triggers.places, cons.triggers.places.length);
            func.text(message.body, cons.triggers.howMuch, cons.triggers.amount, cons.triggers.amount.length);
            if (!cons.triggers.howMuch.test(message.body)) {
                func.text(message.body, cons.triggers.how, cons.triggers.ways, cons.triggers.ways.length);
            }
            func.text(message.body, cons.triggers.who, cons.triggers.people, cons.triggers.people.length);
            if (!cons.triggers.why.test(message.body) && !cons.triggers.what.test(message.body)
            && !cons.triggers.when.test(message.body) && !cons.triggers.when.test(message.body)
            && !cons.triggers.where.test(message.body) && !cons.triggers.howMuch.test(message.body)
            && !cons.triggers.how.test(message.body) && !cons.triggers.who.test(message.body)) {
                func.text(message.body, cons.triggers.honestAnswer, cons.triggers.answers, cons.triggers.answers.length);
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
                func.defMashapeWord(url); //calls requestMashape function
            }

            if (cons.triggers.synonym.test(message.body)) { //checking for bro define
                var word = message.body.split(" synonym ")[1];
                const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms";
                func.synMashapeWord(url); //calls requestMashape function
            }

            if (cons.triggers.antonym.test(message.body)) { //checking for bro define
                var word = message.body.split(" antonym ")[1];
                const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/antonyms";
                func.antMashapeWord(url); //calls requestMashape function
            }

            if (cons.triggers.set.test(message.body)) { //checking for bro set
                if (cons.triggers.nickname.test(message.body)) { //checking for keyword nickname
                    const arr = message.body.split(" nickname"); //array of split string
                    const nick = arr[1]; //the desired nickname for a user
                    const name = arr[0].substring(8);
                    api.getUserID(name, (err, data) => {
                        const id = data[0].userID;
                        func.existsInGroup(id, message.threadID, (exists) => {
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
                    func.existsInGroup(id, message.threadID, (exists) => {
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
                            func.kick(name);
                        }, 1000);
                        api.sendMessage("You don't belong here, " + name, message.threadID);
                    } else {//add back after duration
                        func.existsInGroup(id, message.threadID, (exists) => {
                            if(exists){
                                setTimeout(() => {
                                    func.addToGroup(name, 0);
                                }, duration * 1000);
                                func.kick(name);
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
            func.addToGroup(name, 0);
        }

        if (cons.triggers.hitTheLights.test(message.body)) {
            func.repeat(0, 500, 10, "api.changeThreadColor(func.ranColor(), message.threadID)");
        }
        if (cons.triggers.help.test(message.body)) { // description of what bot can do
            api.sendMessage(cons.triggers.basic, message.threadID);
        }

});
});
