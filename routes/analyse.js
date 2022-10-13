const express = require("express");
const router = express.Router();
const mongoConfig = require("../config/mongo-config");
const db = mongoConfig.getDb();
const acceptedCollection = "AcceptedArticles"; // need to change to viewable collection
const viewableCollection = "ViewableArticles"; // need to change to viewable collection

router.use(express.json());

/**
 * Retrieve the accepted articles from the database
 */
router.get("/retrieve", async(req, res) => {
    try {
        throw new Error("not yet implemented");
    } catch(error) {
        console.error(error);
        res.status(500).send("Error connecting to database");
    }
});

/**
 * Submit an analysis for an article, making it searchable (viewable) on SPEED
 */
router.post("/submit", async(req, res) => {
    try {
        throw new error;
    } catch(error) {
        console.error(error);
        res.status(500).send("Error connecting to database");
    }
});

//Export router object
module.exports = router;