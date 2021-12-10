const bcrypt = require('bcryptjs');




const userAuthenticator = function(users, email, password) {
    
    for (let user of Object.values(users)) {

    if (user.email === email){
      const hashedPassword = bcrypt.hashSync(user.password, 10);

      const valid = bcrypt.compareSync(password, user.password)

      if (valid) {
        return true;
      }

      }
    }
    return false;
  };

  
  const userIDReturner = function(users, email) {
    for (let user in users) {
      if (users[user].email === email) {
        let userID = users[user].id;
        return userID;
      }
    }
  };
  
  const getUserByEmail = function(email, users) {
    for (const user in users) {
      if (users[user].email === email) {
        return true;
      }
    }
    return false;
  };
  
  
  
  const generateRandomString = function() {
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      const randomCharCode = Math.floor(Math.random() * 26 + 97);
      const randomChar = String.fromCharCode(randomCharCode);
      randomString += randomChar;
    }
    return randomString;
  };




module.exports = {
  generateRandomString,
  getUserByEmail,
  userIDReturner,
  userAuthenticator
};