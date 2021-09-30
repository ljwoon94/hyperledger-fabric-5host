const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const multer = require('multer');
var network = require("./fabric/network.js");
const registerUser = require('../registerUser');
// 사용자 정보 불러오기
const fs = require("fs");
const path = require("path");



// const configPath = path.join(process.cwd(), "/config.json");
// const configJSON = fs.readFileSync(configPath, "utf8");
// const config = JSON.parse(configJSON);
// var userName = config.userName;
// var usr = JSON.stringify(userName);

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

/* jwt json web token*/
const jwt = require("jsonwebtoken");

/* ----------- DB ----------- */
const mongoose = require("mongoose");

// Schema
const InfoSchema = require("./schema");

// db에 연결
mongoose.set("useFindAndModify", false);

// 데이터베이스 연결 정보
const uri = "mongodb://localhost:27017/user";

// 연결
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB에 연결되었습니다.");
  }
);

/* passwork 암호화 모듈 */
const bcrypt = require("bcrypt");
/* ---------------------- */

// multer 파일 업로드 경로
const DIR = './public/';

//multer 웹서버에 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


// 회원가입
app.post("/signUp", (req, res) => {
  // 객체생성
  const newData = new InfoSchema({
    id: req.body.id,
    password: req.body.password,
    company: req.body.company,
    name: req.body.name,
    author: "user", // Default: user / admin은 직접 DB로 수정
  });
  try {
    // DB에 저장되어 있는 id 값을 확인
    InfoSchema.findOne({ id: req.body.id }, (err, user) => {
      // id 값이 중복체크 후 존재하면 회원가입 X
      if (user) {
        res.status(200).send({
          result: "exist",
        });
        console.log("===== 존재하는 ID =====");
        // id 중복체크 후 중복이 없으면 회원가입 o
      } else {
        // newData.author가 user이면 collection count만큼 numbering
        if (newData.author == "user") {
          InfoSchema.countDocuments({}, function (err, count) {
            console.log(count);
            var userCount = count;
            newData.author = ("user" + userCount).toString();
            console.log(userCount);
            newData.save((error, response) => {
              registerUser.registerUser(newData.name);
              if (error) {
                console.log(error)
              }
              else {
                console.log("succesfull inserted : ", response)
              }
            })
          });
        }
        // registerUser 실행

        console.log("===== 저장 성공 =====");
        res.status(200).send({
          result: "done",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// 로그인
app.post("/login", (req, res) => {
  // 전송되는 데이터
  const payload = {
    id: req.body.id,
    password: req.body.password,
  };

  // private, public Key
  const privateKEY = fs.readFileSync(path.join(__dirname, "private.key"));
  const publicKEY = fs.readFileSync(path.join(__dirname, "public.key"));
  /* 
      issuer — 토큰 발급
      subject — 의도된 토큰 사용자
      audience — 토큰 수령인의 신원
      expiresIn — 토큰 만료 시간
      algorithm — 토큰을 보호하는데 사용할 암호화 알고리즘
  */
  const aud = " http://mysoftcorp.in"; // 청중
  const iss = "Mysoft corp"; // 발행자
  const sub = " some@user.com "; // 제목

  var signOptions = {
    issuer: iss,
    subject: sub,
    audience: aud,
    expiresIn: "12h",
    algorithm: "HS256",
  };

  // OUTPUT — 토큰 3 개 부분 (헤더, 페이로드 및 서명)
  const token = jwt.sign(payload, privateKEY, signOptions);
  // DecodeToken
  const decodeToken = jwt.decode(token, { complete: true });

  try {
    // DB에 저장되어 있는 id 값을 확인
    InfoSchema.findOne({ id: req.body.id }, (err, user) => {
      // 비밀번호 해시값과 비교
      // const hashPassword = bcrypt.compareSync(req.body.password, user.password);
      // if (hashPassword == true) {
      if (user) {
        res.status(200).json({
          result: "login_done",
          token,
          user,
        });
        exports.user_auth = function () {
          return user.author;
        };
        // }
      } else {
        console.log("로그인 실패");
        res.status(200).send({
          result: "login_fail",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// 이미지 업로드
app.post('/create-user', upload.array('avatar', 6), (req, res, next) => {
  const reqFiles = []
  const url = req.protocol + '://' + req.get('host')
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + '/public/' + req.files[i].filename)
  }

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    avatar: reqFiles
  });
  user.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Done upload!",
      userCreated: {
        _id: result._id,
        avatar: result.avatar
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})


// 작성자, 받은자 기준으로 목록조회
app.post('/queryAllCars', (req, res) => {
  const userName = req.body.userName;
  console.log(userName);
  network.queryContractList(userName)
    .then((response) => {      
        res.send(response);
    });
})

// 계약서 상세조회
app.post('/querySelectCar', (req, res)=> {
    network.selectContract(req.body.key, req.body.userName)
      .then((response) => {
        res.send(response)
      })
});
// 계약서 생성
app.post('/createCar', (req, res) => { 
  console.log(req.body);
  // 계약서 전체 갯수 불러오기
  
  network.totalNumberContracts(req.body.userName)
    .then((response) => {
      var carsRecord = JSON.parse(response);
      var numCars = String(carsRecord.length + 1);
      // 자리수 만큼 남는 공간 0으로 채우기
      var newKey = numCars.padStart(8,'0');       
      console.log("newkey >>>>>>>>>>>",newKey)
      // 계약상태
      var newState = '계약 대기'
      network.createContract(newKey, req.body.contract_name, req.body.contract_contents, req.body.contract_companyA, req.body.contract_companyB, req.body.contract_date, req.body.contract_period, newState, req.body.userName)
      .then((response) => {
        res.send(response)
      })
    })  
})
// 계약서 수정
app.post('/changeCarOwner', (req, res) => {
      network.modifyContract(req.body.key, req.body.new_contract_name, req.body.new_contract_contents, req.body.new_contract_companyB, req.body.new_contract_receiver, req.body.new_contract_date, req.body.new_contract_period, req.body.userName)
          .then((response) => {
            res.send(response)
      })
})
app.post('/sendContract', (req, res) => {
  const changeState = '계약 중';
  console.log(req.body);
  network.sendContract(req.body.key, req.body.contract_signA, req.body.contract_receiver, changeState, req.body.userName)
      .then((response) => {
        res.send(response)
  })
})
app.post('/makeContract', (req, res) => {
  const changeState = '계약 완료';
  console.log(req.body);
  network.signedContract(req.body.key, req.body.contract_signB, changeState, req.body.userName)
      .then((response) => {
        res.send(response)
  })
})
 
app.listen(process.env.PORT || 8081);
