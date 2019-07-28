const Post = require('../models/Post')

exports.getPosts = (req, res) => {
    Post.find()	
        .sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
}

exports.addPost = (req, res) => {
    const text = req.body.text.trim()

			const newPost = new Post({
				user: {
					_id: req.user.id,
					username: req.user.username
				},
				text
			})

			newPost.save()
				.then(post => res.json(post))
				.catch(err => console.log(err))
}

exports.followingPost = (req,res) => {
	Post.find({
		'user._id': { $in: req.user.following }
	})
	.sort({ createdAt: -1 })
	.then(posts => res.json(posts))
	.catch(err => console.log(err))
}

exports.myPost = (req,res) => {
	Post.find({ 'user._id': req.params.userId })
			.sort({ createdAt: -1 })
			.then(posts => res.json(posts))
			.catch(err => console.log(err))

}