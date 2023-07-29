// PACKAGES
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// FILES
const connectDB = require('./config/dbConn')
const corsOptions = require('./config/corsOptions')
const { logEvents, logger } = require('./middleware/logger')

const PORT = process.env.PORT



// middleware
app.use(cors(corsOptions))

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(logger)

app.use('/', require('./routes/root'))
app.use('/signup', require('./routes/signupRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/entries', require('./routes/entryRoutes'))
app.use('/user', require('./routes/userRoutes'))




app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})