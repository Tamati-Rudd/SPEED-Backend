const express = require('express');
const router = express.Router();
const mongoConfig = require('../config/mongo-config');
const db = mongoConfig.getDb();
const submittedCollection = "SubmittedArticles";// need to change to viewable collection when added
const rejectedCollection = "RejectedArticles";// need to change to viewable collection
const acceptedCollection = "AcceptedArticles";// need to change to viewable collection
const viewableCollection = "ViewableArticles";// need to change to viewable collection

router.use(express.json());

router.get('/moderateArticles', async (req, res) => {
    try {
        let viewable = await db.collection(submittedCollection).find({}, { article: {_id: req, title: req}}).toArray();
        
        if (viewable.length !== 0) {// displays all articles
            res.status(200).json(viewable); 
        } else {
            res.status(404).send("articles list data not found"); //aricles not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error connecting to database"); //cannot connect to database 
    }
})

router.get('/moderateArticles/:title', async (req, res) => {
    try {
        const {title} = req.params;

            let viewable = await db.collection(submittedCollection).find({title
                : title}).toArray();
            
            if (viewable.length !== 0) {// displays all articles
                res.status(200).json(viewable); //pass
            } else {
                res.status(404).send("articles list data not found"); //aricles not found
            }
        } catch (error) {
            console.error(error);
        res.status(500).send("Error connecting to database"); //cannot connect to database 
    }
})

router.get('/moderateArticles/accepted', async (req, res) => {
    try {
        let viewable = await db.collection(acceptedCollection).find({}, { article: {_id: req, title: req}}).toArray();
        
        if (viewable.length !== 0) {// displays all articles
            res.status(200).json(viewable); 
        } else {
            res.status(404).send("articles list data not found"); //aricles not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error connecting to database"); //cannot connect to database 
    }
})

router.get('/moderateArticles/rejected', async (req, res) => {
    try {
        let viewable = await db.collection(rejectedCollection).find({}, { article: {_id: req, title: req}}).toArray();
        
        if (viewable.length !== 0) {// displays all articles
            res.status(200).json(viewable); 
        } else {
            res.status(404).send("articles list data not found"); //aricles not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error connecting to database"); //cannot connect to database 
    }
})

//Export router object 
module.exports = router;