const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(); //Pass an arguement  in initialize app for other projects in firebase. leave empty if default

const express = require('express');
const app = express();

app.get('/screams', (req, res) => {
    admin.firestore()
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => { //get back a promise after get()
            let screams = []; //delare empty array to store response
            data.forEach(doc => {  //loop through the data promise
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount
                }) //return data in each document
            })
            return res.json(screams); //send a response containing our initial array, now with data in json format
        })
        .catch(err => console.error(err)); //another promise to catch errors
});

app.post('/scream', (req, res) => {
    const newScream = {   // this will be tested in postMan but later a form would trigger this createScream and contain these info
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin.firestore().collection('screams').add(newScream).then(doc => {  //confirmation promise to show that scream has been added
        res.json({ message: `scream ${doc.id} created!` })
    })
        .catch(err => { //catch error and give back a server error code 500
            res.status(500).json({ error: 'something wong' });
            console.error(err)
        })
})

//https://baseurl.com/api/

exports.api = functions.https.onRequest(app); //firebase will now serve the routes from express
// Firebase deploy when finalizing
// Firebase serve will allow to test new functions locally