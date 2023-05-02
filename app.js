const express = require('express')
const Handlebars = require('handlebars')
const { engine } = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser')
const path = require('path')

const admin = require("./routes/admin")
const { conn } = require('./server')

const app = express()
const port = 8084

// Conf
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
app.use('/admin', admin)
// Others

try {
    app.listen(port, _ => console.log('Successful'))
} catch(e) {
    console.log('Error ', e)
}
