require('dotenv').config()
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const pincodes = new Map();

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

// console.log(process.env.private_key.replace(/\\n/g, '\n'));
// const serviceAccount = require("./cred.json");
admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.type,
        "project_id": process.env.project_id,
        "private_key_id": process.env.private_key_id,
        "private_key": process.env.private_key.replace(/\\n/g, '\n'),
        "client_email": process.env.client_email,
        "client_id": process.env.client_id,
        "auth_uri": process.env.auth_uri,
        "token_uri": process.env.token_uri,
        "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    }),
    databaseURL: "https://restapi-js.firebaseio.com",
});


const db = admin.firestore();
const auth = admin.auth();
let token =""
// auth.verifyIdToken(token)
//     .then((decodedToken) => {
//         const uid = decodedToken.uid;
//         console.log(decodedToken);
//         // ...
//     })
//     .catch((error) => {
//         console.log(error);
//         // Handle error
//     });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/generatePIN', (req, res) => {
    let pin = String(Math.random()).slice(2, 6)
    pincodes.set(pin, { href: req.body.href })
    res.json({ pin: pin })
})
app.post('/generatePIN_', (req, res) => {
    auth.verifyIdToken(req.body.token)
        .then((decodedToken) => {
            let pin = String(Math.random()).slice(2, 6)
            pincodes.set(pin, { token, email: decodedToken.email })
            res.json({ pin: pin })
        })
        .catch((error) => {
            console.log(error);
            res.send('Hello World!')
            // Handle error
        });
})
app.get('/checkPIN/:code', (req, res) => {
    console.log(req.params.code);
    let mapX = pincodes.get(req.params.code)
    console.log("");
    res.json(mapX || { href: null })
})

// let deletePin = (key, t = (120)) => {
//     setTimeout(() => {
//         pincodes.delete(key)
//     }, t * 1000)
// }

app.use(require("./routes/products.routes"));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})