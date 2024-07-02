const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        verificationCode: {
            type: Number,
            required: false,

        },
        verificationExpire: {
            type: Date,
            required: false
        }

    }
)

const User = mongoose.model("User", userSchema)

module.exports = User