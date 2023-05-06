const express = require('express')
const Handlebars = require('handlebars')
const { engine } = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

const admin = require("./routes/admin")
const users = require("./routes/user")
const { conn } = require('./server')
const { default: mongoose } = require('mongoose')
const passport = require('passport')

require("./models/Posts")
require("./models/Category")
const Posts = mongoose.model("posts")
const Category = mongoose.model("categories")
require("./config/auth")(passport)

const app = express()
const port = 8084

// Conf
app.use(session({
    secret: "test",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
}) 

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars',
    engine({
        defaultLayout: 'main',
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
)

app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static(path.join(__dirname, "public")))




// Routes
app.get('/', (req, res) => {
    //console.log(Posts.find().populate("posts"))
    Posts.find().populate('category')
        .then(post => {
            res.render("index", { post: post })
            //console.log('===> ', post)
        })
        .catch(err => {
            req.flash("error_msg", "There was an error")
            res.redirect("/404")
        })
})

app.get("/posts/:slug", (req, res) => {
    Posts.findOne({ slug: req.params.slug })
        .then(post => {
            if(post) {
                res.render("post/index", { post: post })
            } else {
                req.flash("error_msg", "This post doesn't exist.")
                res.redirect("/")
            }
        })
        .catch(err => {
            console.error('An error occuried ==> ', err)
            req.flash("error_msg", "There was an intern error")
            res.redirect("/")
        })
})

app.get("/categories", (req, res) => {
    Category.find().then(category => {
        res.render("categories/", {category: category})
    }).catch(err => {
        req.flash("error_msg", "Internal error!")
        res.redirect("/")
    })
})

app.get("/categories/:slug", (req, res) => {
    Category.findOne({ slug: req.params.slug }).then(category => {
        try {
            Posts.find({category: category._id})
            .then(post => {
                res.render("categories/posts", {post, category})
            }).catch(err => {
                req.flash("error_msg", "There was an error to list posts")
                res.redirect("/")
            })
        } catch(e) {
            req.flash("error_msg", "This category doesn't exists")
            res.redirect("/")
        }
    }).catch(err => {
        req.flash("error_msg", "Error to find any category.")
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("Error 404!")
})

app.use('/admin', admin)

app.use("/users", users)

// Others
try {
    app.listen(port, _ => console.log('Successful'))
} catch(e) {
    console.log('Error ', e)
}
