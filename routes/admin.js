const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Post's page")
})

router.get('/categories', (req, res) => {
    res.render("admin/categories")
})

router.get("/categories/add", (req, res) => {
    res.render("admin/addCategories")
})

module.exports = router