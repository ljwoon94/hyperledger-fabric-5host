/* monoose 모듈 불러들이기 */
const mongoose = require('mongoose');



// contract_info
const fileInfoSchema = new mongoose.Schema({
    originalFileName: String,
    filePath: String,
    fileSize: String,
    file: Buffer,
    Key: String
},

    {
        timestamps: true,
    }
);



module.exports = mongoose.model('uploadSchemas', fileInfoSchema);
