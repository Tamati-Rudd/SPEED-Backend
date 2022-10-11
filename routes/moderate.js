const express = require("express");
const router = express.Router();
const mongoConfig = require("../config/mongo-config");
const db = mongoConfig.getDb();
var ObjectId = require("mongodb").ObjectId;
const submittedCollection = "SubmittedArticles"; // need to change to viewable collection when added
const rejectedCollection = "RejectedArticles"; // need to change to viewable collection
const acceptedCollection = "AcceptedArticles"; // need to change to viewable collection
const viewableCollection = "ViewableArticles"; // need to change to viewable collection

router.use(express.json());

router.get("/moderateArticles", async (req, res) => {
  try {
    let viewable = await db
      .collection(submittedCollection)
      .find({}, { article: { _id: req, title: req } })
      .toArray();

    if (viewable.length !== 0) {
      // displays all articles
      res.status(200).json(viewable);
    } else {
      res.status(404).send("moderate articles list data not found"); //aricles not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //cannot connect to database
  }
});

router.get("/moderateArticles/accepted/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (id === null || id.trim() === "") throw "record not found";
    id = id.trim();
    console.log("accept id: " + id);
    let accepted = await db
      .collection(submittedCollection)
      .findOne({ _id: ObjectId(id) });

    if (accepted) {
      let found = await db
        .collection(acceptedCollection)
        .findOne({ title: accepted.title });
      await db.collection(submittedCollection).deleteOne({ _id: ObjectId(id) });
      console.log("deleted.");

      if (!found) {
        console.log(`add to accepted`);
        let insert = await db
          .collection(acceptedCollection)
          .insertOne(accepted);
      } else console.log("already exists");
    } else {
      //not found
      res.status(404).send({ error: "Accected articles id not found" });
      return;
    }
    let viewable = await db
      .collection(submittedCollection)
      .find({}, { article: { _id: req, title: req } })
      .toArray();

    if (viewable.length !== 0) {
      // displays all articles
      res.status(200).json(viewable);
    } else {
      res.status(404).send("accepted articles list data not found"); //aricles not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //cannot connect to database
  }
});

// this rejected articles will delete articles from submitted articles
router.get("/moderateArticles/rejected/:id", async (req, res) => {
  console.log("reject: " + req.params.id);
  try {
    let id = req.params.id;
    if (id === null || id.trim() === "") {
      throw "id cannot be blank.";
      return;
    }
    id = id.trim();
    console.log("rejected id: " + id);
    let rejected = await db
      .collection(submittedCollection)
      .findOne({ _id: ObjectId(id) });

    if (rejected) {
      await db.collection(submittedCollection).deleteOne({ _id: ObjectId(id) });
      console.log("deleted.");

      let found = await db
        .collection(rejectedCollection)
        .findOne({ title: rejected.title });

    } else {
      res.status(404).send({ error: "Rejected articles id not found" });
      return;
    }

    let viewable = await db
      .collection(submittedCollection)
      .find({}, { article: { _id: req, title: req } })
      .toArray();

    res.status(200).json(viewable);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //cannot connect to database
  }
});

//Export router object
module.exports = router;