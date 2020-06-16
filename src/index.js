const express = require('express')
const passport = require('passport')
require('./db/mongoose')
const app = express()


const userRouter =  require('./routers/user')
const todoRouter =  require('./routers/todo')
const facebookRouter = require('./routers/facebook')
app.use(express.json())

app.use(passport.initialize());
require('../config/passport')

app.use(userRouter)
app.use(todoRouter)
app.use(facebookRouter)


const PORT =process.env.PORT | 3000
app.listen(PORT,()=>{
    console.log('App is up and running on port',PORT);
})