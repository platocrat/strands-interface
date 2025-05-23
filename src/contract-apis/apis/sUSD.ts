// Externals
import { BigNumber } from "@ethersproject/bignumber";
import { Signer } from "@ethersproject/abstract-signer";
// Locals
import {
  ocCtcAddreses,
  SGVA__OPTIMISM_MAINNET,
  LGSSVA__OPTIMISM_GOERLI,
  OPTIMISM_GOERLI_CHAIN_ID,
  LGSSVA__OPTIMISM_MAINNET,
  OPTIMISM_MAINNET_CHAIN_ID,
  OCA_GLOBAL_OPTIMISM_MAINNET,
} from "../../utils/constants";
// Types
import { Web3UserType } from "../../utils/types";
import { StrandsLyraVault } from "../types/StrandsLyraVault";
import {
  clTx,
  clErrors,
  getsUSDContract,
  getVaultContract,
  setTxHashesPerNetwork,
} from "../utils";
import { StrandsVault } from "../types/StrandsVault";

/**
 * @notice Approves sUSD spends from msg.sender.
 */
export async function approve(
  web3User: Web3UserType,
  // Method variables
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

  const sUSD = getsUSDContract(web3User.chainId);
  const signer: Signer = await web3User.account.connector?.getSigner();

  if (oneClicks?.isOneClicks) {
    if (web3User.chainId === OPTIMISM_GOERLI_CHAIN_ID) {
      spender = ocCtcAddreses[oneClicks.assetSymbol].testnet;
    }
    if (web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID) {
      spender = OCA_GLOBAL_OPTIMISM_MAINNET;
    }
  } else {
    if (strategyName !== undefined) {
      vault = getVaultContract(web3User.chainId, strategyName);
      spender = vault.address;
    } else {
      return Error(`'strategyName' is undefined!`);
    }
  }

  try {
    approve_ = await sUSD.connect(signer).approve(spender, value);

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
export async function allowance(
  web3User: Web3UserType,
  strategyName?: string | undefined,
  oneClicks?: { isOneClicks: boolean | undefined; assetSymbol: string }
): Promise<Error | BigNumber> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let allowance_: BigNumber, spender: string | undefined;

  const sUSD = getsUSDContract(web3User.chainId);
  const signer: Signer = await web3User.account.connector?.getSigner();

  // Method arguments
  const owner = web3User.account.address;

  if (web3User.chainId === OPTIMISM_GOERLI_CHAIN_ID) {
    if (oneClicks?.isOneClicks) {
      spender = ocCtcAddreses[oneClicks.assetSymbol].testnet;
    } else {
      if (strategyName !== undefined) {
        spender = LGSSVA__OPTIMISM_GOERLI;
      } else {
        spender = undefined;
      }
    }
  }

  if (web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID) {
    if (oneClicks?.isOneClicks) {
      spender = ocCtcAddreses[oneClicks.assetSymbol].mainnet;
    } else {
      if (strategyName !== undefined) {
        switch (strategyName) {
          case "longGamma":
            spender = LGSSVA__OPTIMISM_MAINNET;
            break;
          case "shortGamma":
            spender = SGVA__OPTIMISM_MAINNET;
            break;
          default:
            throw Error("No vault address found!");
        }
      } else {
        spender = undefined;
      }
    }
  }

  allowance_ = await sUSD.connect(signer).allowance(owner, spender);
  return allowance_;
}

/**
 * @notice Gets the balance of an account.
 */
export async function balanceOf(
  web3User: Web3UserType
): Promise<BigNumber | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let balanceOf_: BigNumber;

  const sUSD = getsUSDContract(web3User.chainId);
  const signer: Signer = await web3User.account.connector?.getSigner();

  balanceOf_ = await sUSD.connect(signer).balanceOf(web3User.account.address);
  return balanceOf_;
}
