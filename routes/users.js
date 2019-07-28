const router = require('express').Router()
const passport = require('passport')
const userControllers = require('../controllers/users')

router.post('/register', userControllers.register)
router.post('/login', userControllers.login)
router.get('/info/:id', userControllers.info)
router.post('/follow',
            passport.authenticate('jwt', { session: false }),
            userControllers.follow)
router.post('/unfollow', 
            passport.authenticate('jwt', { session: false }),
            userControllers.unfollow)
router.post('/search', userControllers.search)

module.exports = router