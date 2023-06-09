const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/User")
const User = mongoose.model("users")

module.exports = function(passport) {
    passport.use(new localStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({ email: email })
            .then(user => {
                if(!user) {
                    return done(null, false, { message: "This count doesn't exist"})
                }

                bcrypt.compare(password, user.password, (error, same) => {
                    if(same) {
                        return done(null, user)
                    } else {
                        console.error('error ', error)
                        return done(null, false, { message: "Incorrect Password"})
                    }
                })
            })
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
          .then(user => {
            done(null, user)
          })
          .catch(err => {
            done(err)
          })
      })
}