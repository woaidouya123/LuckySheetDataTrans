const fs = require("fs");
const path = require("path");
const LuckyExcel = require('./lib/luckyexcel.cjs.js');
// const { postExcelData } = require('./lib/request.js');

const folderPath = "./excels" // 读取文件夹路径

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (path.extname(file) === '.xlsx') {
            console.log(`Reading file: ${file}`);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                  console.error('Error reading file:', err);
                  return;
                }
                // 解析xlsx内容
                LuckyExcel.transformExcelToLucky(data, function(exportJson, luckysheetfile){
                    // console.log(exportJson, luckysheetfile)
                    console.log(file, '解析成功')
                    // console.log(exportJson.sheets)

                    // 将解析的数据发送
                    // postExcelData({
                    //     file: file,
                    //     sheets: exportJson.sheets,
                    // }).then(res => {
                    //     console.log(res, "处理成功")
                    // })
                });
            });
        }
    })
});

