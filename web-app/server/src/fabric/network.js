'use strict';
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const CryptoJS = require('crypto-js');


const filePath = path.join(process.cwd(), '/connection.yaml');
let fileContents = fs.readFileSync(filePath, 'utf8');
let connectionFile = yaml.safeLoad(fileContents);

const caCertPath = path.resolve(__dirname, '..', '..', '..', '..', 'fabric-samples', 'raft-5node-swarm', 'crypto-config', 'peerOrganizations', 'org1.example.com', 'ca', 'ca.org1.example.com-cert.pem');
const caCert = fs.readFileSync(caCertPath, 'utf8');

// 계약서 생성에 필요한 계약서 전체 갯수 불러오기
exports.totalNumberContracts = async function (userName) {
    try {
        console.log('starting to TotalNumberContracts')
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Evaluate the specified transaction.
        // totalNumberContracts transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('totalNumberContracts');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
// 계약서 생성
exports.createContract = async function (key, contract_name, contract_contents, contract_companyA, contract_companyB, contract_date, contract_period, state, userName) {
    try {
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }
        // Create a new gateway for connecting to our peer node.
        console.log('we here in CreateContract')
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        // CreateContract transaction - requires 5 argument, ex: ('CreateContract', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        await contract.submitTransaction('createContract', key, contract_name, contract_contents, contract_companyA, contract_companyB, contract_date, contract_period, state, userName);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        response.msg = 'CreateContract Transaction has been submitted';
        return response;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
// 계약서 수정
exports.modifyContract = async function (key, new_contract_name, new_contract_contents, new_contract_companyB, new_contract_receiver, new_contract_date, new_contract_period, userName) {
    try {
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        // ModifyContract transaction - requires 2 args , ex: ('ModifyContract', 'CAR10', 'Dave')
        await contract.submitTransaction('modifyContract', key, new_contract_name, new_contract_contents, new_contract_companyB, new_contract_receiver, new_contract_date, new_contract_period);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        response.msg = 'ModifyContract Transaction has been submitted';
        return response;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
// 유저 아이디에 따른 목록 표시
exports.queryContractList = async function (userName) {
    try {
        console.log('starting to QueryContractList')
        console.log(userName);
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Evaluate the specified transaction.
        // QueryContractList transaction - requires no arguments, ex: ('QueryContractList')
        const result = await contract.evaluateTransaction('queryContractList', userName);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
// 계약서 상세 조회
exports.selectContract = async function (key, userName) {
    try {
        console.log('starting to SelectContract')
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        const result = await contract.evaluateTransaction('selectContract', key);
        // response.msg = ' select Result submitted';
        // 상세조회에서 나온 값 추출
        let resultJSON = JSON.parse(result);


        // pdf 파일 불러오기
        const filename = path.resolve(__dirname + '..', '..', '..', 'uploads', '부동산매매계약서.pdf');
        const fileLoaded = fs.readFileSync(filename, 'utf8');
        // 불러온 pdf 파일 hash 값 추출
        var hashToAction = CryptoJS.SHA256(fileLoaded).toString();
        console.log("Hash of the file: " + hashToAction);
        console.log("");

        // 갑 인증서 불러오기
        const certfile = path.resolve(__dirname + '..', '..', '..', 'wallet', resultJSON.contract_writer, resultJSON.contract_writer);
        const certLoaded = fs.readFileSync(certfile, 'utf8');
        const certfileObj = JSON.parse(certLoaded);
        // console.log(certfileObj.enrollment.identity.certificate);
        const certificate = certfileObj.enrollment.identity.certificate;

        console.log("갑 계약서 서명 시간 " + resultJSON.contract_timeA);
        console.log("");

        // Show info about certificate provided
        const certAObj = new X509();
        certAObj.readCertPEM(certificate);
        console.log("Detail of certificate provided")
        console.log("Subject: " + certAObj.getSubjectString());
        console.log("Issuer (CA) Subject: " + certAObj.getIssuerString());
        console.log("Valid period: " + certAObj.getNotBefore() + " to " + certAObj.getNotAfter());
        console.log("CA Signature validation: " + certAObj.verifySignature(KEYUTIL.getKey(caCert)));
        console.log("");

        // perform signature checking
        var userPublicKey = KEYUTIL.getKey(certificate);
        var recover = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        recover.init(userPublicKey);
        recover.updateHex(hashToAction);
        var getBackSigValueHex = new Buffer.from(resultJSON.contract_hashA, 'base64').toString('hex');
        console.log("갑 서명 확인 Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));
        console.log("");

        if (resultJSON.contract_receiver) {
            // 을 인증서 불러오기
            const certBfile = path.resolve(__dirname + '..', '..', '..', 'wallet', resultJSON.contract_receiver, resultJSON.contract_receiver);
            const certBLoaded = fs.readFileSync(certBfile, 'utf8');
            const certBfileObj = JSON.parse(certBLoaded);
            // console.log(certBfileObj.enrollment.identity.certificate);
            const certificateB = certBfileObj.enrollment.identity.certificate;

            console.log("을 계약서 서명 시간 " + resultJSON.contract_timeB);
            console.log("");

            // Show info about certificate provided
            const certBObj = new X509();
            certBObj.readCertPEM(certificateB);
            console.log("Detail of certificate provided")
            console.log("계약자: " + certBObj.getSubjectString());
            console.log("Issuer (CA) Subject: " + certBObj.getIssuerString());
            console.log("Valid period: " + certBObj.getNotBefore() + " to " + certBObj.getNotAfter());
            console.log("CA Signature validation: " + certBObj.verifySignature(KEYUTIL.getKey(caCert)));
            console.log("");

            // perform signature checking
            var userBPublicKey = KEYUTIL.getKey(certificateB);
            var recover = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
            recover.init(userBPublicKey);
            recover.updateHex(hashToAction);
            var getBackSigValueHex = new Buffer.from(resultJSON.contract_hashB, 'base64').toString('hex');
            console.log("을 서명 확인 Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));
            console.log("");
        }



        return result;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
// 계약서 전송
exports.sendContract = async function (key, contract_signA, contract_receiver, state, userName) {
    try {
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        var filename = path.resolve(__dirname + '..', '..', '..', 'uploads', '부동산매매계약서.pdf');

        // 업로드한 pdf 파일 해시화
        // calculate Hash from the specified file
        const fileLoaded = fs.readFileSync(filename, 'utf8');
        var hashToAction = CryptoJS.SHA256(fileLoaded).toString();
        console.log("Hash of the file: " + hashToAction);

        // extract certificate info from wallet
        // 지갑에 있는 개인키 불러오기 
        const walletContents = await wallet.export(userName);
        const userPrivateKey = walletContents.privateKey;

        // 암호화
        var sig = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        // 개인키와 해시값(pdf)를 서명 및 암호화
        sig.init(userPrivateKey, "");
        sig.updateHex(hashToAction);
        // 개인키를 가지고 pdf파일(해시)에 서명
        var sigValueHex = sig.sign();
        // 서명을 base64로 이용해 버퍼형식으로 저장
        var sigValueBase64 = new Buffer.from(sigValueHex, 'hex').toString('base64');
        console.log("Signature: " + sigValueBase64);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('sendContract', key, contract_signA, contract_receiver, state, sigValueBase64);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        response.msg = 'sendContract Transaction has been submitted';
        return response;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}

// 계약서 완료
exports.signedContract = async function (key, contract_signB, state, userName) {
    try {
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log(`An identity for the user ${userName} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        var filename = path.resolve(__dirname + '..', '..', '..', 'uploads', '부동산매매계약서.pdf');
        // 업로드한 pdf 파일 해시화
        // calculate Hash from the specified file
        const fileLoaded = fs.readFileSync(filename, 'utf8');
        var hashToAction = CryptoJS.SHA256(fileLoaded).toString();
        console.log("Hash of the file: " + hashToAction);

        // extract certificate info from wallet
        // 지갑에 있는 개인키 불러오기 
        const walletContents = await wallet.export(userName);
        const userPrivateKey = walletContents.privateKey;

        // 암호화
        var sig = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        // 개인키와 해시값(pdf)를 서명 및 암호화
        sig.init(userPrivateKey, "");
        sig.updateHex(hashToAction);
        var sigValueHex = sig.sign();
        var sigValueBase64 = new Buffer.from(sigValueHex, 'hex').toString('base64');
        console.log("Signature: " + sigValueBase64);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('signedContract', key, contract_signB, state, sigValueBase64);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        response.msg = 'signedContract Transaction has been submitted';
        return response;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}