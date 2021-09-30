/* monoose 모듈 불러들이기 */
const mongoose = require('mongoose');
/* passwork 암호화 모듈 */
const bcrypt = require('bcrypt');



const infoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    }
},

    {
        timestamps: true,
    }
);

/* passwork 암호화 */
infoSchema.pre('save', function(next) {
    const user = this;
    const saltFactor = 10;
    bcrypt.genSalt(saltFactor, (err, salt) => { // Salt 생성
      if (err) return next(err);
   
      bcrypt.hash(user.password, salt, (err, hash) => {  // Hash생성
        if (err) return next(err);
        user.password = hash;  // Hash값 pwd에 저장
        next();
        // user.password: 사용자가 입력한 비밀번호
        // hash 암호화된 비밀번호
      });
    });
});


module.exports = mongoose.model('schema', infoSchema);