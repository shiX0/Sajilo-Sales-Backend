const express = require('express')
const dotenv = require('dotenv')
const multipart = require('connect-multiparty')
const connectDb = require('./database/connectDb')
const cors = require('cors')

const app = express()
dotenv.config()

app.use(express.json())
app.use(multipart())

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
app.get('/', (req, res) => res.send('Hello World!'))

// Routers
app.use('/api/user', require('./routes/userRoutes'))


app.listen(port, () => console.log(`Sajilo Sales listening on port ${port}!`))