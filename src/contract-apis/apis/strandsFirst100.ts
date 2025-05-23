// Externals
import { ethers, Signer } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
// Locals
import { toBN } from "../../utils/misc";
import { Web3UserType } from "../../utils/types";
import {
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  FIRST_100_ADDRESS_OPTIMISM_GOERLI,
  FIRST_100_ADDRESS_OPTIMISM_MAINNET,
  ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL,
} from "../../utils/constants";
import { StrandsFirst100 } from "../types/StrandsFirst100";
import StrandsFirst100__Artifact from "../artifacts/StrandsFirst100.json";
import { Dispatch, SetStateAction } from "react";
import {
  clTx,
  clErrors,
  propagateErrorMessage,
  setTxHashesPerNetwork,
} from "../utils";

export function getFirst100Ctc(chainId: number) {
  if (chainId === OPTIMISM_GOERLI_CHAIN_ID) {
    return new ethers.Contract(
      FIRST_100_ADDRESS_OPTIMISM_GOERLI,
      StrandsFirst100__Artifact.abi
    );
  } else if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
    return new ethers.Contract(
      FIRST_100_ADDRESS_OPTIMISM_MAINNET,
      StrandsFirst100__Artifact.abi
    );
  } else {
    console.log("no first100 NFT contract for chainId=%", chainId);
  }
}

/**
 * @notice Gets the balance of an account.
 */
export async function balanceOf(web3User: Web3UserType) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let balanceOf_: BigNumber = toBN("0");

  const first100 = getFirst100Ctc(web3User.chainId) as StrandsFirst100;
  const signer: Signer = await web3User.account.connector?.getSigner();

  balanceOf_ = await first100
    .connect(signer)
    .balanceOf(web3User.account.address);
  return balanceOf_;
}

/**
 * @notice Gets the balance of an account.
 */
export async function isWhitelisted(web3User: Web3UserType) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let isWhitelisted_: boolean = false;

  const first100 = getFirst100Ctc(web3User.chainId) as StrandsFirst100;
  const signer: Signer = await web3User.account.connector?.getSigner();

  isWhitelisted_ = await first100
    .connect(signer)
    .isWhitelisted(web3User.account.address);

  return isWhitelisted_;
}

/**
 * @notice Gets the balance of an account.
 */
export async function mint(
  web3User: Web3UserType,
  setTxHash: Dispatch<SetStateAction<string>>
  // options?: any
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let mint_;

  const first100 = getFirst100Ctc(web3User.chainId) as StrandsFirst100;
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    mint_ = await first100.connect(signer).mint();

    setTxHashesPerNetwork(web3User.chainId, mint_, setTxHash);
    clTx(web3User.chainId, "mint()", mint_);

    return mint_;
  } catch (error: any) {
    // propagateErrorMessage(error, options)
    return clErrors(error, "mint()");
  }
}
