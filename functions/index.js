const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require('./permissions.json');

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: 'https://bank-statement-api-b2ee6.firebaseio.com',
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use(cors({ origin: true }));

/// Routes
// Create
app.post('/api/create', (req, res) => {
   (async () => {
      try {
         await db
            .collection('statements')
            .doc('/' + req.body.id + '/')
            .create({
               saaja: req.body.saaja,
               selite: req.body.selite,
               viesti: req.body.viesti,
               maksaja: req.body.maksaja,
               kirjauspvm: req.body.kirjauspvm,
               arvopvm: req.body.arvopvm,
               maksupvm: req.body.maksupvm,
               maara: req.body.maara,
               arkistotunnus: req.body.arkistotunnus,
            });

         return res.status(200).send();
      } catch (error) {
         console.log(error);
         return res.status(500).send(error);
      }
   })();
});

// Read all
app.get('/api/read', (req, res) => {
   (async () => {
      try {
         let query = db.collection('statements');
         let response = [];
         await query.get().then((querySnapshot) => {
            let docs = querySnapshot.docs;

            for (let doc of docs) {
               const selectedItem = {
                  id: doc.id,
                  saaja: doc.data().saaja,
                  selite: doc.data().selite,
                  viesti: doc.data().viesti,
                  maksaja: doc.data().maksaja,
                  kirjauspvm: doc.data().kirjauspvm,
                  arvopvm: doc.data().arvopvm,
                  maksupvm: doc.data().maksupvm,
                  maara: doc.data().maara,
                  arkistotunnus: doc.data().arkistotunnus,
               };

               response.push(selectedItem);
            }
            return response;
         });
         return res.status(200).send(response);
      } catch (error) {
         console.log(error);
         return res.status(500).send(error);
      }
   })();
});

// Read spesific

// Update

// Delete

exports.app = functions.https.onRequest(app);
