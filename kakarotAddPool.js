const { ethers } = require('ethers');
const readlineSync = require('readline-sync');

// Fungsi untuk membuat pool
const createPool = async (privateKey, contractAddress, tokenA, tokenB) => {
  const fee = 400;
  const tickSpacing = -92108;
  const gasLimitCreatePool = 5000000;
  const gasPrice = ethers.utils.parseUnits('2', 'gwei');

  const rpcUrl = 'https://1802203764.rpc.thirdweb.com/';
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // ABI untuk fungsi createPool
  const abi = ["function createPool(address tokenA, address tokenB, uint24 fee, int24 tickSpacing)"];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const txCreatePool = await contract.createPool(tokenA, tokenB, fee, tickSpacing, {
      gasLimit: gasLimitCreatePool,
      gasPrice: gasPrice
    });

    console.log("Creating pool...");
    console.log("Transaction sent:", txCreatePool.hash);

    const receiptCreatePool = await txCreatePool.wait();
    console.log("Transaction mined:", txCreatePool.hash);
    console.log("Pool created successfully!");
    return receiptCreatePool.transactionHash;
  } catch (error) {
    console.error("Error creating pool:", error);
    throw error;
  }
};

// Fungsi untuk menyetujui token
const approveToken = async (privateKey, tokenAddress, spenderAddress, amount) => {
  const gasLimitApprove = 100000;
  const gasPrice = ethers.utils.parseUnits('2', 'gwei');

  const rpcUrl = 'https://1802203764.rpc.thirdweb.com/';
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // ABI untuk fungsi approve
  const abi = ["function approve(address spender, uint256 amount)"];
  const contract = new ethers.Contract(tokenAddress, abi, wallet);

  try {
    const txApprove = await contract.approve(spenderAddress, amount, {
      gasLimit: gasLimitApprove,
      gasPrice: gasPrice
    });

    console.log("Approving token...");
    console.log("Transaction sent:", txApprove.hash);

    const receiptApprove = await txApprove.wait();
    console.log("Transaction mined:", txApprove.hash);
    console.log("Approval successful!");
    return receiptApprove.transactionHash;
  } catch (error) {
    console.error("Error approving token:", error);
    throw error;
  }
};

// Fungsi untuk menambah likuiditas
const addLiquidity = async (privateKey, contractAddress, tokenA, tokenB, amountETH, amountToken) => {
    const gasLimitAddLiquidity = 2000000;
    const gasPrice = ethers.utils.parseUnits('2', 'gwei');
  
    const rpcUrl = 'https://1802203764.rpc.thirdweb.com/';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
  
    // ABI untuk fungsi addLiquidity
    const abi = ["function addLiquidity(address tokenA, address tokenB, uint256 amountTokenA, uint256 amountTokenB, uint256 amountETH)"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);
  
    try {
      const txAddLiquidity = await contract.addLiquidity(tokenA, tokenB, amountToken, amountToken, amountETH, {
        gasLimit: gasLimitAddLiquidity,
        gasPrice: gasPrice
      });
  
      console.log("Adding liquidity...");
      console.log("Transaction sent:", txAddLiquidity.hash);
  
      const receiptAddLiquidity = await txAddLiquidity.wait();
      console.log("Transaction mined:", txAddLiquidity.hash);
      console.log("Liquidity added successfully!");
      return receiptAddLiquidity.transactionHash;
    } catch (error) {
      console.error("Error adding liquidity:", error);
      throw error;
    }
};


// Fungsi utama untuk menjalankan semua langkah
const main = async () => {
  try {
    const privateKey = readlineSync.question('Enter your private key: ');
    const contractAddress = readlineSync.question('Enter the contract address: ');
    const tokenAAddress = readlineSync.question('Enter the address of token A: ');
    const tokenBAddress = readlineSync.question('Enter the address of token B: ');

    // Step 1: Create Pool
    const createPoolTxHash = await createPool(privateKey, contractAddress, tokenAAddress, tokenBAddress);
    console.log("Create Pool transaction hash:", createPoolTxHash);
    console.log("Pool creation confirmed.");

    // Step 2: Approve Token
    const tokenAmount = ethers.utils.parseUnits('1000000', 18); // Misalnya 1 juta token A, asumsikan token memiliki 18 desimal
    const approveTxHash = await approveToken(privateKey, tokenAAddress, contractAddress, tokenAmount);
    console.log("Approve Token transaction hash:", approveTxHash);
    console.log("Token approval confirmed.");
//0x1653AF99762479B56A0046bC31B6C6FA8858bD13
    // Step 3: Add Liquidity
    const ethAmountToAdd = ethers.utils.parseUnits('0.005', 'ether'); // Jumlah ETH yang akan ditambahkan
    const tokenAmountToAdd = ethers.utils.parseUnits('49.5121', 18); // Misalnya 1000 token A, asumsikan token memiliki 18 desimal
    const addLiquidityTxHash = await addLiquidity(privateKey, contractAddress, tokenAAddress, tokenBAddress, ethAmountToAdd, tokenAmountToAdd);
    console.log("Add Liquidity transaction hash:", addLiquidityTxHash);
    console.log("Liquidity added successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};

// Panggil fungsi utama untuk memulai proses
main();
