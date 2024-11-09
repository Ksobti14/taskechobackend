const router=require('express').Router();
const User=require('../models/user')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
//Signin
router.post('/signin',async(req,res)=>{
    try{
    const {username}=req.body;
    const {email}=req.body;
    const existingUser=await User.findOne({username:username});
    const existingEmail=await User.findOne({email:email});
    if(existingUser){
        return res.status(400).json({message:"Username Already exists"})
    }
    else if(username.length<4){
        return res.status(400).json({message:"Username should have atleast 4 characters"})
    }
    if(existingEmail){
        return res.status(400).json({message:"Email Already exists"})
    }
    const hashpass=await bcrypt.hash(req.body.password,10);
    const newUser=new User({username:req.body.username,email:req.body.email,password:hashpass});
    await newUser.save();
    return res.status(200).json({message:'SignIn successfull'});
}
catch(error){
    console.log(error);
    res.status(500).json({message:"Internal Server Error"})
}
});
//Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Username or password is incorrect" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate token and respond
        const token = jwt.sign({ id: existingUser._id, username }, "kanav", { expiresIn: "2d" });
        return res.status(200).json({ id: existingUser._id, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;