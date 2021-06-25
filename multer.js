const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');

//npm i multer
const multer = require('multer');
const path = require('path');
//npm i morgan
const logger = require('morgan');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'))



router.route('/write' , (req , res) => {
    try{

    }catch{
        
    }
})




app.use('/' , router)
const port =3000;





app.listen(port, () => {
    console.log(`${port}포트 포트로 이동중......`)
})

