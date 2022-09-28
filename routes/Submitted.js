const express = require('express');
const router = express.Router();
const mongoConfig = require('../config/mongo-config');
const db = mongoConfig.getDb();
const submittedCollection = "SubmittedArticles";

router.use(express.json());

/**
 * Save a submitted article to the database
 */
router.post('/save', async(req, res) => {
    try {
        let submitted = await db.collection(submittedCollection).insertOne(req.body);
        if (submitted.acknowledged) {
            res.status(201).send("Article submitted!");
        } else {
            res.status(500).send("Error submitting article");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured"); 
    }
})

//Export router object
module.exports = router;