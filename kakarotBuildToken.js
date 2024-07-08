const { ethers } = require("ethers");
const fs = require("fs-extra");
const path = require("path");
const chalk = require('chalk');

const deploy = async (tokenName, tokenSymbol, privateKey, rpcUrl) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const buildPath = path.resolve(__dirname, "build", `${tokenName}.json`);
  const { abi, evm } = fs.readJSONSync(buildPath);

  const factory = new ethers.ContractFactory(abi, evm.bytecode.object, wallet);
  const contract = await factory.deploy(wallet.address, tokenName, tokenSymbol);

  console.log(chalk.greenBright(`Contract address ${tokenName}:`, contract.address));

  await contract.deployTransaction.wait();

  console.log(chalk.greenBright("Contract deployment successful!"));
};

module.exports = deploy;
