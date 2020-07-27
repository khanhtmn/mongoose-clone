// Define the universal database
const db = {};

// Create instances list
const instances = {};

// Create the class that will manage the mapping between documents and class instances
class ODM {
  constructor(document) {
    // Get class name (name of the collection in the database)
    const name = this.constructor.name;

    // Add unique id
    ////////// USE UUID LATER //////////
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
          const value = db[name][document._id][prop];
          // return an instance of the value
          return value.indexOf('@') !== -1 ? instances[value.replace('@', '')] : value;
        },
        set(value) {
          if (classes[value.constructor.name]) {
            // store the id of the instance
            db[name][document._id][prop] = value._id;
          } else {
            db[name][document._id][prop] = value;
          }
        }
      };
    });

    // Set accessors
    Object.defineProperties(this, configuration);

    // Add it to the list of instances
    instances[document._id] = this;
  }
}

// Export documents
// Suppose that all documents are JSON valid
////////// TODO: ADD SOMETHING TO CONVERT DOCS TO JSON //////////
db.exports = (name) => {
  return JSON.stringify(db[name]);
};

// Documents importation
// Create classes list
const classes = {};

db.import = (name, documents) => {
  db[name] = JSON.parse(documents);

  // Create instances
  Object.keys(db[name]).forEach((id) => {
    new classes[name](db[name][id]);
  });
};

// Do some tests with the ODM
// Create a Jedi class
classes.Jedi = class Jedi extends ODM { };

// Import Jedi documents
// db.import('Jedi', '{\"luke\":{\"firstName\":\"Luke\",\"lastName\":\"Skywalker\",\"_id\":\"luke\"}}');

// access the created instance

const vador = new classes.Jedi({
  _id: 'vador',
  'firstName': 'Dark',
  'lastName': 'Vador'
});

const luke = new classes.Jedi({
  _id: 'luke',
  'firstName': 'Luke',
  'lastName': 'Skywalker',
  'father': '@vador'
});

// set father link
luke.father = vador
console.log(db.exports('Jedi'));

// module.exports = { ODM, db };
// classes === collections && instances ===  documents