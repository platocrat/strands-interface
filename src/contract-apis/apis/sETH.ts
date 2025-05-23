// Externals
import { ethers } from "ethers";
import { Signer } from "@wagmi/core";
import { BigNumber } from "@ethersproject/bignumber";
// Misc utils
import {
  clErrors,
  clTx,
  getVaultContract,
  getsETHContract,
  setTxHashesPerNetwork,
} from "../utils";
// Constants
import {
  ocCtcAddreses,
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  INFURA_OPTIMISM_MAINNET_URL,
  ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL,
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL,
} from "../../utils/constants";
// Types
import { Web3UserType } from "../../utils/types";
import { StrandsVault } from "../types/StrandsVault";
import { StrandsLyraVault } from "../types/StrandsLyraVault";

/**
 * @notice Approves sETH spends from msg.sender.
 */
export async function approve(
  web3User: Web3UserType,
  value: BigNumber,
  setTxHash: any,
  oneClicks?: { isOneClicks: boolean | undefined; assetSymbol: string },
  strategyName?: string | undefined
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let approve_,
    vault: StrandsLyraVault | StrandsVault,
    spender: string = "";

  const sETH = getsETHContract(web3User.chainId);
  const signer: Signer = await web3User.account.connector?.getSigner();

  if (oneClicks?.isOneClicks) {
    if (web3User.chainId === OPTIMISM_GOERLI_CHAIN_ID) {
      spender = ocCtcAddreses[oneClicks.assetSymbol].testnet;
    }
    if (web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID) {
      spender = ocCtcAddreses[oneClicks.assetSymbol].testnet;
    }
  } else {
    if (strategyName !== undefined) {
      vault = getVaultContract(web3User.chainId, strategyName);
      spender = vault.address;
    } else {
      return Error(`'strategyName' are undefined!`);
    }
  }

  try {
    approve_ = await sETH.connect(signer).approve(spender, value);

    setTxHashesPerNetwork(web3User.chainId, approve_, setTxHash);
    clTx(web3User.chainId, "approve()", approve_);

    return approve_;
  } catch (error: any) {
    return clErrors(error, "approve()");
  }
}

/**
 * @notice Gets the allowance of `account`
 */
export async function allowance(web3User: Web3UserType, strategyName: string) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let allowance_: BigNumber;

  const sETH = getsETHContract(web3User.chainId);
  const provider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL
  );

  // Method arguments
  const owner = web3User.account.address;
  const vault = getVaultContract(web3User.chainId, strategyName);
  const spender = vault.address;

  allowance_ = await sETH.connect(provider).allowance(owner, spender);
  return allowance_;
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

  let balanceOf_: BigNumber;

  const sETH = getsETHContract(web3User.chainId);
  const provider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL
  );

  balanceOf_ = await sETH.connect(provider).balanceOf(web3User.account.address);
  return balanceOf_;
}
