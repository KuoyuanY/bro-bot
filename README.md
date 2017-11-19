# bro-bot
facebook chat bot that parses messages and react or execute commands from users
     
## Here are different ways to use the bot:
![greeting](pics/HowToUseBot/greet.png)
    
![bro add](pics/HowToUseBot/add.png "To add a user to group chat")

![bro kick](pics/HowToUseBot/kick.png "To kick a user from group chat")

![bro trivia number](pics/HowToUseBot/triviaNumber.png)

![bro trivia year](pics/HowToUseBot/triviaYear.png)

### Brobot can also respond to various types of questions
![bro answer](pics/HowToUseBot/answer.png)

![bro honest answer](pics/HowToUseBot/honestAnswer.png)

![bro r/ ](pics/HowToUseBot/reddit.png)

![bro r/ ](pics/HowToUseBot/reddit2.png)
    
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
