// Externals
import { ethers } from "ethers";
import { Signer } from "@wagmi/core";
import { Dispatch, SetStateAction } from "react";
import { BigNumber } from "@ethersproject/bignumber";
// Locals
import { clTx, clErrors, setTxHashesPerNetwork } from "../utils";
import { getOCContract } from "./oneClicks";
import {
  erc721OptionTokens,
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  INFURA_OPTIMISM_MAINNET_URL,
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL,
  ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL,
} from "../../utils/constants";
import { OneClicks } from "../types/OneClicks";
import { Web3UserType } from "../../utils/types";
import OptionToken__ABI from "../artifacts/OptionToken.json";

function getOptionTokenContract(assetSymbol: string) {
  const ctcAddress = erc721OptionTokens[assetSymbol].mainnet;
  return new ethers.Contract(ctcAddress, OptionToken__ABI);
}

export async function setApprovalForAll(
  web3User: Web3UserType,
  assetSymbol: string,
  setTxHash: Dispatch<SetStateAction<string>>
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let setApprovalForAll_,
    optionToken,
    oc: OneClicks,
    spender: string = "";

  optionToken = getOptionTokenContract(assetSymbol);
  oc = getOCContract(web3User.chainId) as OneClicks;
  spender = oc.address;

  const approved = true;
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    setApprovalForAll_ = await optionToken
      .connect(signer)
      .setApprovalForAll(spender, approved);

    setTxHashesPerNetwork(web3User.chainId, setApprovalForAll_, setTxHash);
    clTx(web3User.chainId, "setApprovalForAll()", setApprovalForAll_);

    return setApprovalForAll_;
  } catch (error: any) {
    return clErrors(error, "setApprovalForAll()");
  }
}

/**
 * @notice Gets whether the account `isApprovedForAll`
 */
export async function isApprovedForAll(
  web3User: Web3UserType,
  assetSymbol: string
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let isApprovedForAll_: boolean;

  const optionToken = getOptionTokenContract(assetSymbol);
  const signer: Signer = await web3User.account.connector?.getSigner();

  // Method arguments
  const owner = web3User.account.address;
  const oc = getOCContract(web3User.chainId) as OneClicks;
  const spender = oc.address;

  isApprovedForAll_ = await optionToken
    .connect(signer)
    .isApprovedForAll(owner, spender);
  return isApprovedForAll_;
}

/**
 * @notice Gets the balance of an account.
 */
export async function balanceOf(assetSymbol: string, web3User: Web3UserType) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let balanceOf_: BigNumber;

  const optionToken = getOptionTokenContract(assetSymbol);
  const provider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL
  );

  balanceOf_ = await optionToken
    .connect(provider)
    .balanceOf(web3User.account.address);
  return balanceOf_;
}
