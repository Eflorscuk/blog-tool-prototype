const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Category")
const Category = mongoose.model("categories")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/categories', (req, res) => {
    Category.find().sort({date: 'desc'}).then(category => {
        res.render("admin/categories", { category: category})
    }).catch(err => {
        req.flash("error_msg", "Category error...")
        res.redirect("admin/")
    })
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
        return
    }

    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
    }

    new Category(newCategory).save().then(_ => {
        req.flash('success_msg', 'Category created')
        res.redirect('/admin/categories')
    }).catch(err => {
        req.flash('error_msg', 'Try again! Error to save the new category.')
        console.log(`Error ===> ${err}`)
    })
})

router.get("/categories/edit/:id", (req, res) => {
    Category.findOne({ _id: req.params.id }).then(category => {
        res.render('admin/editCategory', { category: category})
    }).catch(err => {
        res.flash('error_msg', "This Id doesn't exist!")
        res.redirect('/admin/categorias')
    })
})

router.post("/categories/edit", (req, res) => {
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
        return
    }

    Category.findOne({ _id: req.body.id }).then(category => {
        category.name = req.body.name
        category.slug = req.body.slug

        category.save().then(_ => {
            req.flash("success_msg", "Category edited successfully")
            res.redirect("/admin/categories")
        }).catch(err => {
            req.flash("error_msg", "Internal error saving category edit")
            console.log("Error => ", err)
            res.redirect("/admin/categories")
        })
    }).catch(err => {
        req.flash("error_msg", "Category edit error")
        console.log("Error Edit ===> ", err)
        res.redirect("/admin/categories")
    })
})

router.post("/categories/delete/", (req, res) => {
    Category.findOneAndRemove({ _id: req.body.id }).then(_ => {
        req.flash("success_msg", "Category Deleted")
        res.redirect("/admin/categories")
    }).catch(err => {
        req.flash("error_msg", "An Error to delete")
        res.redirect("/admin/categories")
    })
})

router.get("/posts", (req, res) => {
    res.render("admin/posts")
})

router.get("/posts/add", (req, res) => {
    Category.find().then(category => {
        res.render("admin/addPost", {category: category})
    }).catch(err => {
        req.flash("error_msg", "Error loading form")
    })
})

module.exports = router