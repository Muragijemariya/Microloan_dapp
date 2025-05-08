# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
Microloan DApp - Project README
 Microloan DApp
A decentralized microloan lending platform built with Solidity, Hardhat, React, and Ethers.js v6. Borrowers can request microloans, and the lender (contract deployer) can fund, monitor, and track repayment.
 Project Overview
This project is divided into two main parts:
- contracts/: The backend logic written in Solidity using the Hardhat framework.
- frontend/: The React app that interacts with the smart contract using Ethers.js v6.
Borrowers and lenders each have their own dashboard interface, and a main dashboard (App.js) lets users choose their role.
Folder Structure
MICROLOAN/
├── artifacts/
├── cache/
├── contracts/
│   └── microloan_dapp.sol
├── frontend/
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── Borrower_TEMP.js
│       ├── Lender_TEMP.js
│       ├── contract.js
│       ├── contractData.json
│       ├── contracts/Microloan.json
│       ├── App.css
│       ├── borrower&lender.css
│       └── index.css
├── README.md
 Prerequisites
Make sure you have the following installed:
- Node.js (v18 or higher)
- MetaMask
- Git
- Hardhat (npm install --save-dev hardhat)
 Installation & Setup
1. Clone the Repository
git clone https://github.com/yourusername/microloan_dapp.git
cd microloan_dapp
2. Backend (Hardhat Setup)
npm install
npx hardhat compile
npx hardhat node
In a separate terminal:
npx hardhat run scripts/deploy.js --network localhost
Update frontend/src/contractData.json with the deployed address.
3. Frontend Setup
cd frontend
npm install
npm start
 How It Works
- Borrowers can request loans by specifying an amount and duration.
- Lenders can view, fund, and monitor all loans.
- Repayment and overdue status are managed via smart contract logic.
- Role-based views are in App.js, Borrower_TEMP.js, and Lender_TEMP.js.
 Running Tests
npx hardhat test
MetaMask Setup
1. Connect MetaMask to http://localhost:8545.
2. Import test accounts using private keys from Hardhat node.
3. Use one account for the lender, others for borrowers.
 Sample scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Microloan = await hre.ethers.getContractFactory("Microloan");
  const microloan = await Microloan.deploy();
  await microloan.waitForDeployment();
  console.log("Contract deployed to:", microloan.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 License
This project is licensed under the MIT License.
 Author
Made by MURAGIJEMARIYA Delphine (https://github.com/yourgithub)
