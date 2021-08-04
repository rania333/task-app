const multer = require('multer');

/*const upload = multer({
    //dest: 'src/uploads/images' ,//bybd2 l path mn awel l project
    limits: {
        fileSize: 1000000 //1 million y3ni 1mb
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload images only'))
        }
        cb(undefined, true); //y3ni a2bl l file
    },
    
});*/
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        (cb(null, `src/avatar`)); //null y3ni no errors and uploads the name of folder which store in it
    },
    filename: (req, file, cb) => {
        cb(null,new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
    }
});

const upload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1000000 //1 million y3ni 1mb
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload images only'))
        }
        cb(undefined, true); //y3ni a2bl l file
    },
});
// const fileFilter = async (req, file, cb) => {
//     if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//         cb(null, true); //y3nii accept l file da
//     } else {
//         cb(null, false);
//     }
// }

module.exports = upload;