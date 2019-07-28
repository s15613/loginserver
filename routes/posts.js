const router = require('express').Router()
const postControllers = require('../controllers/posts')
const passport = require('passport')

router.get('/', postControllers.getPosts)
router.post('/add',
            passport.authenticate('jwt', { session: false }), 
            postControllers.addPost)
router.get('/following',
            passport.authenticate('jwt', { session: false }), 
            postControllers.followingPost)
router.get('/mypost/:userId', postControllers.myPost)

module.exports = router