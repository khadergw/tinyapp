const { assert } = require('chai');
const bcrypt = require('bcryptjs');

var saltRounds = 10;   

const { getUserByEmail, generateRandomString, userAuthenticator, userIDReturner } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds)
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("funk", saltRounds)
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = true;
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });
  it('should return undefined when no user exists for a given email address', function() {
    const user = getUserByEmail("me@example.com", testUsers);
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});


describe('generateRandomString', function() {
  it('should return a generated random string of 6 characters', function() {
    const newID = generateRandomString();
    const expectedOutput = 6;
    assert.equal(newID.length, expectedOutput);
  });
});

describe('userAuthenticator', function() {
  it('should return true if user inputted email and password are correct', function() {
    const user = userAuthenticator(testUsers, "user@example.com", "purple-monkey-dinosaur");
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });

  it('should return false if user inputted email and password are not correct', function() {
    const user = userAuthenticator(testUsers, "user@example.com", "turtles");
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

describe('userIDReturner', function() {
  it('should return correct ID of current user based on email', function() {
    const userID = userIDReturner(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(userID, expectedOutput);
  });

  it('should return undefined if no email exists within database', function() {
    const userID = userIDReturner(testUsers, "ghadeer@me.com");
    const expectedOutput = undefined;
    assert.equal(userID, expectedOutput);
  });
});
