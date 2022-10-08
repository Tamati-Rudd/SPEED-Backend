const express = require("express");
const router = express.Router();
const mongoConfig = require("../config/mongo-config");
const db = mongoConfig.getDb();
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

// // delete function here.. need to work out what to do
// router.delete("/moderateArticles/:id", async (req, res) => {
//   console.log("Delete :" + req.params.id);
//   res.status(200).send("delete.");
// });

router.get("/moderateArticles/accepted/:id", async (req, res) => {
  try {
    console.log("accept id: " + req.params.id);
    let viewable = await db
      .collection(acceptedCollection)
      .find({}, { article: { _id: req.params.id } })
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

// this doesn't work.
router.get("/moderateArticles/rejected/:id", async (req, res) => {
  console.log("reject: " + req.params.id);
  try {
    let viewable = await db
      .collection(rejectedCollection)
      .find({}, { article: { _id: req.params.id } })
      .toArray();

    if (viewable.length !== 0) {
      // displays all articles
      res.status(200).json(viewable);
    } else {
      res.status(404).send("rejected articles list data not found"); //aricles not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to database"); //cannot connect to database
  }
});

//Export router object
module.exports = router;