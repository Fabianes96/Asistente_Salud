var firebase = require('firebase/app');
require('firebase/firestore');

var collection = 'users';
const dotenv = require("dotenv");

dotenv.config();
const firebase_config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  };
var app = firebase.initializeApp(firebase_config);
var db = firebase.firestore(app);

function addUser(user){
    var output = db.collection(collection).doc(user.cc).set(user)
    .then(()=> console.log("Usuario agregado"))
    .catch((error)=> console.log("Error inesperado",error))
    return output
}

module.exports = {addUser:addUser, db:db};