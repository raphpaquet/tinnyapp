const bcrypt = require('bcrypt');
const saltRounds = 10;


const generateRandomString = function() {
  let newShortURL = "";
  let possibilities = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    newShortURL += possibilities.charAt(Math.floor(Math.random() * possibilities.length));
  }
  return newShortURL;
};


//ADD NEW USER IN USERS OBJECT
const addNewUser = (email, password, db) => {

  const userId = generateRandomString();
  
  const newUserObj = {
    id: userId,
    email,
    password : bcrypt.hashSync(password, saltRounds)
  };
  db[userId] = newUserObj;
  return userId;
  
};
  
  
// check if we already have that email in our Db
const getUserByEmail = (email, users) => {
  for (let userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return undefined;
};
  
  

// check if email match with password
const authenticateUser = (email, password, users) => {
  const user = getUserByEmail(email, users);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  } else {
    return false;
  }
};
  
  
// returns the URLs where the userID is equal to the id of the currently logged-in user
const urlsForUser = (db, id) => {
  let userURL = {};
  for (let url in db) {
    if (id === db[url].userID) {
      userURL[url] = db[url];
    }
  }
  return userURL;
};
  
module.exports = { generateRandomString, addNewUser, getUserByEmail, authenticateUser, urlsForUser };

