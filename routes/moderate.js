const express = require("express");
const router = express.Router();
const mongoConfig = require("../config/mongo-config");
const db = mongoConfig.getDb();
const ObjectId = require("mongodb").ObjectId;
const submittedCollection = "SubmittedArticles"; 
const rejectedCollection = "RejectedArticles"; 
const acceptedCollection = "AcceptedArticles"; 

router.use(express.json());

/**
 * Retrieve all submitted articles for moderation
 */
router.get("/moderateArticles", async (req, res) => {
  try {
    let viewable = await db
      .collection(submittedCollection)
      .find({}, { article: { _id: req, title: req } })
      .toArray();
    if (viewable.length !== 0) {
      res.status(200).json(viewable); //200: articles found
    } else {
      res.status(404).send("moderate articles list data not found"); //404: articles not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //500: cannot connect to database
  }
});

/**
 * Accept a submitted article
 * Also deletes from the submitted collection
 */
router.get("/moderateArticles/accepted/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (id === null || id.trim() === "") throw new Error("record not found");
    id = id.trim();
    let accepted = await db
      .collection(submittedCollection)
      .findOne({ _id: ObjectId(id) });

    if (accepted) {
      let found = await db
        .collection(acceptedCollection)
        .findOne({ title: accepted.title });
      await db.collection(submittedCollection).deleteOne({ _id: ObjectId(id) });

      if (!found) {
        let insert = await db
          .collection(acceptedCollection)
          .insertOne(accepted);
      } else console.log("already exists");
    } else {
      res.status(404).send({ error: "Accected articles id not found" }); //404: couldn't find accepted article in the submitted collection
      return;
    }
    let viewable = await db
      .collection(submittedCollection)
      .find({}, { article: { _id: req, title: req } })
      .toArray();

    if (viewable.length !== 0) {
      res.status(200).json(viewable); //200: Article accepted
    } else {
      res.status(404).send("accepted articles list data not found"); //404: aricles not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //500: error
  }
});

/**
 * Accept a submitted article
 * Also deletes from the submitted collection
 */
router.get("/moderateArticles/rejected/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (id === null || id.trim() === "") {
      throw new Error ("id cannot be blank.");
    }
    id = id.trim();
    let rejected = await db
      .collection(submittedCollection)
      .findOne({ _id: ObjectId(id) });

    if (rejected) {
      await db.collection(submittedCollection).deleteOne({ _id: ObjectId(id) });

      let found = await db
        .collection(rejectedCollection)
        .findOne({ title: rejected.title });

    } else {
      res.status(404).send({ error: "Rejected articles id not found" }); //404: couldn't find rejected article in the submitted collection
      return;
    }

    let viewable = await db
      .collection(submittedCollection)
      .find({}, { article: { _id: req, title: req } })
      .toArray();

    res.status(200).json(viewable); //200: Article rejected
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //500: error
  }
});

//Export router object
module.exports = router;