const express = require('express')
const dotenv = require('dotenv')
// const multipart = require('connect-multiparty')
const connectDb = require('./database/connectDb')
const cors = require('cors')
const path = require('path')

const app = express()
dotenv.config()

app.use(express.json())
// app.use(multipart())


app.use(express.static("./public"))
app.use(express.static(path.join(__dirname, "public")));

// cors config
const corsOptions = {
    origin: true,
    credentials: true,
    optionSucessStatus: 200
}
app.use(cors(corsOptions))

// DAtabase connection
connectDb()

const port = process.env.PORT;
app.get('/', (req, res) => res.send({ "message": 'Hello World!' }))

// Routers
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/customer', require('./routes/customerRoutes'))
app.use('/api/order', require('./routes/orderRoutes'))
app.use('/api/metrics', require('./routes/metricsRoutes'))


app.listen(port, () => console.log(`Sajilo Sales listening on port ${port}!`))