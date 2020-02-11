const express = require('express');
const app = express();

//Additional
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const passport = require('passport');

const port = process.env.PORT || 5000;

//-------------custom utilities----------------------
const logHelper = require('./utils/logSeparation');

//----------------------------------------------------

//----------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport);

//----------------------------------------------------

// ------------------- Database ----------------------

const databaseName = 'project-SE';

mongoose
	.connect(`mongodb://localhost/${databaseName}`, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		logHelper.sendDatabaseLog(`Successfully connected to the database -> ${databaseName}`);
	})
	.catch((err) => {
		console.log(err);
	});

// ---------------------------------------------------

app.get('/', (req, res) => {
	res.send('This route is working correctly');
});

// -------------- Routes -----------------

const userRoute = require('./routes/api/user');
app.use('/api/user', userRoute);

app.listen(port, () => {
	//console.log(`This server is currently running on port ${port}`);
	logHelper.sendDebugLog(`Server currently running on port ${port}`);
});
