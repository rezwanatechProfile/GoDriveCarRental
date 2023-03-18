const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

// we need our User model 
const User = require('../models/users.js')

router.get('/register', (req, res) => {
	res.render('users/register.ejs')
})

router.post('/register', (req, res) => {
	// we need to encrypt our passwords 
	// we can use the bcrypt library for this 
	// we need to import the library at the top of our file 
	// first we need to generate salt 
	const salt = bcrypt.genSaltSync(10)
	// salt is a random number garbage we add to our encrypted passwords
	// the number we pass in to genSaltSync determines how much salt 
	// we are adding, the higher the number the more secure, but the longer it takes 
	// now we're going to generate the actual hashed password 
	// console.log(req.body)
	req.body.password = bcrypt.hashSync(req.body.password, salt)
	// console.log(req.body)

	// first lets see if somebody else already has this username 
	User.findOne({username: req.body.username}, (err, userExists) => {
		if (userExists) {
			res.send('that username is taken')
		} else {
			User.create(req.body, (err, createdUser) => {
				console.log(createdUser)
				req.session.currentUser = createdUser
				res.redirect('/cars/index')
			})
		}
	})
})

router.get('/signin', (req, res) => {
	res.render('users/signin.ejs')
})


router.post('/signin', (req, res) => {
	// we need to get the user with that username 
	User.findOne({username: req.body.username}, (err, foundUser) => {
		if(foundUser) {
			// if they do exist, we need to compare their passwords 
			// we can compare passwords using bcrypt's compareSync function 
			const validLogin = bcrypt.compareSync(req.body.password, foundUser.password)
			// compareSync returns true if they match 
			// and false if they don't match 
			// if the passwords match, log them in 
			if(validLogin) {
				req.session.currentUser = foundUser
				// we are letting the session know   
				// that we have logged in
        foundUser.save()
        console.log(req.body.username)
				res.redirect('/cars/index')
			} else {
				res.send('Invalid username or password')
			}

		} else {
			// if the user does not exist 
			// we need to send a message
			res.send('Invalid username or password')
		}
	})
})





// DESTROY session route 
router.get('/signout', (req, res) => {
	// this destroy the session 
	// you can always access the user IF signed in, in this req object
	// console.log(req.session.currentUser)
	req.session.destroy()
	res.redirect('/')
})


module.exports = router