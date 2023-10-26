const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {maxAge: 300000}
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const {username, avatar, name, password} = req.body;

    //
    // D. Reading the users.json file
    //
    const data = fs.readFileSync("data/users.json", "utf-8");

    //
    // E. Checking for the user data correctness
    //
    // check if username avatar name and password is not empty
    if (!username || !avatar || !name || !password) {
        res.json({status: "error", error: "Please fill in all the fields."});
        return;
    }
    // check if username is valid
    if (!containWordCharsOnly(username)) {
        res.json({status: "error", error: "Username can only contain word characters."});
        return;
    }
    // check if username is unique
    const users = JSON.parse(data);
    if (users[username]) {
        res.json({status: "error", error: "Username already exists."});
        return;
    }
    //
    // G. Adding the new user account
    //
    // hash the password
    const hash = bcrypt.hashSync(password, 10);
    // add the new user to the users object
    users[username] = {
        username: username,
        avatar: avatar,
        name: name,
        password: hash
    };
    //
    // H. Saving the users.json file
    //
    // write the users object to the users.json file
    fs.writeFileSync("data/users.json", JSON.stringify(users));

    //
    // I. Sending a success response to the browser
    //
    res.json({status: "success"});

});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const {username, password} = req.body;

    //
    // D. Reading the users.json file
    //
    const data = fs.readFileSync("data/users.json", "utf-8");
    //
    // E. Checking for username/password
    //
    // check if username and password is not empty
    if (!username || !password) {
        res.json({status: "error", error: "Please fill in all the fields."});
        return;
    }
    // check if username is in users.json
    const users = JSON.parse(data);
    if (!users[username]) {
        res.json({status: "error", error: "Username does not exist."});
        return;
    }
    // check if password is correct
    const hash = users[username].password;
    if (!bcrypt.compareSync(password, hash)) {
        res.json({status: "error", error: "Password is incorrect."});
        return;
    }
    //
    // G. Sending a success response with the user account
    //
    // set req.session.user to the user object\
    req.session.user = {
        username: username,
        avatar: users[username].avatar,
        name: users[username].name
    };
    res.json({status: "success", user: req.session.user});

});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    const user = req.session.user;

    //
    // D. Sending a success response with the user account
    //
    if (user) {
        // D. Sending a success response with the user account
        res.json({status: "success", user});
    } else {
        // If no user is in the session, return an error response.
        res.json({status: "error", error: "User not authenticated."});
    }

});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    delete req.session.user;

    //
    // Sending a success response
    //
    res.json({status: "success"});
});


//
// ***** Please insert your Lab 6 code here *****
//


// Use a web server to listen at port 8000
app.listen(8000, () => {
    console.log("The chat server has started...");
});
