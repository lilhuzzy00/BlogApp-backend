const { config } = require("dotenv");
const Post = require("../models/post");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

exports.createPost = async (req, res) => {
    // console.log("post =>", req.body);
    const {content, image} = req.body;
        if(!content.length){
            return res.json({
                error: "Please write something"
            })
        }
    try{
        const post = new Post({content, image, postedBy: req.user._id});
        post.save();
        res.json(post);
        
    } catch(error){
        console.log(error);
    };
};

exports.uploadImage = async (req, res) => {
    // console.log("req.files =>", req.files)
    try{
        const result = await cloudinary.uploader.upload(req.files.image.path);
        // console.log("uploaded image url =>", result);
        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch(error){
        console.log(error);
    }
}

exports.postByUser = async (req, res) => {
    try {
        // const posts = await Post.find({postedBy: req.user._id})
        const posts = await Post.find()
            .populate('postedBy', "_id name image")
            .sort({createdAt: -1})
            .limit(18) 
        res.json(posts);
    } catch(error){
        console.log(error)
    }
}

exports.userPost = async (req, res) => {
    try{
        const post = await Post.findById(req.params._id);
        res.json(post);
    } catch(error){
        console.log(error);
    }
}

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
            new: true
        });
        res.json(post);
    }catch(error){
        console.log(error);
    }
}


exports.deletePost = async (req, res) =>{
    try {
        const post = await Post.findByIdAndDelete(req.params._id);
        //remove image from cloudinary
        if(post.image && post.image.public_id){
            await cloudinary.uploader.destroy(post.image.public_id)
        }
        res.json({ok: true});
    } catch(error){
        console.log(error);
    }
}