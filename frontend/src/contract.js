import { ethers } from "ethers";
import contractData from "./contractData.json";

export function getContract(signerOrProvider) {
  return new ethers.Contract(
    contractData.address,
    contractData.abi,
    signerOrProvider
  );
}
