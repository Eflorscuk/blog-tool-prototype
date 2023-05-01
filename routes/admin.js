const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Post's page")
})

router.get('/categories', (req, res) => {
    res.send("category page")
})

module.exports = router