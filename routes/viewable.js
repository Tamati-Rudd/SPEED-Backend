const express = require('express');
const router = express.Router();
const mongoConfig = require('../config/mongo-config');
const db = mongoConfig.getDb();
const viewableCollection = "ViewableArticles";

router.use(express.json());

/**
 * Retrieve all viewable/searchable articles (articles in SPEED)
 */
router.get('/view', async (req, res) => {
    try {
        let viewable = await db.collection(viewableCollection).find({}, { article: {_id: req, title: req}}).toArray();
        if (viewable.length !== 0) {
            res.status(200).json(viewable); //200: article data found
        } else {
            res.status(404).send("articles list data not found"); //404: aricles not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error connecting to database"); //500: error
    }
})

//Export router object 
module.exports = router;