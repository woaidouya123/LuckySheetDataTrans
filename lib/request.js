const axios = require("axios")

function postExcelData(data){
    return axios.post("http://localhost:3003/postExcelData", data)
}
module.exports = {
    postExcelData,
}