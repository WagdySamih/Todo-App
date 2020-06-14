const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')
const Auth = require('../middleware/Auth')

const sendVerificationEmail = require('../verification/email')
const sendVerificationMessage= require('../verification/sms')

/**
 *   description    create new user
 *   route          POST /user/sign-up
 *   access         Public
 */
router.post('/user/sign-up' ,async(req, res)=>{
    try{
        const user = new User({...req.body})
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).json({user, token})
    } catch (error){
        res.status(500).json(error.message)
    }
})

/**
 *   description    login existing user
 *   route          POST /user/login
 *   access         Public
 */
router.post('/user/login' ,async(req, res)=>{
    try{
        const user = await User.findByCredntials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(200).json({user, token})
    } catch (error){
        res.status(500).json(error.message)
    }
})
/**
 *   description    getting user profile
 *   route          POST /user/me
 *   access         Private
 */
router.get('/user/me',Auth ,async(req, res)=>{
    res.json(req.user)
})


/**
 *   description    editing user profile
 *   route          PATCH /user/me
 *   access         Private
 */
router.patch('/user/me',Auth ,async(req, res)=>{
    
    /**
     *      validate user input fields is a valid update for a user
     *      contain  firstName lasttName userName age email  phoneNumber
     *      -- others shouldn't be updated by user
     */
    /// our valid update fields
    const ValidUpdates = ['firstName','lasttName','userName','age','email','phoneNumber']
    /// get the user update fields
    const updates = Object.keys(req.body)
    /// check if update fields inculeded in our array
    const isValidUpdate = updates.every((update) => ValidUpdates.includes(update))

    if (!isValidUpdate)
        return res.status(400).send({
            'error': 'It is Not A Valid Update!!'
        })


    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

/**
 *   description    logout from this device
 *   route          POST /user/logout
 *   access         Private
 */
router.post('/user/logout',Auth ,async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

/**
 *   description    logout from all devices
 *   route          POST /user/logout-all
 *   access         Private
 */
router.post('/user/logout-all',Auth ,async(req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})



/**
 *   description    send email to user email when he visit it his email become verified
 *   route          POST /user/email/verify
 *   access         Private
 */
router.post('/user/email/verify',Auth ,async(req, res)=>{
    try {
        sendVerificationEmail(req.user, req)
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

/**
 *   description    the link sent to user to verify his email
 *   route          POST /email/confirm/:verifyToken
 *   access         Public
 */
router.patch('/user/email/confirm/:verifyToken' ,async(req, res)=>{
    try{
        /// verify the token and get user with that id
        const decoded = jwt.verify(req.params.verifyToken, process.env.JWT_SECRET)
        const user = await User.findById (decoded._id)
        /// set verification email is true
        user.isEmailVerified = true
        user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
} )


/**
 *   description    send verification code to phone number
 *   route          POST /user/phonenumber/vertify
 *   access         Private
 */
router.post('/user/phonenumber/vertify',Auth ,async(req, res)=>{
    try{
        sendVerificationMessage(req.user)
        /// req.user.code is changed so we save new one!
        await req.user.save()
        res.send(req.user)
    }catch (error){
        res.send(error.message)
    } 
})


/**
 *   description    the mobile phone verification route
 *   route          PATCH /user/phonenumber/confirm/:code
 *   access         Private
 */
router.patch('/user/phonenumber/confirm/:code',Auth ,async(req, res)=>{
    try{

        /// compare user saved code with the given one
        if(req.params.code === req.user.code){
            req.user.isPhoneNumberVerified = true;
        }else{
            return res.status(400).send({error: 'wrong code'})
        }
        await req.user.save()
        res.send(req.user)
    }catch (error){
        res.send(error.message)
    } 
})


module.exports = router