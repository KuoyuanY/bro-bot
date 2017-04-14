const fs = require("fs");
const login = require("facebook-chat-api");

login({email: "YOUR EMAIL", password: "YOUR PASSWORD"}, (err, api) => {
    if(err) return console.error(err);

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
