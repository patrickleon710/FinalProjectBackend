const bcrypt = require('bcrypt')

const User = require('../models/User')
const jwt = require('jsonwebtoken')



// getting user information

const getAllUsers = async (req, res) => {
    

    const users = await User.find().select('-password').lean()

    if (!users || !users?.length) {
        res.status(400).json({message: 'No such user found'})
    }

    res.json(users)
}

// getting user information

const getSingleUser = async (req, res) => {
    const { id, username, password } = req.body

    const user = await User.find(id).select('-password').lean().exec()

    if (!user) {
        res.status(400).json({message: 'No such user found'})
    }

    res.json(user)
}

// creating new user 

const createUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password ) {
        return res.status(400).json({message: 'All fields are required'})
    }


    try {
        const duplicateUsername = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
        const duplicatePassword = await User.findOne({ password }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
        if (duplicateUsername) {
            return res.status(409).json({ message: 'Username already in use.'})
        } else if (duplicatePassword) {
            return res.status(409).json({ message: 'Password already in use.'})
        }        
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const user = { username, 'password': hashedPwd }

    const newUser = await User.create(user)

    



    if (newUser) {
        const accessToken = jwt.sign(
            {
                "Info": {
                    "username": newUser.username,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        )
        return res.status(200).json({
            msg: 'signed in successfully',
            user: newUser,
            accessToken
        })
        
    } else {
        res.status(400).json({message: 'Invalid user data entered'})
    }
}

// updating user information

const updateUser = async (req, res) => {
    const { id, username, password } = req.body

    if (!id || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Username already in use.'})
    }

    user.username = username
    
    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})
}

// deleting user information

const deleteUser = async (req, res) => {

    const { id } = req.body

    if (!id) {
        return res.status(400).json({message: 'User ID required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} deleted`

    res.json(reply)

}

module.exports = {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
}