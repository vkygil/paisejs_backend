const { Router } = require("express");
const router = Router();

const admin = require("firebase-admin");
const db = admin.firestore();

let verifyToken = async (tolkien) => {
  return await admin.auth()
    .verifyIdToken(tolkien ||
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE1YzJiNDBhYTJmMzIyNzk4NjY2YTZiMzMyYWFhMDNhNjc3MzAxOWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGFpc2VqczIiLCJhdWQiOiJwYWlzZWpzMiIsImF1dGhfdGltZSI6MTY3NzAyODY1MCwidXNlcl9pZCI6ImNWRm50Ynd2N3JaQ3RRZUd0dWdvOFk1OFdDZjIiLCJzdWIiOiJjVkZudGJ3djdyWkN0UWVHdHVnbzhZNThXQ2YyIiwiaWF0IjoxNjc3MDI4NjUwLCJleHAiOjE2NzcwMzIyNTAsImVtYWlsIjoiaHVzbmF0Ljk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImh1c25hdC45OUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.ZC4SiiiI8mq2MY6ePnjtkKcYydcYL3PWqun8Y0Fg3QJ5jFaqHMQQO_Tv3nOYrbCda3-IRcWPaC41zfb-tV7H13BscqxN1_VSeDXQtS-4n-NyqYYKXp1QkgqZGdgGYSH805aOJB61S4S3U8KB515jPCrgyTZl6wMn7tyt7Mgf-XIxelR982I9AXp-xqwTdJc5f0hdQzBEFtfn5eZvXhZMp6VrCOFU387JX1N24EI5dryDzo7k1sM_eAkYv3qyR_XcQLzsPELinkvEm2FtB1VYwJp3PJcfcKDtZ1RE-bcW3v9SKls0G3Cgo4cNIJvTivuKm-m7NV6cC0ITtSirdjhiTg"
    )
    .then((decodedToken) => {
      return decodedToken.uid
      // const uid = ;
      // console.log(uid);
    })
    .catch((error) => {
      console.log(error);
      return false
      // Handle error
    });

}
// Create
router.post("/api/products", async (req, res) => {
  try {
    await db
      .collection("products")
      .doc("/" + req.body.id + "/")
      .create({ name: req.body.name });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/api/book/:product_id", (req, res) => {
  (async () => {
    try {
      const doc = db.collection("book").doc(req.params.product_id);
      const item = await doc.get();
      const response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

router.get("/api/products", async (req, res) => {
  try {
    let query = db.collection("books");
    const querySnapshot = await query.get();
    let docs = querySnapshot.docs;

    const response = docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/api/book", async (req, res) => {
  try {
    // console.log(req)
    let uid = await verifyToken(req.body.token)
    const document = await db.collection('users').doc(uid).set({ book: req.body.book }, { merge: true })
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ status: "not ok", message: "token inlvalid" });
  }
});
router.post("/api/getbook", async (req, res) => {
  try {
    // console.log(req)
    let uid = await verifyToken(req.body.token)
    const document = await (await db.collection('users').doc(uid).get()).data()
    return res.status(200).json({ status: "ok" , data:document});
  } catch (error) {
    return res.status(500).json({ status: "not ok", message: "token inlvalid" });
  }
});

router.put("/api/products/:product_id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.product_id);
    await document.update({
      name: req.body.name,
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

router.delete("/api/products/:product_id", async (req, res) => {
  try {
    const doc = db.collection("products").doc(req.params.product_id);
    await doc.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;