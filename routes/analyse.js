const ObjectId = require('mongodb').ObjectId;
const express = require("express");
const router = express.Router();
const mongoConfig = require("../config/mongo-config");
const db = mongoConfig.getDb();
const acceptedCollection = "AcceptedArticles"; 
const viewableCollection = "ViewableArticles"; 

router.use(express.json());

/**
 * Retrieve the accepted articles from the database
 */
router.get("/retrieve", async(req, res) => {
    try {
        let articles = await db.collection(acceptedCollection).find({}).toArray();
        if (articles.length !== 0) {
            res.status(200).json(articles); //200: article list returned
        } else {
            res.status(404).send("There are no accepted articles to analyse"); //404: no articles to analyse
        }
    } catch(error) {
        console.error(error);
        res.status(500).send("Error connecting to database"); //500: error
    }
});

/**
 * Submit an analysis for an article, making it searchable (viewable) on SPEED
 * The article is also deleted from the accepted article collection
 */
router.post("/submit", async(req, res) => {
    try {
        //Make the analysed article viewable, and verify this
        let viewable = await db.collection(viewableCollection).insertOne(req.body);
        if (viewable.acknowledged) { 
            //Delete the analysed article from the accepted articles list. Log an error if this fails.
            let deleted = await db.collection(acceptedCollection).deleteOne({_id: ObjectId(req.body._id)})
            if (!deleted.acknowledged) {
                console.log("An article was made viewable, but wasn't present in the accepted collection")
            }
            res.status(201).send("The analysed article is now viewable on SPEED"); //201: article now viewable
        }
    } catch(error) {
        console.error(error);
        res.status(500).send("Error connecting to database"); //500: error
    }
});

//Export router object
module.exports = router;