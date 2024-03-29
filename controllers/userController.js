const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createNewUser = function (req, res, next) {
	const { username, password, repeatPassword, email, createdAt } = req.body;

	if (password === repeatPassword && password.length > 5) {
		//CREATE USER
		const newUser = new User({
			username: username,
			password: bcrypt.hashSync(password, 10),
			email: email,
			timestamp: createdAt,
			posts: [],
		});
		//STORING USER IN DB
		newUser.save(err => {
			//EMAIL ERROR
			if (err) {
				return res.status(400).json({
					title: 'error',
					error:
						'Make sure your username is 4-20 characters long and email is valid.',
				});
			}
			res.status(200).json({ title: 'Signed up successfully.' });
		});
		//PASSWORDS DON'T MATCH
	} else {
		res.status(400).json({
			title: 'error',
			error:
				'Make sure your password is longer than 5 characters and typed correctly twice.',
		});
	}
};

exports.login = function (req, res, next) {
	const { email, password } = req.body;
	User.find({ email: email }, (err, user) => {
		if (err) console.log(err);
		//USER NOT FOUND
		if (user.length === 0) {
			res
				.status(401)
				.json({ title: 'user not found.', error: "that email doesn't exist." });
			return;
		}

		const correctPassword = bcrypt.compareSync(password, user[0].password);
		//INCCORECT PASSWORD
		if (!correctPassword) {
			res
				.status(401)
				.json({ title: 'login failed.', error: 'inccorect password' });
			return;
		}
		//ALL IS GOOD
		const token = jwt.sign({ user: user }, process.env.JWT_SECRET_KEY, {
			expiresIn: '7 days',
		});
		res.status(200).json({ title: 'login successful.', token });
	});
};

exports.getLoggedInUser = function (req, res, next) {
	jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
		if (err) return console.log(err);
		//IF JWT VALID
		return res.status(200).json({
			user: {
				username: decoded.user[0].username,
				email: decoded.user[0].email,
				id: decoded.user[0]._id,
			},
		});
	});
};

exports.getUser = function (req, res, next) {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			res.status(404).json({ title: 'error', error: 'User not found' });
		}
		res.status(200).json({
			userUsername: user.username,
			userTimestamp: user.timestamp,
			posts: user.posts,
		});
	}).populate({
		path: 'posts',
		populate: { path: 'author', select: 'username' },
	});
};
