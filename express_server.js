const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const { findUserByEmail, authenticateUser, generateRandomString, addNewUser } = require('./helpers')

const cookieParser = require('cookie-parser');
app.use(cookieParser());

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
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// //middleware
// app.use((req, res, next) => {
//   const userId = req.cookies.urls_id;
//   if(userId) {
//   req.user = users[userId];
//     if(req.user) {
//       req.username = req.user.email
//     }
//   }
//   next();
// });


// ROUTES

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); 
});

app.get('/usersDb.json', (req, res) => {
  res.json(usersDb); 
});


app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});


app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.cookies.urls_id] };
  console.log('user', templateVars.user)
  //console.log('req.cookie', req.cookies)
  //console.log('cookies', req.cookies['urls_id'])
  res.render('urls_index', templateVars)
});


app.get('/urls/new', (req, res) => {
  const templateVars = { urls: urlDatabase, user: usersDb[req.cookies.urls_id] };
  res.render('urls_new', templateVars);
});


app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], user: usersDb[req.cookies.urls_id] };
  res.render('urls_show', templateVars);
});


app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.get('/u/:shortURL', (req, res) => {
  longURL = urlDatabase[req.params.shortURL];
  const templateVars = { shortURL : req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: usersDb[req.cookies.urls_id] };
  res.redirect(longURL)
});


// DELETE/UPDATE ROUTE
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const templateVars = { shortURL : req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: usersDb[req.cookies.urls_id] };
  res.render('urls_show', templateVars);
});


// LOGIN ROUTES
app.get('/login', (req, res) => {
  const templateVars = { shortURL : req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: usersDb[req.cookies.urls_id] }
  res.render('url_login', templateVars)
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('login userDb', usersDb)

  const user = authenticateUser(email, password);

  if (user) {
    res.cookie('urls_id', user.id);
    res.redirect('/urls')
  } else {
    res.status(403).send('wrong email or password')
  }
});




// REGISTER ROUTES

app.get('/register', (req, res) => {
  const templateVars = { shortURL : req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: usersDb[req.cookies.urls_id] }
  res.render('url_register', templateVars)
});


app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
const user = findUserByEmail(email, usersDb);

  if (!user) {
    const userId = addNewUser(email, password, usersDb);
    console.log('userID', userId)
    res.cookie('urls_id', userId);
    res.redirect('/urls');
    console.log({usersDb})
  } else {
    res.status(403).send('Email already exist, please login')
  }
});





// LOGOUT ROUTE
app.post('/logout', (req, res) => {
  res.clearCookie('urls_id')
  res.redirect('/urls');
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});