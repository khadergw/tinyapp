var cookieSession = require('cookie-session')
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

app.set("view engine", "ejs");

app.use(cookieParser())

app.use(cookieSession({
  name: 'session',
  keys: ['GHADEER'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = { 
  "user1": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "funk"
  }
}


const userAuthenticator = function(users, email, password) {
//  const hashedPassword = bcrypt.hashSync(password, 10);

  for (let user in users) {
    if (users[user].email === email) {
      //console.log('testing:',bcrypt.compareSync(users[user].password, password));
      if (bcrypt.compareSync(users[user].password, password)) {
        return true;
      }
    }
  }
  return false;
};

const userIDReturner = function(users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      let userID = users[user].id;
      return userID;
    }
  }
};

const emailHasUser = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};



const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//only registered clients can create short URL
app.post("/urls", (req, res) => {
  
  const email = req.body.email;
  let userID = userIDReturner(users, email);
   if (req.cookies[userID]) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies[userID],
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send("You must be logged in to a valid account to create short URLs.");
  }

});

//double check the delete////////////////
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]; 
  res.redirect("/urls");  
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL
  urlDatabase[req.params.shortURL]=longURL;
  //res.send("Ok"); 
  res.redirect("/urls");  
});


//logout

// app.post("/logout", (req, res) => {
//   res.clearCookie('user_id')
//   res.redirect('/urls');
// });


app.get("/urls/new", (req, res) => {
  const templateVars = { 
  username: req.cookies["user_id"],}
 // req.session.user_id = username}
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//display username

// app.get("/urls", (req, res) => {
 
//   const templateVars = { 
//    username: req.cookies["user_id"],
//    //req.session.user_id = username,
//     urls: urlDatabase };
//   res.render("urls_index", templateVars);

// });

///Users Can Only See Their Own Shortened URLs/////////// not working


app.get("/urls", (req, res) => {
let username= req.session.user_id
console.log(username)
if (username) {
let templateVars = { 
  username: req.session.user_id,
  urls: urlDatabase };
  res.render("urls_index", templateVars);

} else {
  
     templateVars = {
      user: false //needs to be false to to show error on page to login/register
          };
          res.redirect("/login");
  }
});



//register a user

app.get("/register", (req, res) => {
//   // const templateVars = { 
//   //   email: req.cookies["email"],
//   //   password: req.cookies["password"],
//   //   username: req.cookies["username"],
//   //   urls: urlDatabase };
//   //   res.render("urls_register", templateVars)

// //  const submittedEmail = req.body.email;
// //   const submittedPassword = req.body.password;



 //res.render("/urls_register");  
 let templateVars = {
  username:req.session.user_id,
   //username: req.cookies["user_id"],
};
if (templateVars.username) {
 // users.push()
  res.redirect("/urls");
} else {
  res.render("urls_register", templateVars);
}


});



//registration errors
app.post("/register", (req, res) => {
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;

  if (!submittedEmail || !submittedPassword) {
    res.status(400).send("Please include both a valid email and password");
  } else if (emailHasUser(submittedEmail, users)) {
    res.status(400).send("An account already exists for this email address");
  } else {
  const newUserID = generateRandomString();
    users[newUserID] = {
      id: newUserID,
      email: submittedEmail,
      password: submittedPassword,
      //password: bcrypt.hashSync(submittedPassword, 10)
    };
   // users[newUserID] = newUser;
  //add encypted cookies
  //req.session['user_id'] = newUserID; 
  //res.redirect("/urls");
  //res.cookie('user_id', newUserID)
  req.session.user_id = newUserID;
      res.redirect("/urls");
  }  
 
});

//new login page

app.get("/login", (req, res) => {
  // if (cookieHasUser(req.session.user_id, users)) {
  //   res.redirect("/urls");
  // } else {
    let templateVars = {
     username: req.session.user_id,
      //username: req.cookies["user_id"],
    };
    res.render("urls_login", templateVars);
  //}
});

//checking login credintials?????????// giving error in credentials for any login attempt

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = bcrypt.hashSync(password, 10);
  let userID = userIDReturner(users, email);

  if (userAuthenticator(users, email, hashedPassword)) {
    req.session.user_id = userID,
    //res.cookie("user_id", userID);
    res.redirect("/urls");
  } else {

    res.status(401).send('Wrong credentials');
    // const templateVars = {
    //   error: "Error in credentials",
    //   user: null
    // };
    // //res.render("urls_login", templateVars);
    // res.send("Error in credentials");
  }
});

//clear the correct user_id cookie ??

app.post("/logout", (req, res) => {
  //res.clearCookie('user_id')
 req.session = null
  res.redirect('/login');
});


app.get("/urls/:shortURL", (req, res) => {
  //const username = req.cookies["user_id"];
  req.session.user_id = username;
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL], username};
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


//generateRandomString()

