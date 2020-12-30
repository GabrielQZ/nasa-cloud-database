require('dotenv').config();


const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 80;

//for development the origin will be http://localhost:3000
const clientOrigin = process.env.CLIENT_ORIGIN; 

const app = express();
const apiRouter = require('./api/apiRouter');
const isEmpty = require('./utils/isEmpty');

app.use(express.json())

if (clientOrigin) {
  app.use(cors({origin: clientOrigin,}))
}

if( process.env.NODE_ENV == "development") {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

app.use("/api", apiRouter)

if (!isEmpty(process.env.APOD_API_KEY )) {
  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  })
}
