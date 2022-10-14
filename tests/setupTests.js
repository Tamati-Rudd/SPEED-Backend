const express = require('express')
const app = express();
const mongoConfig = require('../config/mongo-config');
let db;
let server;

module.exports = {
    /**
     * Setup test environment
     */
    setup: async function () {
        //Setup database connection
        await mongoConfig.connectToCluster();

        //Import route objects
        const submittedRoute = require('../routes/submitted');
        const viewRoute = require('../routes/viewable');
        const moderateRoute = require('../routes/moderate');
        const analyseRoute = require('../routes/analyse');

        //Route requests to the correct file
        app.use('/submit', submittedRoute);
        app.use('/articles', viewRoute);
        app.use('/moderate', moderateRoute);
        app.use('/analyse', analyseRoute);
        console.log("Test Environmemt: Route setup complete")

        //Start test server
        server = app.listen(4444, () => {
            console.log(`Test Environment: Unit testing server started on port 4444`);
        });

        //Configure database
        db = mongoConfig.getDb();
        await db.createCollection("SubmittedArticles");
        await db.createCollection("AcceptedArticles");
        await db.createCollection("RejectedArticles");
        await db.createCollection("ViewableArticles");

        //Insert test data
        await db.collection("AcceptedArticles").insertOne({
            "_id":"6334080b423576d8a3beba63",
            "title": "An experimental evaluation of test driven development vs. test-last development with industry professionals",
            "author": "Munir, H., Wnuk, K., Petersen, K., Moayyed, M.",
            "source": "EASE2014",
            "publication_year": "2014",
            "volume_number": "4",
            "issue_number": "",
            "doi": "https://doi.org/10.1145/2601248.2601267",
            "se_practice": "",
            "claimed_benefit": "",
            "level_of_evidence": ""
        });

        console.log("Test Environment: Database setup complete\n");
    },

    /**
     * Return the test server
     * @returns server object
     */
    getServer: function () {
        return server;
    },

    /**
     * Shutdown test environment
     */
    shutdown: async function () {
        mongoConfig.disconnectFromCluster()
        .then(() => {
            server.close(() => {
                console.log("Test Environment: Closed database connection and server");
            })
        })
    }
};