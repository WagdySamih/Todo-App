const express = require("express")
const passport = require("passport")

const router = express.Router()

const User = require('../models/user')

/**
 *   description    login via facebook route
 *   route          user/facebook
 *   access         Public
 */
router.get("/user/facebook", passport.authenticate("facebook"));

router.get("/user/facebook/callback", passport.authenticate("facebook", {
    failureRedirect: "/user/facebook/fail"
}), async (req, res) => {
    try{
        
         //  if log in succeed register new user!
        let user = await User.findOne({
            email: req.user.email
        })
        if (!user) {
            user = new User({
                email: req.user.email,
                /// it must be provided :((
                password: req.user.id,
                userName: req.user.name,
                firstName: req.user.first_name,
                lastName: req.user.last_name,
                phoneNumber: ""
            })
            await user.save()
        }
        /// generate authantication token and send it to user
        const token = await user.generateAuthToken()
        res.json({ user, token})
    } catch (error){
        Res.status(500).send(error.message)
    }
});
/**
 *   description    login via facebook failure route
 *   route          user/facebook/fail
 *   access         Public
 */
router.get("/fail", (req, res) => {
    res.send({
        error: "Failed attempt"
    });
});


module.exports = router;