const readlineSync = require('readline-sync');
const compile = require('./kakarotCompileToken');
const deploy = require('./kakarotBuildToken');
const chalk = require('chalk');

// Ambil input dari pengguna
const tokenName = readlineSync.question(chalk.yellowBright('Enter the token name: '));
const tokenSymbol = readlineSync.question(chalk.yellowBright('Enter the token symbol: '));
const privateKey = readlineSync.question(chalk.yellowBright('Enter your private key: '));
const rpcUrl = readlineSync.question(chalk.yellowBright('Enter the RPC URL: '));

// Compile the contract
compile(tokenName, tokenSymbol);

// Deploy the contract
deploy(tokenName, tokenSymbol, privateKey, rpcUrl);
