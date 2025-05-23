// Externals
import { BigNumber, Signer, ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
// Locals
import {
  ocAddresses,
  ARBITRUM_MAINNET_CHAIN_ID,
  ALCHEMY_SECOND_KEY_ARBITRUM_MAINNET_URL,
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL,
} from "../../utils/constants";
// Metadata
import { evmContracts } from "../../utils/globalMetadata";
// Types
import { Web3UserType } from "../../utils/types";
// Utils
import {
  clErrors,
  clTx,
  getERC20Contract,
  getVaultContract,
  setTxHashesPerNetwork,
} from "../utils";
import { toBN } from "../../utils/misc";

const arbitrumProvider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  ALCHEMY_SECOND_KEY_ARBITRUM_MAINNET_URL
);
const optimismProvider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL
);

export async function approveAllowanceForContract(
  web3User: Web3UserType,
  value: BigNumber,
  setTxHash: any,
  chainId: number,
  erc20Symbol: string,
  isOneClicks: boolean,
  vaultName?: string | undefined
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let approve_,
    targetContractAddress: string = "";

  const erc20Contract = getERC20Contract(chainId, erc20Symbol);
  const signer = await web3User.account.connector?.getSigner();

  targetContractAddress = isOneClicks
    ? ocAddresses[chainId]
    : vaultName !== undefined
    ? getVaultContract(chainId, vaultName).address
    : "";

  console.log(
    "%s approveForContract %s for [%s] %s isOneClicks=%s",
    erc20Symbol,
    value,
    chainId,
    targetContractAddress,
    isOneClicks
  );

  try {
    approve_ = await erc20Contract
      .connect(signer)
      .approve(targetContractAddress, value, {
        gasLimit: 1_000_000,
      });

    setTxHashesPerNetwork(chainId, approve_, setTxHash);
    clTx(chainId, "approve()", approve_);

    return approve_;
  } catch (error: any) {
    return clErrors(error, "approve()");
  }
}

/**
 * @notice Gets the allowance of `account`
 */
export async function getAllowanceForContract(
  web3User: Web3UserType,
  chainId: number,
  erc20Symbol: string,
  isOneClicks: boolean,
  vaultName?: string | undefined
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  ) {
    console.log(
      "getAllowanceForContract returning 0 cause web3User.account.address "
    );
    return toBN("0");
  }

  let allowance_: BigNumber = toBN("0"),
    targetContractAddress: string = "";

  const erc20Contract = getERC20Contract(chainId, erc20Symbol);
  const signer =
    chainId === ARBITRUM_MAINNET_CHAIN_ID
      ? arbitrumProvider.getSigner(web3User.account.address)
      : optimismProvider.getSigner(web3User.account.address);

  targetContractAddress = isOneClicks
    ? ocAddresses[chainId]
    : vaultName !== undefined
    ? getVaultContract(chainId, vaultName).address
    : "";

  if (targetContractAddress === "" || targetContractAddress === undefined) {
    console.log("getAllowanceForContract targetContractAddress not found");
    return toBN("0");
  }

  allowance_ = await erc20Contract
    .connect(signer)
    .allowance(web3User.account.address, targetContractAddress);

  // console.log(
  //   "%s allowanceForContract [%s]%s = %s",
  //   erc20Symbol,
  //   chainId,
  //   targetContractAddress,
  //   allowance_
  // );
  return allowance_;
}

/**
 * @notice Gets the balance of an account.
 */
export async function balanceOf(
  web3User: Web3UserType,
  chainId: number,
  erc20Symbol: string
): Promise<BigNumber | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let balanceOf_: BigNumber;

  const erc20Contract = getERC20Contract(chainId, erc20Symbol);
  const signer =
    chainId === ARBITRUM_MAINNET_CHAIN_ID
      ? arbitrumProvider.getSigner(web3User.account.address)
      : optimismProvider.getSigner(web3User.account.address);

  balanceOf_ = await erc20Contract
    .connect(signer)
    .balanceOf(web3User.account.address);

  // console.log(
  //   "balanceOf [%s] %s for %s = %s",
  //   chainId,
  //   erc20Symbol,
  //   web3User.account.address,
  //   balanceOf_
  // );
  return balanceOf_;
}
