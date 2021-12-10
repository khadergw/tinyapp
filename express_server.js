var cookieSession = require('cookie-session')
const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const { generateRandomString, getUserByEmail, userAuthenticator, userIDReturner } = require("./helpers");

app.set("view engine", "ejs");

app.use(cookieParser())

app.use(cookieSession({
  name: 'session',
  keys: ['GHADEER'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("funk", saltRounds)
  }
}



//only registered clients can create short URL
app.post("/urls", (req, res) => {

  const email = req.body.email;
  let userID = userIDReturner(users, email);
  if (req.session.user_id) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;//{

    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send("You must be logged in to a valid account to create short URLs.");
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL
  urlDatabase[req.params.shortURL] = longURL;
  res.redirect("/urls");
});




app.get("/urls/new", (req, res) => {
  let username = req.session.user_id

  if (username) {
    let templateVars = {
      username: req.session.user_id,
      urls: urlDatabase
    };
    res.render("urls_new", templateVars);

  } else {

    templateVars = {
      user: false
    };
    res.redirect("/login");
  }
});


app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.get("/urls", (req, res) => {
  let username = req.session.user_id
  console.log(urlDatabase)
  if (username) {
    let templateVars = {
      username: req.session.user_id,
      urls: urlDatabase
    };
    res.render("urls_index", templateVars);

  } else {

    templateVars = {
      user: false
    };
    res.redirect("/login");
  }
});



//register a user

app.get("/register", (req, res) => {

  let templateVars = {
    username: req.session.user_id,

  };
  if (templateVars.username) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", templateVars);
  }


});


//registration errors
app.post("/register", (req, res) => {
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(submittedPassword, 10);

  if (!submittedEmail || !submittedPassword) {
    res.status(400).send("Please include both a valid email and password");
  } else if (getUserByEmail(submittedEmail, users)) {
    res.status(400).send("An account already exists for this email address");
  } else {
    const newUserID = generateRandomString();
    users[newUserID] = {
      id: newUserID,
      email: submittedEmail,
      password: hashedPassword,
    };


    req.session.user_id = users[newUserID];
    res.redirect("/urls");
  }

});

//new login page

app.get("/login", (req, res) => {
  console.log(users)

  let templateVars = {
    username: req.session.user_id,
  };
  res.render("urls_login", templateVars);
});



app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let userEmail = userIDReturner(users, email);
  let loggedUser = users[userEmail];
  if (userAuthenticator(users, email, password)) {
    req.session.user_id = loggedUser,
      console.log(req.session.user_id)
    res.redirect("/urls");
  } else {

    res.status(401).send('Wrong credentials');

  }
});


app.post("/logout", (req, res) => {
  req.session = null
  res.redirect('/login');
});


app.get("/urls/:shortURL", (req, res) => {
  const username = req.session.user_id;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username };
  res.render("urls_show", templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase.hasOwnProperty(req.params.shortURL)) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



