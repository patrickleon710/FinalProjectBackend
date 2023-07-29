const express = require('express')
const router = express.Router()

const {
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getSingleEntry
} = require('../controllers/entryController')


router.route('/')
    .get(getEntries)
    .post(createEntry)
router.route('/:entryId')
    .get(getSingleEntry)
    .patch(updateEntry)
    .delete(deleteEntry)

module.exports = router