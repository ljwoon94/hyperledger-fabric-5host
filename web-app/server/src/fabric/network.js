'use strict';
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');


const filePath = path.join(process.cwd(), '/connection.yaml');
let fileContents = fs.readFileSync(filePath, 'utf8');
let connectionFile = yaml.safeLoad(fileContents);

// 계약서 생성에 필요한 계약서 전체 갯수 불러오기
exports.totalNumberContracts = async function(userName) {
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
exports.createContract = async function(key, contract_name, contract_contents, contract_companyA, contract_companyB, contract_date, contract_period, state, userName) {
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
exports.modifyContract = async function(key, new_contract_name, new_contract_contents, new_contract_companyB, new_contract_receiver, new_contract_date, new_contract_period, userName) {
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
exports.queryContractList = async function(userName) {
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
exports.selectContract = async function(key, userName) {
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
        // Submit the specified transaction.
        // ModifyContract transaction - requires 2 args , ex: ('ModifyContract', 'CAR10', 'Dave')
        // await contract.evaluateTransaction('SelectContract', key);
        // console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        // await gateway.disconnect();
        const result = await contract.evaluateTransaction('selectContract',key);
        // response.msg = ' select Result submitted';
        return result;        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
// 계약서 전송
exports.sendContract = async function(key, contract_signA , contract_receiver, state, userName) {
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
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('sendContract', key, contract_signA, contract_receiver, state);
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
exports.signedContract = async function(key, contract_signB , state, userName) {
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
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('signedContract', key, contract_signB, state);
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