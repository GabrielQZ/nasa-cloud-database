const mediaRouter = require('./routes/media')
const userRouter = require('./routes/user')

const router = require('express').Router()

router.use("/media",mediaRouter)
router.use("/user",userRouter)

module.exports = router