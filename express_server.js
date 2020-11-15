const express = require("express");
const app = express();
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
  const userID = req.session.user_id;
  if (userID) {
    res.redirect('/urls')
  } else {
    res.redirect('/login')
  }
});

// URLS ROUTES
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlsForUser(urlDatabase, req.session.user_id), user: usersDb[req.session.user_id] };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.session.user_id] };
  if(!req.session.user_id) {
    res.status(401).send('Please login to create new URLs')
  } else {
    const userID = req.session.user_id;
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = { longURL, userID };
    res.redirect(`/urls/${shortURL}`);
  }
});

// NEW ROUTE
app.get('/urls/new', (req, res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.session.user_id] };
  if (templateVars.user) {
    res.render('urls_new', templateVars);
  } else {
    res.render('url_login', templateVars)
  }
});

//SHORT URLS ROUTES
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { urls: urlDatabase, shortURL, longURL: urlDatabase[shortURL].longURL, user: usersDb[req.session.user_id] };
  if (req.session.user_id === urlDatabase[templateVars.shortURL].userID) {
    res.render('urls_show', templateVars);
  } else {
    res.status(401).send('Wrong TinyURL')
  }
});


app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { urls: urlDatabase, shortURL, longURL: urlDatabase[shortURL].longURL, user: usersDb[req.session.user_id] };
  res.redirect(longURL);
});

// DELETE/UPDATE ROUTE
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const user = usersDb[req.session.user_id];

  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send('Not allowed to delete this item');
  }
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const templateVars = { shortURL, longURL, user: usersDb[req.session.user_id] };
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = longURL,
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send('Not allowed to edit this item')
  }
});

// LOGIN ROUTES
app.get('/login', (req, res) => {
  const templateVars = { user: usersDb[req.session.user_id] };
  if (templateVars.user) {
    res.redirect('/urls')
  } else {
  res.render('url_login', templateVars);
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = authenticateUser(email, password, usersDb);

  if (user) {
    req.session['user_id'] = user.id;
    res.redirect('/urls');
  } else {
    res.status(401).render('error_401');
  }
});

// REGISTER ROUTES
app.get('/register', (req, res) => {
  const templateVars = { user: usersDb[req.session.user_id] };
  if (templateVars.user){
    res.redirect('/urls')
  } else {
  res.render('url_register', templateVars);
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, usersDb);
  
  if (req.body.email === "" || req.body.password === "") {
    res.status(401).render('error_401');
  } else if (user) {
    res.status(403).send('Email already exist, please login');
  } else {
    const userId = addNewUser(email, password, usersDb);
    req.session['user_id'] = userId;
    res.redirect('/urls');
  }
});

app.get('/usersDB', (req, res) => {
  res.json(usersDb);
});

// LOGOUT ROUTE
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});