const express = require('express')
const dotenv = require('dotenv').config({ path: "./.env" });
const port = process.env.PORT || 4000;
const app = express();
const mongoConfig = require('./config/mongo-config');

//TODO: Setup CORS

//Connect to the database cluster, then start the server
mongoConfig.connectToCluster()
.then(() => {
    //Start the server
    app.listen(port, () => {
        console.log(`Server listening on port ${port} for requests from TODO: Setup CORS, and connected to database cluster`);
    });
})
.catch((error) => { //Handle any error that occurs while attempting to start the server
    console.error("An error occured while attempting to start the server: "+error);
});
    