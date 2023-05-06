const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/User")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", (req, res) => {
    let errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Invalid name" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ text: "Invalid email" })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ text: "Invalid password" })
    }

    if (req.body.password.length < 4) {
        errors.push({ text: "This password is too small, please insert one with 5 or more characteres"})
    }

    if (req.body.password != req.body.password2) {
        errors.push({ text: "The passwords are not the same"})
    }

    if (errors.length > 0) {
        res.render("users/register", { errors })
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash("error_msg", "An account with this email already exists in our system")
                    res.redirect("/users/register")
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash("error_msg", "There was an error saving the user")
                                res.redirect("/")
                            } else {
                                newUser.password = hash
                                newUser.save()
                                    .then(_ => {
                                        req.flash("success_msg", "User Created Successfully!")
                                        res.redirect("/")
                                    })
                                    .catch(err => {
                                        req.flash("error_msg", "An error occurred!")
                                        res.redirect("/users/register")
                                    })
                            }
                        })
                    })
                }
            })
            .catch(err => {
                req.flash("error_msg", "There was an internal error =(")
                res.redirect("/")
            })
    }
})

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout(err => {
        if(err) {
            req.flash("error_msg", "Error during logout!")
            res.redirect("/")
        } else {
            req.flash("success_msg", "Logout done successfuly!")
            res.redirect("/")
        }
    })
})

module.exports = router