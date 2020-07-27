// Define the universal database
const db = {};

// Create the class that will manage the mapping between documents and class instances
class ODM {
  constructor(document) {
    // Get class name (name of the collection in the database)
    const name = this.constructor.name;

    // Add unique id
    // USE UUID LATER
    document._id = document._id || Math.random().toString();

    // Create document in the database
    db[name] = db[name] || {};
    db[name][document._id] = document;

    // Define accessors
    // Create getter and setter for every property of the instance
    // that will manage the related document in the database
    const configuration = {};
    Object.keys(document).forEach((prop) => {
      configuration[prop] = {
        get() {
          return db[name][document._id][prop];
        },
        set(value) {
          db[name][document._id][prop] = value;
        }
      };
    });

    // Set accessors
    Object.defineProperties(this, configuration);
  }
}

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
luke.lastName = 'Skywaker';

// Check that the value has been changed in the database
db.Jedi.luke.lastName;
