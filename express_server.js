const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let newShortURL = "";
  let possibilities = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
      newShortURL += possibilities.charAt(Math.floor(Math.random() * possibilities.length));
  }
  return newShortURL;
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); // {"b2xVn2":"http://www.lighthouselabs.ca","9sm5xK":"http://www.google.com"} = JSON string representing the entire urlDatabase object
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render('urls_index', templateVars)
});

app.get('/register', (req, res) => {
res.render('url_registration')
});

app.get('/urls/new', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render('urls_new', templateVars);
});


app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: req.cookies["username"] };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL)
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: req.cookies["username"] };
  res.render('urls_show', templateVars);
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls');
})

app.post('/register', (req, res) => {
  res.send('Ok register');
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});