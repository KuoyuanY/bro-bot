# bro-bot
facebook chat bot that responds to messages in group chat.
uses wolfram alpha short answer API to answer users' questions.
uses mashape word API to define and find synonyms of input word.

## Set up
First clone the repository:
```
$ git clone https://github.com/y9y9l5m6/bro-bot.git
```
Go into bro-bot directory:
```
$ cd bro-bot
```
Install all dependencies:
```
$ npm install
```
Go into login.js and enter your email and password:
```javascript
login({email: "YOUR EMAIL", password: "YOUR PASSWORD"}, (err, api) => {
    if(err) return console.error(err);
});
```
Run login.js to generate appstate.json file
```
$ node login.js
```
In listen.js file, change the API keys to your own API keys
```javascript
const wordKey = "API key"
const wolframKey = "wolframKey"
```
Now run:
```
$ node listen.js
```
Your bot is running!
