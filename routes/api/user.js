const express = require('express');
const router = express.Router();

//Additional
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');
const passport = require('passport');

//------------ Collection ----------------

const User = require('../../models/User');

// --------------------------------------

//----------------Validation--------------
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
//----------------------------------------

// @route       GET api/users
// @desc        Default Route
// @access      Public
router.get('/', (req, res) => {
	res.send('This api is working correctly');
});

// @route       GET api/users/register
// @desc        Register user
// @access      Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	//Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already exists';
			return res.status(400).json(errors);
		} else {
			const newUser = new User({
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				firstname: req.body.firstname,
				lastname: req.body.lastname
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => {
							res.json(user);
						})
						.catch((err) => {
							console.log(err);
						});
				});
			});
		}
	});
});

// @route       GET api/users/login
// @desc        Login User / Returning JWT Token
// @access      Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	//Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	//Find user by email
	User.findOne({ email }).then((user) => {
		//check for user
		if (!user) {
			errors.email = 'User not found';
			return res.status(404).json(errors);
		}

		//check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				//User matched
				const payload = { id: user.id, username: user.username, avatar: user.avatar }; // Create JWT Payload
				//Sign token
				jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token
					});
				});
			} else {
				errors.password = 'Password Incorrect';
				return res.status(404).json(errors);
			}
		});
	});
});

// @route       GET api/users/current
// @desc        Return current user
// @access      Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		firstname: req.user.firstname,
		lastname: req.user.lastname,
		addition: 'Using passport-jwt'
	});
});

module.exports = router;
