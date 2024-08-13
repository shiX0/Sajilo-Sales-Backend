const mongoose = require('mongoose')

const connectDb = () => mongoose.connect(process.env.MONGODB).then(() => {
    console.log("Database connected sucessfully")

})

module.exports = connectDb;
