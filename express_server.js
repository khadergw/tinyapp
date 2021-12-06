const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");


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


const users = { 
  "user1": {
    id: "user1", 
    email: "user1@user.com", 
    // password: "user1"
    password: "$2a$10$Rb8Unenn5y7JCUPUQen8/.hwf1xmVKkrGhd0PP9KvyWVi8C9z5TJy"
  },
  "user2": {
    id: "user2", 
    email: "user2@user.com", 
    password: "user2"
  }
};

//not sure about the below function////////////
function generateRandomString() {
  let output = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) output += possible.charAt(Math.floor(Math.random() * possible.length));
  return output;
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//double check the delete////////////////
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase.shortURL; 
  res.redirect("/urls");  
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//double check longURL/////////////////
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shorturl: req.params.shortURL, longURL:urlDatabase[req.params.shortURL].longURL};
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

