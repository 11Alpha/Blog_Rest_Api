const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async(req,res)=>{
    try{

        // TO HIDE PASSWORD 
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        if (!user) {
            // Send a response for "Wrong Credentials"
            res.status(400).json("Wrong Credentials");
        }
        else {
            const validated = await bcrypt.compare(req.body.password, user.password);
            const {password, ...others} = user._doc;  //To not show Password while getting user info.

            if (!validated) {
              // Send a response for "Wrong Credentials"
              res.status(400).json("Wrong Credentials");
            }
            else {
              // Send a response with the user object for a successful login
              res.status(200).json(others);
            }
        }  
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;