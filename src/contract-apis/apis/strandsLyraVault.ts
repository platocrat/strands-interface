// Externals
import { ethers } from "ethers";
import { Signer } from "@wagmi/core";
import { Dispatch, SetStateAction } from "react";
import { BigNumber } from "@ethersproject/bignumber";
// Locals
import {
  clTx,
  clErrors,
  getVaultContract,
  setTxHashesPerNetwork,
  propagateErrorMessage,
} from "../utils";
// Misc
import { cl } from "../../utils/misc";
// Types
import {
  Web3UserType,
  VaultStateType,
  WithdrawalStructType,
  DepositReceiptsStructType,
  ShareBalancesType,
} from "../../utils/types";
import { Vault } from "../types/StrandsLyraVault";
// Constants
import {
  DSSSLVA__OPTIMISM_MAINNET,
  INFURA_OPTIMISM_MAINNET_URL,
  ARBITRUM_MAINNET_CHAIN_ID,
  ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL,
  ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL,
  ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL,
} from "../../utils/constants";

// -------------------------- Contract method calls ----------------------------
/**
 * @notice Deposits the `asset` from msg.sender.
 * @param amount Is the amount of `asset` to deposit
 */
export async function deposit(
  web3User: Web3UserType,
  // Variable to determine which vault address to use
  vaultName: string,
  // contract variables
  amount: BigNumber,
  // Save state of tx hash
  setTxHash: Dispatch<SetStateAction<string>>,
  options?: any
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let deposit_;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    deposit_ = await vault.connect(signer).deposit(amount, {
      gasLimit: 10_000_000,
    });

    setTxHashesPerNetwork(web3User.chainId, deposit_, setTxHash);
    clTx(web3User.chainId, "deposit()", deposit_);

    return deposit_;
  } catch (error: any) {
    propagateErrorMessage(error, options);
    return clErrors(error, "deposit()");
  }
}

/**
 * @notice Initiates a withdrawal for the given `amount`.
 * @param numShares The number of shares to withdraw
 */
export async function initiateWithdraw(
  web3User: Web3UserType,
  // Variable to determine which vault address to use,
  vaultName: string,
  // contract variables
  numShares: BigNumber,
  // Save state of tx hash
  setTxHash: Dispatch<SetStateAction<string>>,
  options?: any
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let initiateWithdraw_;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    initiateWithdraw_ = await vault.connect(signer).initiateWithdraw(numShares);

    setTxHashesPerNetwork(web3User.chainId, initiateWithdraw_, setTxHash);
    clTx(web3User.chainId, "initiateWithdraw()", initiateWithdraw_);

    return initiateWithdraw_;
  } catch (error: any) {
    propagateErrorMessage(error, options);
    return clErrors(error, "initiateWithdraw()");
  }
}

/**
 * @dev Completes a scheduled withdrawal from a past round.
 *         Uses finalized pps for the round
 */
export async function completeWithdraw(
  web3User: Web3UserType,
  // Variable to determine which vault address to use
  vaultName: string,
  // Save state of tx hash
  setTxHash: Dispatch<SetStateAction<string>>
) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let completeWithdraw_;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const signer: Signer = await web3User.account.connector?.getSigner();

  try {
    completeWithdraw_ = await vault.connect(signer).completeWithdraw();

    setTxHashesPerNetwork(web3User.chainId, completeWithdraw_, setTxHash);
    clTx(web3User.chainId, "completeWithdraw()", completeWithdraw_);

    return completeWithdraw_;
  } catch (error: any) {
    return clErrors(error, "completeWithdraw()");
  }
}

/**
 * @notice Gets the balance of an account.
 */
export async function balanceOf(web3User: Web3UserType, vaultName: string) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let balanceOf_;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log("strandsLyraVault balanceOf");

  balanceOf_ = await vault
    .connect(provider)
    .balanceOf(web3User.account.address);
  return balanceOf_;
}

/******************************** Fetch structs *******************************/
/**
 * @dev Returns `Withdrawals` struct
 * @notice `round` Round that withdrawn was made
 * @notice `shares` Number of shares withdrawn
 */
export async function withdrawalsStruct(
  web3User: Web3UserType,
  vaultName: string
): Promise<WithdrawalStructType | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let withdrawals_: WithdrawalStructType;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  withdrawals_ = await vault
    .connect(provider)
    .withdrawals(web3User.account.address as string);

  if (Array.isArray(withdrawals_)) {
    withdrawals_ = {
      round: withdrawals_.round,
      shares: withdrawals_.shares,
    };
  } else {
    withdrawals_ = {
      round: withdrawals_[0],
      shares: withdrawals_[1],
    };
  }

  return withdrawals_ as WithdrawalStructType;
}

/**
 * @dev Returns `VaultState` struct
 */
export async function vaultState(
  web3User: Web3UserType,
  vaultName: string
): Promise<VaultStateType> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  ) {
    throw Error("Account not found!");
  }

  let vaultState_: VaultStateType;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log("strandsLyraVault vaultState");

  vaultState_ = await vault.connect(provider).vaultState();

  if (Array.isArray(vaultState_)) {
    vaultState_ = {
      round: vaultState_.round,
      lockedAmount: vaultState_.lockedAmount,
      lastLockedAmount: vaultState_.lastLockedAmount,
      lockedAmountLeft: vaultState_.lockedAmountLeft,
      totalPending: vaultState_.totalPending,
      queuedWithdrawShares: vaultState_.queuedWithdrawShares,
      nextRoundReadyTimestamp: vaultState_.nextRoundReadyTimestamp,
      roundInProgress: vaultState_.roundInProgress,
    };
  }

  return vaultState_ as VaultStateType;
}

/**
 * @dev Returns `VaultParams` struct
 * @notice `decimals` Decimals of deposit asset
 * @notice `cap` Maximum amount of deposits accepted
 * @notice `asset` Deposit asset
 */
export async function vaultParams(
  web3User: Web3UserType,
  vaultName: string
): Promise<Vault.VaultParamsStruct | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let vaultParams_: Vault.VaultParamsStruct;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log("strandsLyraVault vaultParams");

  vaultParams_ = await vault.connect(provider).vaultParams();

  if (Array.isArray(vaultParams_)) {
    vaultParams_ = {
      decimals: vaultParams_.decimals,
      cap: vaultParams_.cap,
      asset: vaultParams_.asset,
    };
  }

  return vaultParams_;
}

/**
 * @dev Returns `DepositReceipts` struct
 * @notice `round` Round that deposit was made
 * @notice `amount` Amount of the deposit
 * @notice `unredeemedShares` Amount of shares yet to be withdrawn
 */
export async function depositReceipts(
  web3User: Web3UserType,
  vaultName: string
): Promise<DepositReceiptsStructType | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let depositReceipts_: DepositReceiptsStructType;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  depositReceipts_ = await vault
    .connect(provider)
    .depositReceipts(web3User.account.address);

  if (Array.isArray(depositReceipts_)) {
    depositReceipts_ = {
      round: depositReceipts_.round,
      amount: depositReceipts_.amount,
      unredeemedShares: depositReceipts_.unredeemedShares,
    };
  }

  return depositReceipts_;
}

/**
 * @dev Returns the underlying asset balance held on the vault for the account
 * @param web3User
 * @param vaultName
 * @return the amount of underlying asset custodied by the vault for the user
 */
export async function accountVaultBalance(
  web3User: Web3UserType,
  vaultName: string
): Promise<BigNumber | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let accountVaultBalance_: BigNumber;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log("strandsLyraVault accountVaultBalance");

  accountVaultBalance_ = await vault
    .connect(provider)
    .accountVaultBalance(web3User.account.address);

  return accountVaultBalance_;
}

/**
 * @dev Avoid using this function because it likely has bugs
 * @param web3User
 * @param vaultName
 * @return heldByAccount is the shares held by account
 * @return heldByVault is the shares held on the vault (unredeemedShares)
 */
export async function shareBalances(web3User: Web3UserType, vaultName: string) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let shareBalances_: ShareBalancesType;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log("strandsLyraVault shareBalances");

  shareBalances_ = await vault
    .connect(provider)
    .shareBalances(web3User.account.address);

  if (Array.isArray(shareBalances_)) {
    shareBalances_ = {
      heldByAccount: shareBalances_.heldByAccount,
      heldByVault: shareBalances_.heldByVault,
    };
  }

  return shareBalances_;
}

/**
 * @notice Returns total number of shares that the account has
 * @param web3User
 * @param vaultName
 * @return heldByAccount is the shares held by account
 * @return heldByVault is the shares held on the vault (unredeemedShares)
 */
export async function shares(web3User: Web3UserType, vaultName: string) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let shares_: BigNumber;

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log("strandsLyraVault share");

  shares_ = await vault.connect(provider).shares(web3User.account.address);
  return shares_;
}

export async function roundEnds(web3User: Web3UserType, vaultName: string) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let roundEnds: BigNumber;

  console.log("strandsLyraVault roundEnds");

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  roundEnds = await vault.connect(provider).roundEnds();
  return roundEnds;
}

export async function strategy(web3User: Web3UserType, vaultName: string) {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let strategyAddress: string;

  console.log("strandsLyraVault strategy address");

  const vault = getVaultContract(web3User.chainId, vaultName);
  const url =
    web3User.chainId == ARBITRUM_MAINNET_CHAIN_ID
      ? ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
      : ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);

  strategyAddress = await vault.connect(provider).strategy();
  return strategyAddress;
}
