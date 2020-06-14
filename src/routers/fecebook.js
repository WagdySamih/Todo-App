const express =  require("express");
const passport = require("passport");


const router = express.Router();

router.get("/user/facebook", passport.authenticate("facebook",{scope:['email']}));

router.get("/callback", passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/fail"
  })
);

router.get("/fail", (req, res) => {
  res.send({error:"Failed attempt"});
});

router.get("/", (req, res) => {
  res.send("Success");
});
module.exports = router;