const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')


exports.register = (req, res) => {
    const { isValid, errors } = validateRegisterInput(req.body)

    if (!isValid) {
        return res.status(404).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email was used!'
                return res.status(404).json(errors)
            }

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    const newUser = new User({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                    })

                    newUser.save()
                        .then(newUser => {
							const user = newUser.toObject()
							delete user.password
							res.json(user)
						})
                        .catch(err => console.log(err))
                })
            })
        })
}

exports.login = (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)

		if (!isValid) {
			return res.status(404).json(errors)
		}

		User.findOne({ email: req.body.email })
			.then(user => {
				if (user) {
					bcrypt.compare(req.body.password, user.password)
					.then(isMatch => {
						if (isMatch) {
							const token = jwt.sign({ id: user._id, username: user.username }, 
													process.env.SECRET, 
													{ expiresIn: '1d' }, 
													function (err, token) {
														return res.json({
															success: true,
															token: token
														})
								})
						} else {
							errors.password = 'Password is incorrect'
							return res.status(404).json(errors)
						}
					})
				} else {
					errors.email = 'User not found'
					return res.status(404).json(errors)
				}
			})
}

exports.info = (req, res) => {
	User.findById(req.params.id, '-password')
			.then(user => {
				if (user) {
					return res.json(user)
				} else {
					return res.status(404).json({ msg: 'User not found'})
				}
			})
			.catch(err => console.log(err))
}

exports.follow = (req, res) => {
	User.findOneAndUpdate({
		_id: req.user._id 
	}, {
		$push: { following: req.body.userId }
	},
	{ new: true })
	.then(user => {
		User.findOneAndUpdate({
			_id: req.body.userId
		}, {
			$push: { followers: req.user._id }
		}, { new: true})
		.then(user => res.json({ userId: req.body.userId }))
		.catch(err => console.log(err))
	})
	.catch(err => console.log(err))
}

exports.unfollow = (req, res) => {
	User.findOneAndUpdate({
		_id: req.user._id
	}, {
		$pull: { following: req.body.userId }
	}, { new: true })
	.then(user => {
		User.findOneAndUpdate({
			_id: req.body.userId
		}, { 
			$pull: { followers: req.user._id }
		}, { new: true })
		.then(user => res.json({ userId: req.body.userId }))
		.catch(err => console.log(err))
	})
	.catch(err => console.log(err))
}

exports.search = (req, res) => {
	User.find({ 'username': new RegExp(req.body.text, 'i')}, 'username')
	.then(users => res.json(users))
	.catch(err => res.status(404).json({ msg: 'User not found'}))
}