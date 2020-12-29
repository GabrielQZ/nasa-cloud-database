const {default: axios} = require('axios');
const isEmpty = require('../../utils/isEmpty');
const router = require('express').Router()

router.get("/bydate", async (req, res) => {
  try {

    const {year, month, day} = req.body;

    if (isEmpty(year) || isEmpty(month) || isEmpty(day) )
      res.status(400).json({error: "Date info not complete"})

    //check if date is valid
    let endpoint = 'https://api.nasa.gov/planetary/apod?'
    endpoint += 'api_key=' + process.env.APOD_API_KEY
    endpoint += '&date=' + year + "-" + month + "-" + day;

    axios.get(endpoint)
    .then(response => {
      res.json({data: response.data})
    })
    .catch(err => {
      res.status(500).json({error: err.message})
    })
    
  } catch (err) {
    res.status(500).json({error: err.message})
  }
})


module.exports = router