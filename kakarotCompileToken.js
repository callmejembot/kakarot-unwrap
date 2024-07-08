const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const compile = (tokenName, tokenSymbol) => {
  const contractPath = path.resolve(__dirname, "MyToken.sol");
  let source = fs.readFileSync(contractPath, "utf8");

  // Replace token details in the source
  source = source.replace(/MyToken/g, tokenName);
  source = source.replace(/MTK/g, tokenSymbol);

  const input = {
    language: "Solidity",
    sources: {
      "MyToken.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const findImports = (importPath) => {
    if (importPath.startsWith('@openzeppelin/')) {
      const openzeppelinPath = path.resolve(__dirname, 'node_modules', importPath);
      return { contents: fs.readFileSync(openzeppelinPath, 'utf8') };
    } else {
      return { error: 'File not found' };
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  if (!output.contracts || !output.contracts["MyToken.sol"]) {
    console.error("Compilation error: Unable to find contracts in output.");
    return;
  }

  const contract = output.contracts["MyToken.sol"][tokenName];

  const buildPath = path.resolve(__dirname, "build");
  fs.ensureDirSync(buildPath);

  fs.outputJSONSync(path.resolve(buildPath, `${tokenName}.json`), contract);

  console.log(`Contract ${tokenName} compiled successfully`);
};

module.exports = compile;
