// Externals
import { ethers } from "ethers";
import Wei, { wei } from "@synthetixio/wei";
import { Dispatch, SetStateAction } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { USDC_OPTIMISM_MAINNET_ADDRESS } from "@lyrafinance/lyra-js";
// Locals
import { web3UserIsUndefined } from "../utils/misc";
// APIs
import {
  deposit,
  initiateWithdraw,
  completeWithdraw,
} from "./apis/strandsLyraVault";
import {
  getAllowanceForContract,
  approveAllowanceForContract,
} from "./apis/erc20";
import { mint } from "./apis/strandsFirst100";
import {
  tradeOneClick,
  closeAllPositions,
  closeSelectedPositions,
} from "./apis/oneClicks";
import { setApprovalForAllOptionToken } from "./apis/optionToken";
// Metadata
import { evmContracts } from "../utils/globalMetadata";
// Constants
import {
  SGVA__OPTIMISM_MAINNET,
  OPTION_MARKET_ADDRESSES,
  LGSSVA__OPTIMISM_GOERLI,
  LGSSVA__OPTIMISM_MAINNET,
  LGSSVA__ARBITRUM_MAINNET,
  OPTIMISM_GOERLI_CHAIN_ID,
  DSSSLVA__OPTIMISM_GOERLI,
  DSSSLVA__OPTIMISM_MAINNET,
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  erc20Addresses,
} from "../utils/constants";
// Artifacts and ABIs
import ProxyERC20__ABI from "./artifacts/ProxyERC20.json";
import StrandsVault__ABI from "./artifacts/StrandsVault.json";
import StrandsLyraVault__ABI from "./artifacts/StrandsLyraVault.json";
import ArbiFiatToken__ABI from "./artifacts/arbitrum/ArbiFiatToken.json";
// Types
import {
  Web3UserType,
  MethodInfoType,
  VaultStrategyType,
  TxSuspenseStateVarsType,
} from "../utils/types";
import { OneClicks } from "./types/OneClicks";
import { StrandsVault } from "./types/StrandsVault";
import { StrandsLyraVault } from "./types/StrandsLyraVault";

/**
 * @dev `E`thereum `V`ault `C`ontracts
 */
const ETC: VaultStrategyType = evmContracts.vaults;

// --------------------------------- Helpers -----------------------------------

export function setTxHashesPerNetwork(
  chainId: number,
  tx: any,
  setTxHash: Dispatch<SetStateAction<string>>
) {
  if (chainId === OPTIMISM_GOERLI_CHAIN_ID) {
    setTxHash(`https://goerli-optimism.etherscan.io/tx/${tx.hash}`);
  }
  if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
    setTxHash(`https://optimistic.etherscan.io/tx/${tx.hash}`);
  }
  if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
    setTxHash(`https://arbiscan.io/tx/${tx.hash}`);
  }
}

/**
 * @dev Propogates error message to suspense states
 * @param error
 * @param options
 */
export function propagateErrorMessage(
  error: any,
  options: { txSSVs: TxSuspenseStateVarsType }
) {
  /**
   * @todo Refactor this function so that we show errors in our toast components
   */
  if (error.data?.message) {
    const revertMsg_ = error.data.message;

    if (revertMsg_.slice(0, 25) === "user rejected transaction") {
      return;
    } else {
      options.txSSVs.setPendingTxConfirmation(false);
      options.txSSVs.setCtcCallReverted(true);
      options.txSSVs.setRevertMsg(revertMsg_);
    }
  }

  if (error.message) {
    const revertMsg_ = error.message;

    if (revertMsg_.slice(0, 25) === "user rejected transaction") {
      return;
    } else if (revertMsg_.slice(0, 18) === "transaction failed") {
      options.txSSVs.setPendingTxConfirmation(false);
      options.txSSVs.setCtcCallReverted(true);
      options.txSSVs.setRevertMsg(revertMsg_.slice(0, 18));
    } else {
      options.txSSVs.setPendingTxConfirmation(false);
      options.txSSVs.setCtcCallReverted(true);
      options.txSSVs.setRevertMsg(revertMsg_);
    }
  }
}

/**
 * @dev Console log the error message (if any) from the function that is called
 */
export function clErrors(error: any, functionName: string) {
  if (error.data?.message) {
    console.log(
      `${functionName} call error.data.message: `,
      error.data.message
    );
    return error.data.message;
  }

  if (error.message) {
    console.log(`${functionName} call error.message: `, error.message);
    return error.message;
  }
}

/**
 * @dev Console log the transaction from the function that is called
 */
export function clTx(chainId: number, functionName: string, tx: any): void {
  if (chainId === 10) {
    console.log(`${functionName} tx receipt: `, tx);
    console.log(
      "Optimism txn hash on Optimistic Etherscan: ",
      "https://optimistic.etherscan.io/tx/" + tx.hash
    );
  }

  if (chainId === 420) {
    console.log(`${functionName} tx receipt: `, tx);
    console.log(
      "Optimism Goerli txn hash on Optimistic Etherscan: ",
      "https://goerli-optimism.etherscan.io/tx/" + tx.hash
    );
  }
}

export type InitiateWithdrawParams = [
  web3User: Web3UserType,
  vaultNameKey: string,
  numShares: BigNumber,
  setTxHash: Dispatch<SetStateAction<string>>,
  options?: any
];

export type CompleteWithdrawParams = [
  web3User: Web3UserType,
  vaultNameKey: string,
  setTxHash: Dispatch<SetStateAction<string>>
];

export type DepositParams = [
  // Web3 user variables
  web3User: Web3UserType,
  // Variable to determine which vault address to use
  vaultyName: string,
  // contract variables
  amount: BigNumber,
  setTxHash: Dispatch<SetStateAction<string>>,
  options?: any
];

export type ApproveParams = [
  // Web3 user variables
  web3User: Web3UserType,
  value: BigNumber,
  setTxHash: Dispatch<SetStateAction<string>>,
  oneClicks?: { isOneClicks: boolean | undefined; assetSymbol: string },
  // Vars to get vault contract
  vaultName?: string | undefined
  // Method variables
];

export type TradeOneClickParams = [
  web3User: Web3UserType,
  assetSymbol: string,
  name: string,
  underlier: string,
  estimatedCost: BigNumber,
  legs: OneClicks.LegDetailsStruct[],
  setTxHash: Dispatch<SetStateAction<string>>,
  options?: any
];

export type SetApprovalForAllParams = [
  web3User: Web3UserType,
  assetSymbol: string,
  setTxHash: Dispatch<SetStateAction<string>>
];

export type CloseAllPositionsParams = [
  web3User: Web3UserType,
  underliers: string[],
  setTxHash: Dispatch<SetStateAction<string>>
];

export type CloseSelectedPositionsParams = [
  web3User: Web3UserType,
  toClose: OneClicks.PositionsToCloseStruct[],
  setTxHash: Dispatch<SetStateAction<string>>
];

export type MintParams = [
  web3User: Web3UserType,
  setTxHash: Dispatch<SetStateAction<string>>
];

/**
 * @param ctcName Name of Solidity contract method to call
 * @param methodName Name of web3 method to call
 * @param txArgs Arguments to pass to the method
 */
async function callMethod(
  ctcName: string,
  methodName: string,
  txArgs: any,
  web3User: Web3UserType,
  setTxHash: Dispatch<SetStateAction<string>> | undefined,
  options?: any
) {
  let txArguments;

  console.log(
    "callMethod ctcName=%s methodName=%s txArgs=%s",
    ctcName,
    methodName,
    txArgs
  );
  switch (ctcName) {
    case "StrandsLyraVault":
      switch (methodName) {
        case "initiateWithdraw":
          txArguments = [
            web3User,
            txArgs.vaultName,
            txArgs.numShares,
            setTxHash, // Save state of tx hash
            options,
          ] as InitiateWithdrawParams;
          return await initiateWithdraw(
            ...(txArguments as InitiateWithdrawParams)
          );

        case "deposit":
          txArguments = [
            txArgs.web3User,
            txArgs.vaultName,
            txArgs.amount,
            setTxHash, // Save state of tx hashsetTxHash
            options,
          ] as DepositParams;
          return await deposit(...(txArguments as DepositParams));

        case "completeWithdraw":
          txArguments = [
            web3User,
            txArgs.vaultName,
            setTxHash, // Save state of tx hashsetTxHash,
          ] as CompleteWithdrawParams;
          return await completeWithdraw(
            ...(txArguments as CompleteWithdrawParams)
          );
      }
      break;

    case "USDC":
    case "sUSD":
    case "sETH":
    case "sBTC":
    case "wBTC":
    case "wETH":
      switch (methodName) {
        case "approve":
          return await approveAllowanceForContract(
            web3User,
            txArgs.amount,
            setTxHash,
            web3User.chainId,
            txArgs.erc20Symbol,
            txArgs.isOneClicks,
            txArgs.vaultName
          );
      }
      break;

    case "OneClicks":
      switch (methodName) {
        case "tradeOneClick":
          txArguments = [
            web3User,
            txArgs.assetSymbol,
            txArgs.name,
            txArgs.underlier,
            txArgs.estimatedCost,
            txArgs.legs,
            setTxHash,
            options,
          ] as TradeOneClickParams;
          return await tradeOneClick(...(txArguments as TradeOneClickParams));

        case "closeAllPositions":
          txArguments = [
            web3User,
            txArgs.underliers,
            setTxHash,
          ] as CloseAllPositionsParams;
          return await closeAllPositions(
            ...(txArguments as CloseAllPositionsParams)
          );

        case "closeSelectedPositions":
          txArguments = [
            web3User,
            txArgs.toClose,
            setTxHash,
          ] as CloseSelectedPositionsParams;
          return await closeSelectedPositions(
            ...(txArguments as CloseSelectedPositionsParams)
          );
      }
      break;

    case "OptionToken":
      switch (methodName) {
        case "setApprovalForAll":
          txArguments = [
            web3User,
            txArgs.assetSymbol,
            setTxHash,
          ] as SetApprovalForAllParams;
          return await setApprovalForAllOptionToken(
            ...(txArguments as SetApprovalForAllParams)
          );
      }
      break;

    case "StrandsFirst100":
      switch (methodName) {
        case "mint":
          txArguments = [web3User, setTxHash] as MintParams;
          return await mint(...(txArguments as MintParams));
      }
      break;
  }
}

/************************************* Switches *******************************/

/**
 * @dev `V`ault `S`trategy `N`ame `K`ey `S`witch
 * @param chainId
 * @param vaultNameKey
 * @param isDeltaLongStrat
 * @returns `ctcAddress` Contract address of vault contract running a strategy
 * specified by `vaultNameKey`
 */
export function vsnks(
  chainId: number,
  vaultNameKey: string,
  isDeltaLongStrat: boolean
) {
  switch (vaultNameKey) {
    case "coveredCall":
      switch (chainId) {
        case OPTIMISM_GOERLI_CHAIN_ID:
          return ETC.coveredCall.address.optimism.testnet;
        case OPTIMISM_MAINNET_CHAIN_ID:
          return ETC.coveredCall.address.optimism.mainnet;
      }
      break;

    case "longGamma":
      switch (chainId) {
        case OPTIMISM_GOERLI_CHAIN_ID:
          return ETC.longGamma.address.optimism.testnet;
        case OPTIMISM_MAINNET_CHAIN_ID:
          return ETC.longGamma.address.optimism.mainnet;
      }
      break;

    case "shortGamma":
      switch (chainId) {
        case OPTIMISM_GOERLI_CHAIN_ID:
          return ETC.shortGamma.address.optimism.testnet;
        case OPTIMISM_MAINNET_CHAIN_ID:
          return ETC.shortGamma.address.optimism.mainnet;
      }
      break;

    default:
      return "No contract found!";
  }
}

/*************************************** Getters ******************************/

/**
 * @dev Get `V`ault `C`ontract
 */
export function getVaultContract(
  chainId: number,
  vaultStrategy: string
): StrandsVault | StrandsLyraVault {
  let strandsVault: StrandsLyraVault | StrandsVault,
    ctcAddress: string = "";

  console.log(
    "getVaultContract chainId=%s vaultStrategy=%s",
    chainId,
    vaultStrategy
  );

  switch (vaultStrategy) {
    case "coveredCall":
      switch (chainId) {
        case OPTIMISM_GOERLI_CHAIN_ID:
          ctcAddress = DSSSLVA__OPTIMISM_GOERLI;
          break;

        case OPTIMISM_MAINNET_CHAIN_ID:
          ctcAddress = DSSSLVA__OPTIMISM_MAINNET;
          break;

        default:
          throw Error(`No vault contract address detected for network!`);
      }
      break;

    case "longGamma":
      switch (chainId) {
        case OPTIMISM_GOERLI_CHAIN_ID:
          ctcAddress = LGSSVA__OPTIMISM_GOERLI;
          break;

        case OPTIMISM_MAINNET_CHAIN_ID:
          ctcAddress = LGSSVA__OPTIMISM_MAINNET;
          break;

        case ARBITRUM_MAINNET_CHAIN_ID:
          ctcAddress = LGSSVA__ARBITRUM_MAINNET;
          break;

        default:
          throw Error(`No vault contract address detected for network!`);
      }
      break;

    case "shortGamma":
      switch (chainId) {
        case OPTIMISM_GOERLI_CHAIN_ID:
          ctcAddress = "";
          break;

        case OPTIMISM_MAINNET_CHAIN_ID:
          ctcAddress = SGVA__OPTIMISM_MAINNET;
          break;

        default:
          throw Error(`No vault contract address detected for network!`);
      }
      break;

    default:
      throw Error(`No matching vaultName detected!`);
  }

  if (ctcAddress === undefined) {
    console.log("getVaultContract ctcAddress undefined");
  }

  strandsVault = new ethers.Contract(
    ctcAddress,
    vaultStrategy === "coveredCall" ? StrandsLyraVault__ABI : StrandsVault__ABI
  ) as StrandsVault | StrandsLyraVault;

  return strandsVault;
}

export function getERC20Contract(chainId: number, symbol: string): any {
  let erc20Contract: any;
  let ctcAddress: string = erc20Addresses[chainId][symbol];

  if (ctcAddress === undefined) {
    console.log(
      "getERC20Contract chainId:%s symbol=%s ctcAddress=undefined",
      chainId,
      symbol
    );
    return undefined;
  }

  erc20Contract = new ethers.Contract(
    ctcAddress,
    symbol === "USDC" ? ArbiFiatToken__ABI : ProxyERC20__ABI
  );

  return erc20Contract;
}

export function getMarketAddress(chainId: number, assetSymbol: string): string {
  let assetAddress;

  let wrappedSymbol =
    (chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + assetSymbol;
  // console.log(
  //   "getMarketAddress chainId=%s assetSymbol=%s wrappedSymbol=%s",
  //   chainId,
  //   assetSymbol,
  //   wrappedSymbol
  // );
  switch (chainId) {
    case OPTIMISM_GOERLI_CHAIN_ID:
      assetAddress =
        OPTION_MARKET_ADDRESSES.optimism[`${wrappedSymbol}`].testnet;
      break;

    case OPTIMISM_MAINNET_CHAIN_ID:
      assetAddress =
        OPTION_MARKET_ADDRESSES.optimism[`${wrappedSymbol}`].mainnet;
      break;

    case ARBITRUM_MAINNET_CHAIN_ID:
      assetAddress =
        OPTION_MARKET_ADDRESSES.arbitrum[`${wrappedSymbol}`].mainnet;
      break;
  }

  return assetAddress;
}

/**
 * @dev Finds the last index of an error message string
 * @param errorMessage The returned error message from a transaction
 * @returns `lastIndex` Of the error message string
 */
export function findLastIndex(
  errorMessage: string,
  targetIndex: number
): number {
  let rightChar = "";

  const targetChar = `"`;

  for (let i = 0; i < errorMessage.length; i++) {
    rightChar = errorMessage[i];
    if (rightChar === targetChar) return i + targetIndex + 1;
    i++;
  }

  return -1;
}

//-------------------------------- Metaprograms --------------------------------

const deniedTxMsg = "MetaMask Tx Signature: User denied transaction signature.";
const executionRevertedTxMsg = "execution reverted";

function updateAllowance(
  ctcName: string,
  setApprovedAllowance: Dispatch<SetStateAction<Wei>>,
  web3User: Web3UserType,
  txArguments: any
) {
  return getAllowanceForContract(
    web3User,
    web3User.chainId,
    ctcName,
    false,
    txArguments.vaultName
  ).then((_allowance: BigNumber | Error) => {
    setApprovedAllowance(wei(_allowance.toString()));
  });
}

/** @todo Generalize transaction calls to a single metaprogram */
/**
 * @dev Metaprogram to send any single transaction from any contract
 * @notice A handler function to send a tx from a button's `onClick` property
 */
export async function sendTx(
  // Arguments used solely in this `sendTx` method
  methodInfo: MethodInfoType,
  // Client-side web3 arguments
  web3User: Web3UserType,
  // Tx suspense state vars
  txSSVs: TxSuspenseStateVarsType,
  // Client-side limiters
  limiters: any[],
  // Tx specific arguments
  txArguments: any
) {
  const limitersAllTrue = limiters.every((limiter) => limiter === true);

  if (limitersAllTrue && !web3UserIsUndefined(web3User)) {
    let tx_: any;

    txSSVs.setTxConfirmed(false); // enforce `false` state before ctc call
    txSSVs.setPendingUserAction(true);

    try {
      tx_ = await callMethod(
        methodInfo.ctcName,
        methodInfo.methodName,
        txArguments,
        web3User,
        txSSVs.setTxHash ? txSSVs.setTxHash : undefined,
        { txSSVs: txSSVs }
      );

      txSSVs.setPendingUserAction(false);

      /**
       * @todo Do the same checks for different wallets
       */
      if (tx_ === deniedTxMsg) {
        txSSVs.setPendingTxConfirmation(false);
        txSSVs.setCtcCallReverted(true);
        txSSVs.setRevertMsg(tx_);
      }

      if (typeof tx_ === "string") {
        const targetIndex = tx_.indexOf(executionRevertedTxMsg);

        if (targetIndex !== -1) {
          const errorMessage = tx_.slice(targetIndex);
          const lastIndex = findLastIndex(errorMessage, targetIndex);
          const longRevertMsg = tx_.slice(targetIndex, lastIndex);
          const revertMsg_ = longRevertMsg.slice(0, longRevertMsg.indexOf(`"`));

          txSSVs.setPendingTxConfirmation(false);
          txSSVs.setCtcCallReverted(true);
          txSSVs.setRevertMsg(revertMsg_);
        }
      } else {
        txSSVs.setPendingTxConfirmation(true);

        tx_ = await tx_.wait(1); // wait for 1 confirmations

        if (tx_.status === 1) {
          if (txSSVs.setApprovedAllowance) {
            updateAllowance(
              methodInfo.ctcName,
              txSSVs.setApprovedAllowance,
              web3User,
              txArguments
            );
          }

          if (txSSVs.setHasApproved) {
            txSSVs.setHasApproved(true);
          }

          txSSVs.setPendingTxConfirmation(false);
          txSSVs.setTxConfirmed(true);
        } else if (tx_.status === 0) {
          // Transaction failed
          txSSVs.setPendingTxConfirmation(false);
          txSSVs.setCtcCallReverted(true);
          txSSVs.setRevertMsg(`Transaction failed!`);
        }
      }
    } catch (error) {
      const options_ = { txSSVs: txSSVs };
      propagateErrorMessage(error, options_);
      return clErrors(
        error,
        `${methodInfo.ctcName}.${methodInfo.methodName}()`
      );
    }
  }
}
