const express = require('express')
const dotenv = require('dotenv').config({ path: "./.env" });
const port = process.env.PORT || 4000;
const app = express();
const mongoConfig = require('./config/mongo-config');

//CORS protection - only allows requests from the access control origin 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://speed-frontend-team7.herokuapp.com/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Connect to the database cluster, then start the server
mongoConfig.connectToCluster()
.then(() => {
    //Import route objects
    const submittedRoute = require('./routes/submitted');
    const viewRoute = require('./routes/viewable');
    const moderateRoute = require('./routes/moderate');

    //Route requests to the correct file
    app.use('/submit', submittedRoute);
    app.use('/articles', viewRoute);
    app.use('/moderate', moderateRoute);

    //Start the server
    app.listen(port, () => {
        console.log(`Server listening on port ${port} for requests from http://localhost:3000, and connected to database cluster`);
    });
})
.catch((error) => { //Handle any error that occurs while attempting to start the server
    console.error("An error occured while attempting to start the server: "+error);
});