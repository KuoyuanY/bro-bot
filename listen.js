'use strict';
const fs = require("fs");
const login = require("facebook-chat-api");
const func = require('./functions');
const request = require("request");
const http = require('http');
const unirest = require('unirest');
const wordKey = "API key";
const wolframKey = "wolframKey";
var muted = false;

function ranColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) { // Hex
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var banList = [];
var cheatList = [];
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
            if (counter < 2 * duration) {
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

        function uncheat(id){//uncheat a user
          var index = cheatList.indexOf(id);
          cheatList.splice(index, 1);
        }

        function cheat(id){//adds user to cheat list
          cheatList.push(id);
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

        if(!isBanned(message.senderID)){//checks if a user is banned
          if (func.triggers.mute.test(message.body)) { //checks if bot is muted
              muted = true;
              api.sendMessage("bot muted", message.threadID);
          } else if (func.triggers.unmute.test(message.body)) {
              muted = false;
              api.sendMessage("bot unmuted", message.threadID);
          }
          //checks for easter eggs and sends messages
          if (!muted) {
              //These are picture easter eggs
              if (func.triggers.porn.test(message.body)) {
                  const msg = {
                      attachment: fs.createReadStream(__dirname + '/easter.png')
                  }
                  api.sendMessage(msg, message.threadID);
              }
              if (func.triggers.wtf.test(message.body)) {
                  const msg = {
                      attachment: fs.createReadStream(__dirname + '/wtf.png')
                  };
                  api.sendMessage(msg, message.threadID);
              }
              if (func.triggers.holyShit.test(message.body)) {
                  const msg = {
                      attachment: fs.createReadStream(__dirname + '/holyshit.png')
                  };
                  api.sendMessage(msg, message.threadID);
              }
              //These are message easter eggs
              easter(message.body, func.triggers.konami, func.easterEggs.konami);
              easter(message.body, func.triggers.broCode, func.easterEggs.broCode);
              easter(message.body, func.triggers.bruh, func.easterEggs.bruh);
              easter(message.body, func.triggers.wasabi, func.easterEggs.wasabi);
              easter(message.body, func.triggers.cuck, func.easterEggs.cuck);
              easter(message.body, func.triggers.mank, func.easterEggs.mank);
              easter(message.body, func.triggers.merit, func.easterEggs.merit);
              easter(message.body, func.triggers.brownie, func.easterEggs.brownie);
              easter(message.body, func.triggers.fbla, func.easterEggs.fbla);
          }
          //checks for help commands
          easter(message.body, func.commands.mute, func.triggers.commandExplanation.mute);
          easter(message.body, func.commands.unmute, func.triggers.commandExplanation.unmute);
          easter(message.body, func.commands.greet, func.triggers.commandExplanation.greet);
          easter(message.body, func.commands.hitTheLights, func.triggers.commandExplanation.hitTheLights);
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
          if (func.triggers.cheat.test(message.body)) { //super command that can only be accessed with konami code
            api.getUserInfo(message.senderID, (err, info)=>{
              setTimeout(()=> {
                unCheat(message.senderID);
                api.sendMessage("Cheat deactivated for " + info[message.senderID],message.threadID);
              }, 10000);
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
                            setTimeout(function() {
                              unban(id);
                              api.sendMessage(name + " is no longer banned",message.threadID);
                            }, 600000);
                            ban(id);
                            api.sendMessage("User successfully banned for a default time of 10 minutes.", message.threadID);
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
            if(isCheating(message.senderID)){
              api.sendMessage("Still making the super command", message.threadID);
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
              word = message.body.split(" define ")[1];
              const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/definitions";
              defMashapeWord(url); //calls requestMashape function
          }
          if (func.triggers.synonym.test(message.body)) { //checking for bro define
              word = message.body.split(" synonym ")[1];
              const url = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms";
              synMashapeWord(url); //calls requestMashape function
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
                          api.sendMessage("Best match: " + info[id].name + "\n" + info[id].profileUrl,
                              message.threadID);
                      });
                  }
              });
          }
          if (func.triggers.answer.test(message.body)) { //implements wolfram alpha short answer api
              const mess = message.body.split(" answer ");
              const question = encodeURIComponent(mess[1]); // question to be put in url
              const url = `http://api.wolframalpha.com/v1/result?appid=${wolframKey}` + question;
              request.get(url, (error, response, body) => { //gets response from wolfram alpha short answer api
                  if (body.toString() === "Wolfram|Alpha did not understand your input") {
                      api.sendMessage("No results found for " + "\"" + question + "\"", message.threadID);
                  } else if (body.toString().match(/wolfram alpha/i)) {
                      api.sendMessage(body.toString().replace("Wolfram Alpha", "I"), message.threadID);
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
              api.getUserID(name, (err, data) => {
                  const id = data[0].userID; //user id for input name
                  existsInGroup(id, message.threadID, (check) => {
                      if (check) {
                          if (!hasDuration) {
                              setTimeout(() => { //delay between messages
                                  api.removeUserFromGroup(id, message.threadID);
                              }, 2000);
                              api.sendMessage("You don't belong here, " + name, message.threadID);
                          } else {
                              setTimeout(() => {;
                                  api.addUserToGroup(id, message.threadID);
                              }, duration * 1000)
                              api.removeUserFromGroup(id, message.threadID);
                          }
                      } else {
                          api.sendMessage(name + " is not in this groupchat", message.threadID);
                      }
                  });
              });
          }
          if (func.triggers.add.test(message.body)) { //if calls bro add
              const name = message.body.substring(message.body.search(func.triggers.add) + 8);
              api.getUserID(name, (err, data) => {
                  const id = data[0].userID; //user id for input name
                  existsInGroup(id, message.threadID, (exists) => {
                      if (exists) { //the user is in this group chat
                          api.sendMessage(name + " is already in this groupchat", message.threadID);
                      } else { //the user isn't in this group chat
                          setTimeout(() => { //delay between messages
                              api.sendMessage("welcome, " + name, message.threadID);
                          }, 1500);
                          api.addUserToGroup(id, message.threadID);
                      }
                  });
              });
          }
          if (func.triggers.gtfo.test(message.body)) {
              var myID = api.getCurrentUserID();
              setTimeout(() => { //delay between messages
                  api.removeUserFromGroup(myID, message.threadID);
              }, 1500);
              api.sendMessage("good bye friends, I'll miss you all", message.threadID);
          }
          if (func.triggers.hitTheLights.test(message.body)) {
              repeat(0, 500, 5, "api.changeThreadColor(ranColor(), message.threadID)");
          }
          if (func.triggers.help.test(message.body)) { // description of what bot can do
              api.sendMessage(func.triggers.basic, message.threadID);
          }
        }
    });
});
