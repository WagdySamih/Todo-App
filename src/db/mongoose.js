const mongoose = require('mongoose')

const connectionURL ='mongodb://127.0.0.1:27017/todo-App'
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log('Connected To Database')
}).catch(()=>{
    console.log('Fialed to connect to database')
})