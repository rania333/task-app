const mongoose = require('mongoose');
/* start database & server */
mongoose.connect(process.env.DB, 
    { useUnifiedTopology: true , useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});
/* end database & server */