const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const taskModel = require('./taskModel');
const schema = mongoose.Schema;
const userSchema = schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique:true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    age: {
        type: Number,
    },
    tokens: [{
        token :{
        type: String,
        required: true
        }
    }],
    avatar: {
        //type: Buffer
        type: String
    }
}, {
    timestamps: true
}
);

//virtual schema de virtual propery my b store x l db wla b change de bs 3l4an lw 3yza a3ml
//invers ll relation y3ni zy ma de prop 3nd l task yb2a feh hena t point ll task
userSchema.virtual('tasks', {//da asm l prop
    ref: 'Task',
    localField: '_id', //l byrbot benhom
    foreignField: 'createdBy' //l prop l maska l id da 3nd l task
});

//da method ll login
// userSchema.statics.login = async (email, password) => {
//     const user = await userSchema.findOne({email});
//     if(!user) {
//         throw new Error('unable to find user with this email');
//     } 
//     const isMathed = bcrypt.compare(user.password, password);
//     if (!isMathed) {
//         throw new Error('incorrect password');
//     }
//     return user;
// }

//ll token
userSchema.methods.generateToken = async function () {
    const user = this;
    const payload = {
        name: user.name,
        email: user.email,
        id: user._id.toString()
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1 day'}); 
    user.tokens = user.tokens.concat({token});
    await user.save();
    return 'Bearer '+token;
}

userSchema.methods.toJSON = function () {//toJson y3ni ay json b3taha hyt3ml 3leh l method de mn 8er call
    const user = this;
    const user2 = user.toObject();
    delete user2.password;
    delete user2.tokens;
    return user2
}

//de 3l4an a3ml middleware 2bl l save l hwa save w update
userSchema.pre('save', async function(nxt) { //lazem l fun tkon normal m4 arrow
    const user = this;
    if(user.isModified('password')) { //isModified de y3nii 3dlt l password
        user.password = await bcrypt.hash(user.password, 8);
    }
    nxt();
});
//de 3l4an lma delete user a delete kol l tasks btat3u
userSchema.pre('remove', async function(nxt) {
    const user = this;
    await taskModel.deleteMany({createdBy: user._id});
    nxt()
});

module.exports = mongoose.model('User', userSchema);