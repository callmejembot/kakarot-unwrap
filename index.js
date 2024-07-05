const fs = require('fs');
const { ethers } = require('ethers');
const chalk = require('chalk');

// URL RPC
const RPC_URL = 'https://1802203764.rpc.thirdweb.com/';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const wethContractAddress = '0xC6C7c2edF70A3245ad6051E93809162B9758ce08';
const wethContractAddressHisoka = '0x761612F0C8bdf8cF10e6F10045E2Ca7cbffBa8A3';
const amountToSwap = ethers.utils.parseEther('0.01');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk mendapatkan saldo ETH
async function getEthBalance(wallet) {
    const balance = await provider.getBalance(wallet.address);
    console.log(chalk.blueBright(`Saldo ETH: ${ethers.utils.formatEther(balance)} ETH`));
}

// Fungsi untuk mendapatkan saldo WETH
async function getWethBalance(address, contractAddress) {
    try {
        // ABI dari kontrak WETH untuk fungsi balanceOf
        const wethContractABI = [
            "function balanceOf(address _owner) view returns (uint256)"
        ];

        // Inisialisasi kontrak WETH
        const wethContract = new ethers.Contract(contractAddress, wethContractABI, provider);

        // Panggil fungsi balanceOf dari kontrak WETH untuk mendapatkan saldo
        const balance = await wethContract.balanceOf(address);

        console.log(chalk.magentaBright(`Saldo WETH (${contractAddress}): ${ethers.utils.formatEther(balance)} WETH`));
    } catch (error) {
        console.error(`Error saat mendapatkan saldo WETH (${contractAddress}):`, error);
    }
}

// Fungsi untuk memanggil deposit
async function depositToWeth(privateKey, contractAddress) {
    // ABI dari kontrak WETH untuk fungsi deposit
    const wethContractABI = [
        "function deposit() payable"
    ];

    try {
        // Inisialisasi signer (pengirim transaksi) dengan private key
        const wallet = new ethers.Wallet(privateKey, provider);

        // Inisialisasi kontrak
        const wethContract = new ethers.Contract(contractAddress, wethContractABI, wallet);

        // Tampilkan saldo ETH sebelum wrap
        await getEthBalance(wallet);

        // Jumlah ETH yang akan dikonversi menjadi WETH
        const ethAmount = amountToSwap;

        // Memanggil fungsi deposit dengan mengirim ETH
        const tx = await wethContract.deposit({ value: ethAmount });
        console.log(chalk.greenBright(`Transaction Hash: https://sepolia.kakarotscan.org/tx/${tx.hash}`));

        // Menunggu transaksi dikonfirmasi
        const receipt = await tx.wait();
        console.log(chalk.greenBright(`Transaction confirmed on block: ${receipt.blockNumber}`));

        // Tampilkan saldo ETH setelah wrap
        await getEthBalance(wallet);

    } catch (error) {
        console.error(`Error saat melakukan deposit ke WETH (${contractAddress}):`, error);
    }
}

// Fungsi untuk memanggil withdraw
async function withdrawFromWeth(privateKey, contractAddress) {
    // ABI dari kontrak WETH untuk fungsi withdraw
    const wethContractABI = [
        "function withdraw(uint256 _value) public"
    ];

    try {
        // Inisialisasi signer (pengirim transaksi) dengan private key
        const wallet = new ethers.Wallet(privateKey, provider);

        // Inisialisasi kontrak
        const wethContract = new ethers.Contract(contractAddress, wethContractABI, wallet);

        // Tampilkan saldo WETH sebelum unwrap
        await getWethBalance(wallet.address, contractAddress);

        // Jumlah WETH yang akan dikonversi menjadi ETH
        const wethAmount = amountToSwap;

        // Memanggil fungsi withdraw dengan mengirim WETH
        const tx = await wethContract.withdraw(wethAmount);
        console.log(chalk.greenBright(`Transaction Hash: https://sepolia.kakarotscan.org/tx/${tx.hash}`));

        // Menunggu transaksi dikonfirmasi
        const receipt = await tx.wait();
        console.log(chalk.greenBright(`Transaction confirmed on block: ${receipt.blockNumber}`));

        // Tampilkan saldo ETH setelah unwrap
        await getEthBalance(wallet);

    } catch (error) {
        console.error(`Error saat melakukan withdraw dari WETH (${contractAddress}) ke ETH:`, error);
    }
}

// Fungsi untuk membaca private key dari file
function readPrivateKeysFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        // Split berdasarkan baris baru dan filter agar tidak ada baris kosong
        const privateKeys = data.split('\n').filter(pk => pk.trim() !== '');
        return privateKeys;
    } catch (error) {
        console.error('Error saat membaca file private keys:', error);
        return [];
    }
}

async function main() {
    try {
        const privateKeys = readPrivateKeysFromFile('privateKey.txt');
        if (privateKeys.length === 0) {
            console.log(chalk.yellow('Tidak ada private key yang ditemukan dalam file.'));
            return;
        }

        for (let i = 0; i < privateKeys.length; i++) {
            const privateKey = privateKeys[i].trim();
            console.log(chalk.bold.cyanBright(`Menggunakan PrivateKey No: ${i + 1}`));
            
            console.log(chalk.bold.cyanBright('Berinteraksi dengan dex https://alpha.izumi.finance/ '));
            console.log(chalk.yellowBright('Sedang melakukan deposit ke WETH Izumi...'));
            await delay(2000);
            await depositToWeth(privateKey, wethContractAddress);
            console.log(chalk.yellowBright('Deposit berhasil, sedang melakukan withdraw dari WETH Izumi ke ETH...'));
            await delay(2000);
            await withdrawFromWeth(privateKey, wethContractAddress);
            console.log(chalk.magentaBright('Proses interaksi dengan dex https://alpha.izumi.finance/ berhasil.'));
            await delay(5000);
            
            console.log(chalk.bold.cyanBright('Berinteraksi dengan dex https://app.hisoka.finance/ '));
            console.log(chalk.yellowBright('Sedang melakukan deposit ke WETH Hisoka...'));
            await delay(2000);
            await depositToWeth(privateKey, wethContractAddressHisoka);
            console.log(chalk.yellowBright('Deposit berhasil, sedang melakukan withdraw dari WETH Hisoka ke ETH...'));
            await delay(2000);
            await withdrawFromWeth(privateKey, wethContractAddressHisoka);
            console.log(chalk.magentaBright('Proses interaksi dengan dex https://app.hisoka.finance/ berhasil.'));
            await delay(5000);
        }
    
    } catch (error) {
        console.error('Error utama:', error);
    }
}

main();
