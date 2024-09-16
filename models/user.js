const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://user123:user123@cluster0.auo4i.mongodb.net/miniApp?retryWrites=true&w=majority&appName=Cluster0`)

const userSchema = mongoose.Schema({
    username:String,
    name: String,
    age:Number,
    email: String,
    password: String,
    profilepic:{
        type:String,
        default:"default.jpeg"
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
    ]
})

module.exports = mongoose.model('user',userSchema);