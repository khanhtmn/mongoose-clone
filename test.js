const ODM = require('./index.js');
// Do some tests with the ODM
// Create a Jedi class
class Jedi extends ODM { };

// Create an instance with a document
const luke = new Jedi({
  _id: 'luke',
  firstName: 'Luke',
  lastName: 'Skywaker'
});

// Update the instance
luke.lastName = 'Skywalker';

// Check that the value has been changed in the database
console.log(db.Jedi.luke.lastName);