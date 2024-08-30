const User = require("../models/user");
const {hashPassword, comparePassword} = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const {nanoid} = require("nanoid");


exports.register =  async(req, res) =>{
    // console.log(req.body);
    const {name, email, password, secret} = req.body;
    if(!name){
        return res.json({
            error: "Name is required"
        })
    }
    if(!password || password.length < 6){
        return res.json({
            error: "Password is required and should not be less than 6 characters"
        })
    };
    if(!secret){
       return res.json({
        error: "You must input an answer"
       })
    }
    const exist = await User.findOne({email});
    if(exist) {
        return res.json({
            error: "Email found in our database."
        })
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({
                            name, 
                            email, 
                            password: hashedPassword, 
                            secret,
                            username: nanoid()
                        });
    try {
        await user.save();
        console.log(user);
        return res.json({
            ok: true
        })
    } catch(error){
        console.log(error);
        return res.json({
            error: "Try again!!"
        })
    }
};

exports.login = async(req, res) =>{
    // console.log(req.body);
    try{
        //Check if the user with the email exist in the database
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "User with this email does not exist"
            })
        }

        //check password
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.json({
                error: "wrong password"
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        user.password = undefined;
        user.secret = undefined;
        res.json({
                token,
                user
        })

    }catch(error){
        console.log(error);
        return res.json({
            error: "There was an error. Please try again"
        })
    }
}

exports.currentUser = async (req, res) =>{
    // console.log(req.user);
    try {
        const user = await User.findById(req.user._id);
        // res.json(user);
        res.json({ok: true})
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
};

exports.forgotPassword = async (req, res) =>{
    console.log(req.body);
    const {email, newPassword, secret} = req.body;
    //validation
    if(!newPassword || !newPassword < 6){
        return res.json({
            error: "You need a new password and should not be less than 6 characters"
        })
    }
    if(!secret){
        res.json({
            error: "Please select a secret question"
        })
    }

    const user = await User.findOne({email, secret});
    if(!user){
        return res.json({
            error: "We can verify you with those details"
        })
    }

    try{
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, {password: hashed});
        return res.json({
            success: "Password updated successfully"
        })
    } catch (error){
        console.log(error);
        return res.json({
            error: "something went wrong. Please retry!!"
        })
    }
}

exports.profileUpdate = async(req, res) =>{
    try {
        // console.log(req.body);
        const data = {};
        if(req.body.username){
            data.username = req.body.username
        }
        if(req.body.about){
            data.about = req.body.about
        }
        if(req.body.name){
            data.name = req.body.name
        }
        if(req.body.password){
            if(req.body.password.length < 6){
                return res.json({
                    error: "Password should be at least 6 characters long"
                })
            } else {
                data.password = await hashPassword(req.body.password);
            }
        }
        if(req.body.secret){
            data.secret = req.body.secret
        }
        if(req.body.image){
            data.image = req.body.image
        }
        let user = await User.findByIdAndUpdate(req.user._id, data, {new: true});
        user.password = undefined;
        user.secret = undefined;
        res.json(user);
    }catch(error){
        if(error.code == 11000){
            return res.json({error: "duplicate user"})
        }
        console.log(error);
    }
}