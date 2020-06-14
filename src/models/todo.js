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
    isCompleted:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Todo must have an owner'],
        ref:'User'
    }
},{
    timestamps: true
})
/// for search purposes
todoSchema.index({title:"text",body:"text"})

const Todo = mongoose.model('Todo',todoSchema)
module.exports  = Todo