const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

var network = require("./fabric/network.js");
const registerUser = require('../registerUser');
// 사용자 정보 불러오기
const fs = require("fs");
const path = require("path");

// 파일 업로드 multer
const multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)


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
const InfoSchema = require("./schemas/schema");
const fileInfoSchema = require('./schemas/uploadSchema');

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


// // pdf 파일 업로드
// /* 파일의 이름을 관리하기 위해 multer의 diskStorage 함수로 
//     디렉터리와 파일명에 대한 객체를 생성해서, 
//     업로드 객체를 생성할때 storage 멤버로 전달하면 된다.*/
// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, "uploads/") // 파일 업로드 경로
//   },
//   filename(req, file, callback) {
//     callback(null, file.originalname) // 전송자가 보낸 원래 이름으로 저장
//   }
// });

// // 파일 업로드 경로와 파일 용량 제한 설정
// const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1000 * 16 } });

// 업로드 요청 처리
// app.post('/upload', upload.single('file'), async (req, res) => {
//   console.log(req.file);
//   const originalFileName = req.file.originalname // 원본 파일명
//   const savePath = req.file.path // 파일 경로
//   const fileSize = req.file.size // 파일 사이즈

//   network.totalNumberContracts("admin")
//     .then((response) => {
//       const carsRecord = JSON.parse(response);
//       const numCars = String(carsRecord.length + 1);
//       // 자리수 만큼 남는 공간 0으로 채우기
//       const newKey = numCars.padStart(8, '0');

//       // 파일시스템에서 파일 열기
//       fs.open(savePath, "r", function (err, fd) {
//         // binary 데이터를 저장하기 위해 파일 사이즈 만큼의 크기를 갖는 Buffer 객체 생성
//         const buffer = Buffer.alloc(fileSize);
//         fs.read(fd, buffer, 0, buffer.length, null, function (err, bytes, buffer) {
//           const obj = {
//             "originalFileName": originalFileName,
//             "filePath": savePath,
//             "fileSize": fileSize,
//             "file": buffer,
//             "Key": newKey
//           };

//           const newData = new fileInfoSchema(obj);
//           newData.save(function (err) { // 저장
//             if (err) {
//               res.send(err);
//             } // db에 모든 작업이 올라간 후에 uploads에 있는 파일이 지워진다.
//             // fs.unlink(savePath, function () { }) // 파일 삭제
//             console.log("----- uploads에 있는 파일 삭제 완료 -----");
//           });
//           console.log(`유저네임-----------------<` + req.body.userName);
//           network.uploadContract(newKey, obj.originalFileName, (obj.file).toString('utf8'), req.body.userName)
//             .then((response) => {
//               res.send(response)
//             })
//         })
//       })
//     })
// });



// // pdf 파일 다운로드 mongodb 버전
// app.get('/download/:fileName', async (req, res) => {
//   const base64 = require('base64topdf');
//   //  id를 사용해 데이터를 찾음
//    const key = req.params.fileName
//   //  const getFileCriteria = {
//   //   key: ObjectId(key)
//   //  }

//    console.log('[[[ getFileCriteria ]]]', key)

//    const fileInfo = await fileInfoSchema.findOne({Key : key});

//    if(!fileInfo) {
//      res.status(500).send({
//        message: 'DB Error'
//      });
//    }

//   console.log(fileInfo.file.buffer);

//   // pdf encoding
//   base64EncodedText = Buffer.from(fileInfo.file.buffer, "utf8").toString('base64');

//   // pdf decoding
//   base64.base64Decode(base64EncodedText, __dirname +'/../downloads/'+'다운로드할파일.pdf');
//   let file = __dirname +'/../downloads/'+'다운로드할파일.pdf'

//   res.download(file)

// });

// pdf 파일 다운로드 블록체인 버전
app.get('/download/:fileName', async (req, res) => {
  const base64 = require('base64topdf');
  //  id를 사용해 데이터를 찾음
   const key = req.params.fileName
  //  const getFileCriteria = {
  //   key: ObjectId(key)
  //  }
  console.log('')
  console.log('--------------------------------------------')
  console.log(key)
  console.log('--------------------------------------------')
  console.log('')
  network.selectContract(key, 'admin')
    .then((response) => {
    // 인코딩 된 계약서 불러오기
    console.log('')
    console.log('--------------------------------------------')
    // 블록체인에서 온 데이터 json화
    let responseJSON = JSON.parse(response);
    console.log('--------------------------------------------')
    console.log('')
    const base64EncodedText = responseJSON.contract_contract_buffer;
    //console.log(base64EncodedText);
    // pdf decoding
    base64.base64Decode(base64EncodedText, __dirname +'/../downloads/'+'다운로드할파일.pdf');
    let file = __dirname +'/../downloads/'+'다운로드할파일.pdf'
    
    res.download(file)
  })
  

});



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
app.post('/querySelectCar', (req, res) => {
  network.selectContract(req.body.key, req.body.userName)
    .then((response) => {
      res.send(response)
    })
});


// pdf 파일 업로드
/* 파일의 이름을 관리하기 위해 multer의 diskStorage 함수로 
    디렉터리와 파일명에 대한 객체를 생성해서, 
    업로드 객체를 생성할때 storage 멤버로 전달하면 된다.*/
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/") // 파일 업로드 경로
  },
  filename(req, file, callback) {
    callback(null, file.originalname) // 전송자가 보낸 원래 이름으로 저장
  }
});

// 파일 업로드 경로와 파일 용량 제한 설정
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1000 * 16 } });


// 계약서 생성
app.post('/createCar', upload.single('file'), (req, res) => {
  const originalFileName = req.file.originalname // 원본 파일명
  const savePath = req.file.path // 파일 경로
  const fileSize = req.file.size // 파일 사이즈

  // 계약서 생성에 필요한 전체 계약서의 갯수 조회
  network.totalNumberContracts(req.body.userName)
    .then((response) => {
      var carsRecord = JSON.parse(response);
      var numCars = String(carsRecord.length + 1);
      // 자리수 만큼 남는 공간 0으로 채우기
      // 전체 계약서 번호 생성 (id 생성)
      var newKey = numCars.padStart(8, '0');
      console.log("newkey >>>>>>>>>>>", newKey)
      // 파일시스템에서 파일 열기
      fs.open(savePath, "r", function (err, fd) {
        // binary 데이터를 저장하기 위해 파일 사이즈 만큼의 크기를 갖는 Buffer 객체 생성
        const buffer = Buffer.alloc(fileSize);
        fs.read(fd, buffer, 0, buffer.length, null, function (err, bytes, buffer) {
          const obj = {
            "originalFileName": originalFileName,
            "filePath": savePath,
            "fileSize": fileSize,
            "file": buffer,
            "Key": newKey
          };
          const newData = new fileInfoSchema(obj);
          newData.save(function (err) { // 저장
            if (err) {
              res.send(err);
            } // db에 모든 작업이 올라간 후에 uploads에 있는 파일이 지워진다.
            // fs.unlink(savePath, function () { }) // 파일 삭제
            console.log("----- uploads에 있는 파일 삭제 완료 -----");
          });
          // 계약상태
          var newState = '계약 대기'
          base64EncodedText = Buffer.from(obj.file, "utf8").toString('base64');
          network.createContract(newKey, req.body.contract_name, req.body.contract_contents, req.body.contract_companyA, req.body.contract_companyB, req.body.contract_date, req.body.contract_period, obj.originalFileName, base64EncodedText, newState, req.body.userName)
            .then((response) => {
              res.send(response)
            })
        })
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
  network.sendContract(req.body.key, req.body.contract_signA, req.body.contract_receiver, changeState, req.body.userName, req.body.contract_contract_name)
    .then((response) => {
      res.send(response)
    })
})
app.post('/makeContract', (req, res) => {
  const changeState = '계약 완료';
  console.log(req.body);
  network.signedContract(req.body.key, req.body.contract_signB, changeState, req.body.userName, req.body.contract_contract_name)
    .then((response) => {
      res.send(response)
    })
})

app.listen(process.env.PORT || 8081);
