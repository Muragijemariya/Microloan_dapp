const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Microloan = await hre.ethers.getContractFactory("Microloan");
  const microloan = await Microloan.deploy();

  await microloan.waitForDeployment(); // Ethers v6

  const address = await microloan.getAddress();

  console.log("Microloan deployed to:", address);

  // Export ABI and address for frontend use
  const contractData = {
    address,
    abi: JSON.parse(
      fs.readFileSync("./artifacts/contracts/microloan_dapp.sol/Microloan.json", "utf8")
    ).abi,
  };

  fs.writeFileSync(
    "./frontend/src/contractData.json",
    JSON.stringify(contractData, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});