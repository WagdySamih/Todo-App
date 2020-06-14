const mongoose  = require("mongoose")

const todoSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'You Must Provide Todo title']   
    },
    body:{
        type: String,
        required: [true, 'You Must Provide Todo body']
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Todo must have an owner'],
        ref:'User'
    }
},{
    timestamps: true
})

const Todo = mongoose.model('Todo',todoSchema)
module.exports  = Todo