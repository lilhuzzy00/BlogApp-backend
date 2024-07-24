const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    content: {
        type: {},
        require: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    image: {
        url: String,
        public_id: String
    },
    like: [
        {
        type: ObjectId,
        ref: "User"
        }
    ],
    comments: [
        {
            text: String,
            created: {
                type: Date, 
                default: Date.now
            },
            postedBy: {
                type: ObjectId,
                ref: "User"
            } 

        }
    ]
},
{timestamps: true}
);

module.exports = mongoose.model("Post", postSchema);