const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//const { fetchUser, authenticateUser } = require('./helpers')

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


//middleware
app.use((req, res, next) => {
  const userId = req.cookies.user_id;
  if(userId) {
  req.user = users[userId];
    if(req.user) {
      req.username = req.user.email
    }
  } 
  //console.log('MiddleWare', req.username, req.user) // rapjfad@fdfs { id: '7Zn8M9', email: 'rapjfad@fdfs', password: 'fsdaf' }
  next();
})

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
  const templateVars = { urls: urlDatabase, username: req.username };
  res.render('urls_index', templateVars)
});


app.get('/urls/new', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.username };
  res.render('urls_new', templateVars);
});


app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: req.username };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: req.username };
  res.redirect(longURL)
});


// DELETE/UPDATE ROUTE
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: req.username };
  res.render('urls_show', templateVars);
});


// LOGIN ROUTES
app.get('/login', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.username };
  res.render('url_login', templateVars)
})


app.post('/login', (req, res) => {

  const { email, password, userId } = req.body;

  const authenticateUser = (db, email, password) => {
    for (let user in db) {
      if (db[user].email === email) {
        if (db[user].password === password) {
          return db[user]
        } else {
          return res.status(403)
        }
      }
    }
 };

 const userInfo = authenticateUser(users, email, password)
  if(userInfo != res.status(403) ) {
    res.cookie('user_id', userId)
    return res.redirect('/urls')
  } else {
    return res.status(403)
  }
});



// REGISTER ROUTES

app.get('/register', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.username };
  res.render('url_register', templateVars)
});


app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  if (req.body.email === "" || req.body.password === "") {
    res.send('404 - Page Not Found')
  }

  const fetchUser = (db, email) => {
    for (let user in db) {
      if (email === db[user].email) {
        return db[user];
      }
    }
  };

  let userId = generateRandomString();
  const fetchedUser = fetchUser(users, email)

  if(fetchedUser) {
    res.status(403)
    return res.send('Email already exist')
  } else {
    users[userId] = {
      id: userId,
      email: email,
      password: password
    }
    res.cookie('user_id', userId)
    res.redirect('/urls')
  }
})





// LOGOUT ROUTE
app.post('/logout', (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls');
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});