const Post = require("../models/post");
const expressJwt = require("express-jwt");

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})


exports.userCanEditPost = async (req, res, next) => {   
    try {
        const post = await Post.findById(req.params._id);
        if(req.user._id != post.postedBy){
            return res.status(400).json("Unauthorized Error")
        } else {
            next();
        }
    } catch(error){
        console.log(error)
    }
}