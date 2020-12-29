require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT;
const app = express();
const apiRouter = require('./api/apiRouter');
const isEmpty = require('./utils/isEmpty');

app.use(express.json())

app.use("/api", apiRouter)

if (!isEmpty(process.env.APOD_API_KEY )) {
  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  })
}
