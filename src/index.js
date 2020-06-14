const express = require('express')
const passport = require('passport')
require('./db/mongoose')
const app = express()


const userRouter =  require('./routers/user')
const todoRouter =  require('./routers/todo')

app.use(express.json())


app.use(userRouter)
app.use(todoRouter)



const PORT =process.env.PORT | 3000
app.listen(PORT,()=>{
    console.log('App is up and running on port',PORT);
})