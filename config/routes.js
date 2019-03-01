const axios = require('axios');
const bcrypt = require('bcryptjs');

const { authenticate } = require('../middleware/auth/authenticate');
const generateToken = require('../middleware/tokenServices');
const Users = require('../users/userModel');
const usersRouter = require('../users/usersRouter');

module.exports = server => {
	server.get('/users', authenticate, usersRouter);
	server.post('/api/register', register);
	server.post('/api/login', login);
	server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
	// implement user registrations
	let { username, password } = req.body;
	const hash = bcrypt.hashSync(password, 10);
	password = hash;

	Users.add({ username, password })
		.then(newUser => {
			res.status(200).json(newUser);
		})
		.catch(err => res.status(500).json(err));
}

function login(req, res) {
	// implement user login
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);
				res.status(200).json({
					message: `Welcome ${user.username}!`,
					token,
				});
			} else {
				res.status(401).json({ message: 'Invalid creds' });
			}
		})
		.catch(err => res.status(500).json(err));
}

function getJokes(req, res) {
	const requestOptions = {
		headers: { accept: 'application/json' },
	};

	axios
		.get('https://icanhazdadjoke.com/search', requestOptions)
		.then(response => {
			res.status(200).json(response.data.results);
		})
		.catch(err => {
			res.status(500).json({ message: 'Error Fetching Jokes', error: err });
		});
}
