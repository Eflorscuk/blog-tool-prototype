const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const conn = mongoose.connect("mongodb://localhost/blogapp").then(_ => {
    console.log("Mongodb connected")
}).catch(e => { console.log("===> ", e)})

exports.conn = conn
