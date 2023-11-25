# Hardhat Commands:

shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help


# Truffle Commands:

shell
truffle compile
truffle test
truffle migrate


# Pre-req

1. Metamask need to install on browser
2. Install ganache-cli globaly or Hardhat

# For Ethereum

1. cd/Ethereum
2. yarn or npm install

# For Truffle Suite users

1. Run `ganache-cli` on terminal
2. cd/Ethereum run `truffle migrate` on termial to deploy contract on localhost

# For Hardhat users

1. npx hardhat node
2. npx hardhat run scripts/deploy.js --network [network]

# For Client

1. yarn or npm install
2. yarn dev
3. To make a clear build run `yarn prod`

# node engines

">=8.0.0 <11.0.0"