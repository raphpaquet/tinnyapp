const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = 8080;
const { getUserByEmail, authenticateUser, generateRandomString, addNewUser, urlsForUser } = require('./helpers');

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


const usersDb = {
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
};


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


// ROUTES

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.session.user_id] };
  res.render('urls_index', templateVars);
});


// URLS ROUTES
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.session.user_id] };
  const user = usersDb[req.session.user_id];
  urlsForUser(usersDb, user);
  
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID };

  res.redirect(`/urls/${shortURL}`);
});


// NEW ROUTE
app.get('/urls/new', (req, res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.session.user_id] };
  res.render('urls_new', templateVars);
});


//SHORT URLS ROUTES
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL, longURL: urlDatabase[shortURL].longURL, user: usersDb[req.session.user_id] };
  res.render('urls_show', templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


// DELETE/UPDATE ROUTE
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const user = usersDb[req.session.user_id];
  const userURL = urlsForUser(usersDb, user);

  if (userURL.userid === urlDatabase[shortURL].userId) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});


app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user: usersDb[req.session.user_id] };
  res.render('urls_show', templateVars);
});


// LOGIN ROUTES
app.get('/login', (req, res) => {
  const templateVars = { user: usersDb[req.session.user_id] };
  res.render('url_login', templateVars);
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = authenticateUser(email, password, usersDb);

  if (user) {
    req.session['user_id'] = user.id;
    res.redirect('/urls');
  } else {
    res.status(403).send('wrong email or password');
  }
});




// REGISTER ROUTES
app.get('/register', (req, res) => {
  const templateVars = { user: usersDb[req.session.user_id] };
  res.render('url_register', templateVars);
});


app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, usersDb);
  
  if (req.body.email === "" || req.body.password === "") {
    res.status(404).send('404 - Page Not Found');
  }

  if (!user) {
    const userId = addNewUser(email, password, usersDb);
    req.session['user_id'] = userId;
    res.redirect('/urls');
  } else {
    res.status(403).send('Email already exist, please login');
  }
});


// LOGOUT ROUTE
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});