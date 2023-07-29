const express = require('express')
const router = express.Router()

const {
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers
} = require('../controllers/userController')
 

router.route('/')
    //.get(getAllUsers)
    .get(getSingleUser)
    .post(createUser)
router.route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router