const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
module.exports = async (req, res, nxt) => {
    const authHeader = req.get('Authorization'); //get de btgeb value l auth header
    if(!authHeader) {
        const err = new Error('Not authenticated');
        err.statusCode = 401;
        throw err;
    }
    const token = authHeader.split(' ')[1]; 
    let decodedToken, user;
    try {
        //verify bt decode w verify l token lkn decoder b decode bs
        decodedToken = await jwt.verify(token, process.env.JWT_SECRET); //nfs l secret key l x l login function
        if (!decodedToken) {
            const err = new Error('Not authenticated');
            err.statusCode = 401;
            throw err;
            }
        user = await userModel.findOne({_id: decodedToken.id, 'tokens.token': token});
        if (!user) {
            return res.status(401).send('Not authenticated');
        }
        
        req.token = token; //ll logout
        req.user = user;
        req.userId = decodedToken.id;
        nxt();

    } catch(err) {
        err.statusCode = 500;
        throw err;
    }
};


// const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');
// const auth = async (req, res, nxt) => {
//     const headerToken = req.header('Authorization'); //get header value
//     if (!headerToken) {
//         return res.status(401).send('No token is provided');
//     } 
//     const token = headerToken.replace('Bearer ', ''); //remove klmt Bearer
//     let decodedToken;
//     try{ 
//         console.log(token);
//         decodedToken = jwt.verify(token, '123456');
//         console.log("hhhhh")
//         const user = await userModel.findById(decodedToken.userId);
//         if (!user) {
//             return res.status(404).send('user is not found');
//         }
//         //store l token x l req
//         req.user = user;
//         nxt();
//     } catch (e) {
//         return res.status(401).send("you're not authorized");
//     }
// }

// module.exports = auth;