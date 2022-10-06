//Set configuration variables based on app environment

//Server settings for development environment
const dev = {
	serverSettings: {
        corsOrigin: "http://localhost:3000"
    }
};

//Server settings for Heroku environment
const prod = {
    serverSettings: {
        corsOrigin: "https://speed-backend-team7.herokuapp.com"
    }
};

module.exports = (process.env.NODE_ENV === 'production' ? prod : dev)