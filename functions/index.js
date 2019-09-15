const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(); //Pass an arguement  in initialize app for other projects in firebase. leave empty if default


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.getScreams = functions.https.onRequest((request, response) => {
    admin.firestore().collection('screams').get()
        .then(data => { //get back a promise after get()
            let screams = []; //delare empty array to store response
            data.forEach(doc => {  //loop through the data promise
                screams.push(doc.data()) //return data in each document
            })
            return response.json(screams); //send a response containing our initial array, now with data in json format
        })
        .catch(err => console.error(err)); //another promise to catch errors
});

exports.createScream = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'method not allowed' });
    }
    const newScream = {   // this will be tested in postMan but later a form would trigger this createScream and contain these info
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore().collection('screams').add(newScream).then(doc => {  //confirmation promise to show that scream has been added
        res.json({ message: `scream ${doc.id} created!` })
    })
        .catch(err => { //catch error and give back a server error code 500
            res.status(500).json({ error: 'something wong' });
            console.error(err)
        })
})

// Firebase deploy when finalizing
// Firebase serve will allow to test new functions locally