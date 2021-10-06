docker-compose -f host1.yaml -f host2.yaml -f host3.yaml -f host4.yaml -f host5.yaml down -v
cd ../first-network
./byfn.sh down
cd ../raft-5node-swarm