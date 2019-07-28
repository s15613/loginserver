const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
        type: String,
		required: true
	},
	followers: [],
	following: []
})

module.exports = mongoose.model('User', userSchema)
