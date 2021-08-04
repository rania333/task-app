const bcrypt = require('bcrypt');
const sharp = require('sharp');
const userModel = require('../models/userModel');
const sendEmail = require('../emails/account');
const domain = process.env.HOST;
exports.createUser = async (req, res) => {
    try {
        //const user = new userModel(req.body);
        const {name, email, password, age} = req.body;
        const user = new userModel({
            name,
            email,
            password,
            age,
            avatar: domain+ 'defaultPhoto.png'
        });
        await user.save();
        //send email
        sendEmail(user.email, 'Thanks for joining in', 
        `welcome ${user.name}.
        let us know how you get along with the app`);
        return res.status(201).send(user);
    } catch(e) {
        return res.status(500).send(e);
    }
}
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(401).send('unable to find user with this email');
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) {
            return res.status(400).send('incorrect password');
        }
        const token = await user.generateToken();
        res.status(200).send({user, token});
    } catch(e) {
        res.status(500).send(e);
    }
}
exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token, index) => {
            return token.token !== req.token
        });
        await req.user.save();
        return res.status(200).send('logged out');
    } catch(e) {
        return res.status(500).send();
    }
}
exports.logoutAll = async (req, res) => {
    try{
        req.user.tokens = []; //delete all tokens
        await req.user.save();
        res.status(200).send('logged out from all devices successfully');

    }catch(e) {
        res.status(500).send(e);
    }
}
exports.findAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.status(200).send(users);
    } catch (e) {
        return res.status(500).send(e);
    }
}
exports.myProfile = async (req, res) => {
    const user = await userModel.findById(req.userId, {password: 0, tokens: 0});
    if (!user) {
        return res.status(401).send('user not exist');
    }
    res.status(200).send(user);
}
exports.findOneUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send();
        } 
        return res.status(200).send(user); 
    } catch(e) {
        return res.status(500).send(e);
    }
}
exports.updateUser = async (req, res) => {
    //to check that body element are what in model
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every(el => {
        return allowedUpdates.includes(el);
    })
    if(!isValid) {
        return res.status(400).send({err: 'invalid updates'});
    }
    try {
        //const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        //const user = await userModel.findById(req.params.id);
        //de l update
        updates.forEach(update => {
            return req.user[update] = req.body[update];
        });
        await req.user.save();
        // if (!user) {
        //     return res.status(404).send();
        // }
        res.status(200).send(req.user);
    } catch(e) {
        return res.status(500).send(e);
    }
}
exports.deleteUser = async (req, res) => {
    try {
        // const user = await userModel.findByIdAndDelete(req.params.id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove(); //remove document
        sendEmail(req.user.email, 'Sorry to see you go!', 
        `Goodbye ${req.user.name}, I hope to see you back sometime soon.`);
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
}
exports.addAvatar = async (req, res) => {
    try {
        let pic; 
        //handle l pic
        if (req.file == undefined) {
            pic = domain + 'defaultPhoto.png';
        } else {
            pic = domain + req.file.filename;
        }
        const reformattedPic = await sharp(pic).resize({ //reformat l pic
            height: 250,
            width: 250,
        }).png();
        req.user.avatar = reformattedPic.options.input.file;
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(500).send('an error occured');
    }
}
exports.deleteAvatar = async (req, res) => {
    try { 
        req.user.avatar = domain + 'defaultPhoto.png';
        await req.user.save();
        res.send(req.user.avatar);
    } catch(e) {
        res.status(500).send('an error occured');
    }
}
exports.getAvatar = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user || !user.avatar) {
            return res.status(404).send('avatar not found');
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e) {
        res.status(500).send('an error occured');
    }
}

