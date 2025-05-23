// Externals
import { BigNumber, ethers } from "ethers";
import { Signer } from "@wagmi/core";
// Locals
import {
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  SYNTHETIC_ADAPTER_OPTIMISM_GOERLI,
  SYNTHETIC_ADAPTER_OPTIMISM_MAINNET,
} from "../../utils/constants";
import { Web3UserType } from "../../utils/types";
import SynthetixAdapter__Artifact from "../artifacts/SynthetixAdapter.json";

function getContract(chainId: number, signer: Signer) {
  let synthetixAdapter;

  console.log("synthetixAdapter getContract for chainId=%s", chainId);

  if (chainId === OPTIMISM_GOERLI_CHAIN_ID) {
    synthetixAdapter = new ethers.Contract(
      SYNTHETIC_ADAPTER_OPTIMISM_GOERLI,
      SynthetixAdapter__Artifact.abi,
      signer // with signer
    );
  }
  if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
    synthetixAdapter = new ethers.Contract(
      SYNTHETIC_ADAPTER_OPTIMISM_MAINNET,
      SynthetixAdapter__Artifact.abi,
      signer // with signer
    );
  }

  return synthetixAdapter;
}

export async function getSpotPrice(
  web3User: Web3UserType,
  assetSymbol: string
): Promise<BigNumber | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let getSpotPrice_;

  const signer: Signer = await web3User.account.connector?.getSigner();
  const synthetixAdapter = getContract(web3User.chainId, signer);

  getSpotPrice_ = await synthetixAdapter.getSpotPrice(
    ethers.utils.formatBytes32String(assetSymbol)
  );

  return getSpotPrice_;
}
