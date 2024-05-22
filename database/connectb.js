const mongoose = require('mongoose')

const connectDb = () => {
    mongoose.connect(process.env.MONGODB)
}

module.exports = connectDb