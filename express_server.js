const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");

app.use(cookieParser())

// let urlDatabase = {
//   "b2xVn2": {
//     shortURL: "b2xVn2",
//     longURL: "http://www.lighthouselabs.ca",
//     userID: "user1"
//   },
//   "9sm5xK": {
//     shortURL: "9sm5xK",
//     longURL: "http://www.google.com",
//     userID: "user2"
//   }
// };
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// const users = { 
//   "user1": {
//     id: "user1", 
//     email: "user1@user.com", 
//     // password: "user1"
//     password: "$2a$10$Rb8Unenn5y7JCUPUQen8/.hwf1xmVKkrGhd0PP9KvyWVi8C9z5TJy"
//   },
//   "user2": {
//     id: "user2", 
//     email: "user2@user.com", 
//     password: "user2"
//   }
// };

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


const emailHasUser = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

// const cookieHasUser = function(cookie, userDatabase) {
//   for (const user in userDatabase) {
//     if (cookie === user) {
//       return true;
//     }
//   } return false;
// };


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

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
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

//login

app.post("/login", (req, res) => {

  res.cookie('username', req.body.username)
      res.redirect("/urls");
      
});





//logout

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls');
});


app.get("/urls/new", (req, res) => {
  const templateVars = { 
  username: req.cookies["username"],}
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

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});


//register a user

app.get("/register", (req, res) => {
  // const templateVars = { 
  //   email: req.cookies["email"],
  //   password: req.cookies["password"],
  //   username: req.cookies["username"],
  //   urls: urlDatabase };
  //   res.render("urls_register", templateVars)

//  const submittedEmail = req.body.email;
//   const submittedPassword = req.body.password;

 //res.redirect("/urls_register");  
 let templateVars = {
  username: req.cookies["username"],
};
if (templateVars.user) {
  res.redirect("/urls");
} else {
  res.render("urls_register", templateVars);
}

});



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
    };
  res.cookie('user_id', req.body.newUserID)
      res.redirect("/urls");
  }    
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL]};
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

