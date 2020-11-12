
function generateRandomString() {
  let newShortURL = "";
  let possibilities = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
      newShortURL += possibilities.charAt(Math.floor(Math.random() * possibilities.length));
  }
  return newShortURL;
};


//ADD NEW USER IN USERS OBJECT
const addNewUser = (email, password, db) => {

  const userId = generateRandomString()
  
  const newUserObj = {
    id: userId,
    email,
    password
  };

  db[userId] = newUserObj;
  
  //return the id of the user
  return userId;
  };
  
  
  // check if we already have that email in our Db
  const findUserByEmail = (email, usersDb) => {
    console.log('hello')
    console.log({usersDb})
    for (let userId in usersDb) {
      console.log({userId})
      if (usersDb[userId].email === email) {
        //console.log('userDb', usersDb)
        //console.log('usersDb[userId', usersDb[userId])
        return usersDb[userId];
      }
    }
    return false;
  };
  
  

  // check if email match with password 
  const authenticateUser = (email, password, usersDb) => {
    const user = findUserByEmail(email, usersDb);
    //console.log({user})
  
    if (user && user.password === password) {
      return user;
    } else {
      return false;
    }
  };
  
  // returns the URLs where the userID is equal to the id of the currently logged-in user

  const urlsForUser = (db, id) => {
    let userURL = {};
    for (let url in db) {
      if (id === db[id]) {
        userURL[url] = db[url];
      }
    }
    return userURL;
  }
  
  module.exports = { generateRandomString, addNewUser, findUserByEmail, authenticateUser, urlsForUser };

