
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
    for (let userId in usersDb) {
      if (usersDb[userId].email === email) {
        return usersDb[userId];
      }
    }
    return false;
  };
  
  
  // check if email match with password 
  const authenticateUser = (email, password) => {
    const user = findUserByEmail(email);
  
    if (user && user.password === password) {
      return user;
    } else {
      return false;
    }
  };
  
  
  
  module.exports = { generateRandomString, addNewUser, findUserByEmail, authenticateUser };

