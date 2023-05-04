const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Category = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const firstCategory = { name: 'JavaScript', slug: 'javascript'}


const categoryExport = mongoose.model("categories", Category)

//categoryExport.create(firstCategory).then(_ => console.log('Category created successfully'))