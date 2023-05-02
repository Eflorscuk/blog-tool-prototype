const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Category")
const Category = mongoose.model("categories")

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

router.post("/categories/new", (req, res) => {
    let errors = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Invalid Name" })
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Invalid Slug"})
    }

    if(req.body.name.length < 2) {
        errors.push({ text: "Category name is too small"})
    }

    if(errors.length > 0) {
        res.render("admin/addCategories", { errors: errors })
    }

    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
    }

    new Category(newCategory).save().then(_ => {
        console.log("New Category Save")
    }).catch(err => {
        console.log(`Error ===> ${err}`)
    })
})

module.exports = router