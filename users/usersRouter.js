const router = require('express').Router();

const Users = require('../users/userModel');

router.get('/', (req, res) => {
	Users.find()
		.then(users => {
			res.json({ users, decodedToken: req.decodedJwt });
		})
		.catch(err => res.send(err));
});

module.exports = router;

// not working
