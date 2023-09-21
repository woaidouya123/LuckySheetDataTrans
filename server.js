const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3003;
const LuckyExcel = require('./lib/luckyexcel.cjs.js');
app.use(express.json());

// 设置使用留痕接口时存储引擎和存储位置
const storagePath = "uploads/"; 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 指定文件保存的目录
        cb(null, storagePath); 
    },
    filename: function (req, file, cb) {
        // 自定义文件名（可选）
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer();
const uploadWithSave = multer({storage: storage});

// 创建文件上传的路由
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    LuckyExcel.transformExcelToLucky(req.file.buffer, function(exportJson, luckysheetfile){
        res.status(200).send(exportJson);
    }, function(err){
        console.error('process error:', err)
        return res.status(400).send('file process error.');
    });
});

app.post('/uploadWithSave', uploadWithSave.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.error('read error:', err)
            return res.status(400).send('file read error.');
        }
        LuckyExcel.transformExcelToLucky(data, function(exportJson, luckysheetfile){
            res.status(200).send(exportJson);
        }, function(err){
            console.error('process error:', err)
            return res.status(400).send('file process error.');
        });
    })
});

// app.post('/postExcelData', (req, res) => {
//     console.log(req.body);
//     res.status(200).send("success");
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});