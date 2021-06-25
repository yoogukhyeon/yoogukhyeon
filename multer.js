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

router.route('/write').post(upload.array('photo', 1), (req, res) => {
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

        const title = req.body.title;

        res.writeHead('200' , {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>이미지업로드 성공</h2>')
        res.write('<hr/>');
        res.write(`<h2>${title}</h2>`);
        res.write(`<p>원본파일명 : ${originalname} </p>`);
        res.write(`<p>현재파일명 : ${filename} </p>`);
        res.write(`<p>MimeType : ${mimetype} </p>`);
        res.write(`<p>파일크기 : ${size} <br /></p>`);
        res.write(`<p> <img src='/${filename}' width=250> </p>`);
        res.end()
    }catch(e){
       console.log(e)

    }
});


app.use('/' , router)

app.listen(port, () => {
    console.log(`${port}포트 포트로 이동중......`)
})