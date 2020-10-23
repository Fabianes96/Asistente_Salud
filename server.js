var firebase = require("firebase/app");
require("firebase/firestore");

const express = require('express');
const app = express();



const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const firebase_config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

firebase.initializeApp(firebase_config);
const db = firebase.firestore();

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.get('/', (req, res) => {
    var docRef = db.collection("test").doc("xEh9EeHAcV9yl0VcLSQQ");
    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    res.send('Hello World!')
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
