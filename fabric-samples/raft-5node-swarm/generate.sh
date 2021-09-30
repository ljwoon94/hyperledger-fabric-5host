sudo rm -rf crypto-config channel-artifacts

../bin/cryptogen generate --config=./crypto-config.yaml
export FABRIC_CFG_PATH=$PWD
mkdir channel-artifacts

echo "orderer 채널 생성"
../bin/configtxgen -profile SampleMultiNodeEtcdRaft -outputBlock ./channel-artifacts/genesis.block -channelID system-channel
echo "mychannel 채널 생성"
../bin/configtxgen -profile MyChannel -outputCreateChannelTx ./channel-artifacts/mychannel.tx -channelID mychannel
echo "org1channel 앵커피어 생성"
../bin/configtxgen -profile MyChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

# ../bin/configtxgen -profile Org2Channel -outputCreateChannelTx ./channel-artifacts/org2channel.tx -channelID org2channel
echo "org2channel 앵커피어 생성"
../bin/configtxgen -profile MyChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

# ../bin/configtxgen -profile Org3Channel -outputCreateChannelTx ./channel-artifacts/org3channel.tx -channelID org3channel
echo "org3channel 앵커피어 생성"
../bin/configtxgen -profile MyChannel -outputAnchorPeersUpdate ./channel-artifacts/Org3MSPanchors.tx -channelID mychannel -asOrg Org3MSP

# ../bin/configtxgen -profile Org4Channel -outputCreateChannelTx ./channel-artifacts/org4channel.tx -channelID org4channel
echo "org4channel 앵커피어 생성"
../bin/configtxgen -profile MyChannel -outputAnchorPeersUpdate ./channel-artifacts/Org4MSPanchors.tx -channelID mychannel -asOrg Org4MSP

# ../bin/configtxgen -profile Org5Channel -outputCreateChannelTx ./channel-artifacts/org5channel.tx -channelID org5channel
echo "org5channel 앵커피어 생성"
../bin/configtxgen -profile MyChannel -outputAnchorPeersUpdate ./channel-artifacts/Org5MSPanchors.tx -channelID mychannel -asOrg Org5MSP