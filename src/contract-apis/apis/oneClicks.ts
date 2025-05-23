// Externals
import { ethers } from "ethers";
import { Signer } from "@wagmi/core";
import { Dispatch, SetStateAction } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcProvider } from "@ethersproject/providers";
// Locals
import {
  clTx,
  clErrors,
  setTxHashesPerNetwork,
  propagateErrorMessage,
} from "../utils";
// Constants
import {
  TEN_MILLION_GAS_LIMIT,
  OPTIMISM_MAINNET_CHAIN_ID,
  ARBITRUM_MAINNET_CHAIN_ID,
  OCA_GLOBAL_OPTIMISM_MAINNET,
  OCA_GLOBAL_ARBITRUM_MAINNET,
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL,
  ALCHEMY_SECOND_KEY_ARBITRUM_MAINNET_URL,
} from "../../utils/constants";
// Types
import { OneClicks } from "../types/OneClicks";
import { Web3UserType } from "../../utils/types";
// ABIs
import OneClick__Optimism_ABI from "../artifacts/OneClicks.json";
import OneClick__Arbitrum_ABI from "../artifacts/arbitrum/OneClicks.json";
import { cl } from "../../utils/misc";

const arbitrumProvider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  ALCHEMY_SECOND_KEY_ARBITRUM_MAINNET_URL
);
const optimismProvider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL
);

export function getOCContract(chainId: number): OneClicks | undefined {
  let oc, contractAddress, provider, abi;

  if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
    contractAddress = OCA_GLOBAL_ARBITRUM_MAINNET;
    provider = arbitrumProvider;
    abi = OneClick__Arbitrum_ABI;
  } else {
    contractAddress = OCA_GLOBAL_OPTIMISM_MAINNET;
    provider = optimismProvider;
    abi = OneClick__Optimism_ABI;
  }
  //cl("getOCContract chainId=%s address=%s", chainId, contractAddress);
  oc = new ethers.Contract(contractAddress, abi, provider);

  return oc;
}

// -------------------------- Contract method calls ----------------------------
export async function tradeOneClick(
  web3User: Web3UserType,
  assetSymbol: string,
  name: string,
  underlier: string,
  estimatedCost: BigNumber,
  legs: OneClicks.LegDetailsStruct[],
  setTxHash: Dispatch<SetStateAction<string>>,
  options?: any
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let tradeOneClick_;

  const oc = getOCContract(web3User.chainId);
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    tradeOneClick_ = await oc
      ?.connect(signer)
      .tradeOneClick(name, underlier, estimatedCost, legs, {
        gasLimit: TEN_MILLION_GAS_LIMIT,
      });

    setTxHashesPerNetwork(web3User.chainId, tradeOneClick_, setTxHash);
    clTx(web3User.chainId, "tradeOneClick()", tradeOneClick_);

    return tradeOneClick_;
  } catch (error: any) {
    propagateErrorMessage(error, options);
    return clErrors(error, "tradeOneClick()");
  }
}

// export async function getMinCollateralForStrike(
//   underlier: string,
//   isCall: boolean,
//   isLong: boolean,
//   strikeId: BigNumber,
//   amount: BigNumber
// ) {
//   let minCollateralForStrike_: BigNumber;

//   const oc = getOCContract(OPTIMISM_MAINNET_CHAIN_ID, provider) as OneClicks;

//   try {
//     minCollateralForStrike_ = await oc.getMinCollateralForStrike(
//       underlier,
//       isCall,
//       isLong,
//       strikeId,
//       amount
//     );

//     return minCollateralForStrike_;
//   } catch (error: any) {
//     return clErrors(error, "minCollateralForStrike()");
//   }
// }

export async function getExistingPosition(
  assetSymbol: string,
  web3User: Web3UserType,
  strikeId: any,
  isCall: boolean,
  isArbi?: boolean
): Promise<
  | {
      positionId: BigNumber;
      positionAmount: BigNumber;
      isLong: boolean;
      collateral: BigNumber;
    }
  | Error
> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("getExistingPosition Account not found!");

  let getExistingPosition_: {
    positionId: BigNumber;
    positionAmount: BigNumber;
    isLong: boolean;
    collateral: BigNumber;
  };

  const oc = getOCContract(
    isArbi ? ARBITRUM_MAINNET_CHAIN_ID : OPTIMISM_MAINNET_CHAIN_ID
  ) as OneClicks;

  const wrappedSymbol = (isArbi ? "w" : "s") + assetSymbol;

  // console.log(
  //   "getExistingPosition underlier=%s strikeId=%s isCall=%s isArbi=%s",
  //   wrappedSymbol,
  //   strikeId,
  //   isCall,
  //   isArbi
  // );

  const signer = isArbi
    ? arbitrumProvider.getSigner(web3User.account.address)
    : optimismProvider.getSigner(web3User.account.address);

  getExistingPosition_ = await oc
    .connect(signer)
    .getExistingPosition(wrappedSymbol, strikeId, isCall);

  if (Array.isArray(getExistingPosition_)) {
    getExistingPosition_ = {
      positionId: getExistingPosition_.positionId,
      positionAmount: getExistingPosition_.positionAmount,
      isLong: getExistingPosition_.isLong,
      collateral: getExistingPosition_.collateral,
    };
  }

  return getExistingPosition_;
}

export async function closeAllPositions(
  web3User: Web3UserType,
  underliers: string[],
  setTxHash: Dispatch<SetStateAction<string>>
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let closeAllPositions_: any;

  const oc = getOCContract(web3User.chainId) as OneClicks;
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    closeAllPositions_ = await oc
      .connect(signer)
      .closeAllPositions(underliers, { gasLimit: 14_900_000 });

    setTxHashesPerNetwork(web3User.chainId, closeAllPositions_, setTxHash);
    clTx(web3User.chainId, "closeAllPositions()", closeAllPositions_);

    return closeAllPositions_;
  } catch (error: any) {
    // propagateErrorMessage(error, options)
    return clErrors(error, "closeAllPositions()");
  }
}

export async function closeSelectedPositions(
  web3User: Web3UserType,
  toClose: OneClicks.PositionsToCloseStruct[],
  setTxHash: Dispatch<SetStateAction<string>>
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let closeSelectedPositions_: any;

  const oc = getOCContract(web3User.chainId) as OneClicks;
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    closeSelectedPositions_ = await oc
      .connect(signer)
      .closeSelectedPositions(toClose, { gasLimit: 14_900_000 });

    setTxHashesPerNetwork(web3User.chainId, closeSelectedPositions_, setTxHash);
    clTx(web3User.chainId, "closeAllPositions()", closeSelectedPositions_);

    return closeSelectedPositions_;
  } catch (error: any) {
    // propagateErrorMessage(error, options)
    return clErrors(error, "closeAllPositions()");
  }
}
