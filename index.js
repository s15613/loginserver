const express = require('express')
const dotenv = require('dotenv') 
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

const userRoutes = require('./routes/users')
const postRoutes = require('./routes/posts')

// setup environment
dotenv.config()

// mongo db connect
mongoose.connect(process.env.MONGODB_URI, { 
        useCreateIndex: true,
        useNewUrlParser: true })
        .then(() => console.log("MongoDB successfully connected"))
        .catch(err => console.log(err))

const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use(passport.initialize())
require('./config/passport')(passport)

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

// run app
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))