const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
const nodemailer = require('nodemailer');

//npm i multer
const multer = require('multer');
const path = require('path');
//npm i morgan
const logger = require('morgan');
const fs = require('fs');
const ejs = require('ejs');


const app = express();
const router = express.Router();

app.set('views', __dirname + '/views');
app.set('view engine' , 'ejs');

const port =3000;

// app.use('/public' , static(path.join(__dirname ,'public')));
app.use(static(path.join(__dirname , 'public')))
app.use(static(path.join(__dirname , 'uploads')))
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'))


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },

    filename:(req,file, callback) => {
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        callback(null, basename + "_" + Date.now() + extension);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        files: 1,
        fileSize: 1024 * 1024 * 100
    }
})


router.route('/mail').post(upload.array('photo' , 1), (req, res) => {
    try{
        const files = req.files;
        console.dir(req.files[0]);

        var originalname = "";
        var filename = "";
        var mimetype = "";
        var size = 0;

        if(Array.isArray(files)){
            console.log(`클라이언트에서 받아온 파일 개수 : ${files.length}`);
            for(let i=0; i < files.length; i++){
                originalname = files[i].originalname;
                filename = files[i].filename;
                mimetype = files[i].mimetype;
                size = files[i].size;
            }
        }

        
        fs.readFile( 'uploads/' + filename, (err, data) => {
            const sendid = req.body.sendid;
            const sendmail = req.body.sendmail;
            const tomail = req.body.tomail;
            const toname = req.body.toname;
            const title = req.body.title;
            const content = req.body.content;
            const photoOutput = req.body.photoOutput

            const fmtfrom = `${sendid}<${sendmail}`;
            const fmtto = `${tomail}<${tomail}`;

            const transpoter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'rnrgus5897@gmail.com',
                    pass: 'dkswoah589318',
                },
                host: 'smtp.mail.com',
                port: '465'
            });

            const mailOption = {
                from: fmtfrom,
                to: fmtto,
                subject: title,
                html: content,
                attachments: [{'filename':filename, 'content': data}]
            }

            transpoter.sendMail(mailOption , (err, infor) => {
                if(err){
                    console.log(err)
                }else{
                    console.log(infor);
                }
            })
            transpoter.close();


        })
        const createDate = req.body.createDate;   
        const sendid = req.body.sendid;
        const sendmail = req.body.sendmail;
        const tomail = req.body.tomail;
        const toname = req.body.toname;
        const title = req.body.title;
        const content = req.body.content;
        const photoOutput = req.body.photoOutput;
     
        const userinfo = {createDate : createDate, sendid : sendid , sendmail : sendmail, tomail : tomail , toname : toname , title : title , content : content, filename : filename}
        fs.readFile('views/mail.ejs' , 'utf-8' , (err, data) => {
            if(err){
                console.log(err);
            }else{
                res.writeHead(200 , {'Content-Type' : 'text/html'});
                res.end(ejs.render(data , userinfo))
            }
        })





       
    }catch(e){
        console.log(e);
        console.log('값이 post로 안넘어오는중')
    }
})



app.use('/' , router)

app.listen(port , () => {
    console.log(`${port}포트 포트로 이동중`);
})