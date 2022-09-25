const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tinderUserSchema = new Schema({
    
    username: {
        type: String,
        required: true
    },
    userpass: {
        type: String,
        required: true
    },
    usercity: {
        type: String,
        required: true
    },
    usergender: {
        type: String,
        required: true
    },
    userage: {
        type: Number,
        required: true
    },
    userphotos: {
        type: Array,
        required: false,
        default: []
    },
    userlikes: {
        type: Array,
        required: false,
        default: []
    },
    userlikedby: {
        type: Array,
        required: false,
        default: []
    },
    userfilter: {
        type: Object,
        required: false,
        default: {city: "", gender: "", age: null}
    }

})

const User = mongoose.model("User", tinderUserSchema)

module.exports = User