const assert = require('assert')
const exrpess = require('express')
const router = exrpess.Router()

const Todo = require('../models/todo')
const User = require('../models/user')


const Auth = require('../middleware/Auth')


/**
 *   description    create new todo
 *   route          POST /todo/
 *   access         Private
 */
router.post('/todo', Auth, async (req, res) => {
    try {
        const todo = new Todo({
            ...req.body,
            /// logged in user is the owner
            owner: req.user._id
        })

        await todo.save()
        res.status(201).json(todo)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


/**
 *   description    get single todo by its id
 *   route          get /todo/:id
 *   access         Public
 */
router.get('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        if (!todo) {
            return res.status(404).send({
                error: 'Page Not Found'
            })
        }
        /// getting owner details
        await todo.populate({
            path: 'owner',
            select: ['email', 'phoneNumber', 'userName']
        }).execPopulate()
        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json(error.message)
    }
})



/**
 *   description    get all todos
 *   route          get /todo
 *   access         Public
 */
/** -------------
 *  ---QUERIES---
 *  -------------
 *      search
 *          /todo/search=anything
 *
 *      pagination
 *          /todo?skip=x&limit=y
 * 
 *      sorting
 *          /todo?sortBy=createdAt:asc  
 *          /todo?sortBy=createdAt:desc
 */
router.get('/todo', async (req, res) => {
    const options = {}
    const sortBy = {}
    const $text = {}
    try {
        /// if skip exists assign it to options
        //todo?skip=x&limit=y
        if (req.query.skip) {
            options.skip = parseInt(req.query.skip)
        }
        /// if limit exists assign it to options
        if (req.query.limit) {
            options.limit = parseInt(req.query.limit)
        }


        /// if sortBy exists assign it to sortBy
        /// todo?sortBy=createdAt:desc
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sortBy[parts[0]] = 'asc' === parts[1] ? 1 : -1
        }

        let todos
        /// if search exist excute with search field
        /// todo?search=task 1
        if (req.query.search) {
            $text.$search = req.query.search

            todos = await Todo.find({$text})
                .skip(options.skip)
                .limit(options.limit)

        } else {
            todos = await Todo.find({})
                .skip(options.skip)
                .limit(options.limit)
                .sort({
                    ...sortBy
                })
        }

        /// getting all owners details 
        for (let i = 0; i < todos.length; i++)
            await todos[i].populate({
                path: 'owner',
                select: ['email', 'phoneNumber', 'userName']
            }).execPopulate()
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

/**
 *   description    get all todos of single user
 *   route          patch /todo/user/:id
 *   access         Public
 */
router.get('/todo/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).send({error:'Page not found'})
        }
        todos = await Todo.find({owner:req.params.id })
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


/**
 *   description    edit a doto
 *   route          patch /todo
 *   access         Private
 */

router.patch('/todo/:id', Auth, async (req, res) => {

    /**
     *      validate user input fields is a valid update for a todo
     *      contain title & body
     *      -- user can not edit owner field
     */
    /// our valid update fields
    const ValidUpdates = ['title', 'body']
    /// get the user update fields
    const updates = Object.keys(req.body)
    /// check if update fields inculeded in our array
    const isValidUpdate = updates.every((update) => ValidUpdates.includes(update))

    if (!isValidUpdate)
        return res.status(400).send({
            'error': 'It is Not A Valid Update!!'
        })


    try {
        const todo = await Todo.findById(req.params.id)
        if (!todo) {
            return res.status(404).send({ error: 'Page Not Found' })
        }
        console.log(todo.owner)
        console.log(req.user._id)

        /// owner can edit only his todos
        if (assert.ok(todo.owner .equals(req.user._id ))) {
            return res.status(403).send({error: 'user can not edit others todos'})
        }

        /// update todo
        updates.forEach((update) => todo[update] = req.body[update])
        await todo.save()

        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


/**
 *   description    delete a doto
 *   route          patch /todo/:id
 *   access         Private
 */
router.delete('/todo/:id', Auth, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndRemove(req.params.id)
        if (!todo) {
            return res.status(404).send({
                error: 'Page Not Found'
            })
        }
        console.log(todo.owner)
        console.log(req.user._id)
        /// owner can delete only his todos
        if (assert.ok(todo.owner .equals(req.user._id ))) {
            return res.status(403).send({  error: 'user can not delete others todos'})
        }

        res.status(200).json({})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router