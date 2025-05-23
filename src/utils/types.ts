// Externals
import { BigNumber } from "ethers";
import Wei from "@synthetixio/wei";
import { Board, Option } from "@lyrafinance/lyra-js";
import { GetAccountResult, Provider } from "@wagmi/core";
import { Dispatch, SetStateAction } from "react";

export type Web3UserType = {
  account: GetAccountResult<Provider>;
  chainId: number;
  provider: Provider;
};

export type MethodInfoType = {
  ctcName: string;
  methodName: string;
  isApproval: boolean;
};

export type TxSuspenseStateVarsType = {
  setRevertMsg: React.Dispatch<React.SetStateAction<string>>;
  setTxConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  setCtcCallReverted: React.Dispatch<React.SetStateAction<boolean>>;
  setPendingUserAction: React.Dispatch<React.SetStateAction<boolean>>;
  setTxHash?: React.Dispatch<React.SetStateAction<string>> | undefined;
  setPendingTxConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setHasApproved?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  setApprovedAllowance?: React.Dispatch<React.SetStateAction<Wei>> | undefined;
};

export type AssetType = {
  assetName: string;
  assetSymbol: string;
  address: string;
};

/**
 * @dev `o`ne `o`lick type
 */
export type ocType = {
  strategyName: string;
  isActive: boolean;
  legs: ocLegType[];
  bidPrice: number;
  askPrice: number;
  noStrikeFound: boolean;
};

/**
 * @dev `o`ne `c`lick `leg type
 */
export type ocLegType = {
  strikeId: number;
  strikeDelta: number;
  strikePrice: BigNumber | string;
  boardId: number;
  expiry: Date;
  isCall: boolean;
  isLong: boolean;
  size: number;
};

export type VaultStateType = {
  round: number;
  lockedAmount: BigNumber;
  lastLockedAmount: BigNumber;
  lockedAmountLeft: BigNumber;
  totalPending: BigNumber;
  queuedWithdrawShares: BigNumber;
  nextRoundReadyTimestamp: BigNumber;
  roundInProgress: boolean;
};

export type WithdrawalStructType = {
  round: number;
  shares: BigNumber;
};

export type DepositReceiptsStructType = {
  round: number;
  amount: BigNumber;
  unredeemedShares: BigNumber;
};

export type OCQuickMenuState = {
  isBid: boolean;
  legs: ocLegType[];
  strategyName: string;
  oneClickIndex: number;
  isSubmittingTrade: boolean;
  isOpenOCQuickMenu: boolean;
};

export type DataIsLoaded = {
  dataIsLoaded: boolean;
  dataIsLoading: boolean;
};

export type ShowBidAskStates = {
  showBidAsk: boolean;
  showSpinner: boolean;
  showBidCheckmark: boolean;
  showAskCheckmark: boolean;
};

// -------------------------- Global metadata types ----------------------------
export type StrategyNameObjectType = {
  title: string;
  key: string;
};

export type AddressObjectType = {
  testnet: string;
  mainnet: string;
};

export type VaultObjectType__Frontend = {
  strategyName: StrategyNameObjectType;
  address: AddressObjectType;
  isActive: boolean;
};

export type VaultObjectType__Backend = {
  strategyName: StrategyNameObjectType;
  address: AddressObjectType;
};

// Holds all vault strategies in a single object
export type VaultStrategyType = {
  coveredCall: VaultObjectType__Backend;
  longGamma: VaultObjectType__Backend;
  shortGamma: VaultObjectType__Backend;
  redacted0: VaultObjectType__Backend;
};

export type KeeperObjectType = {};

export type StrandsEthereumContractsObjectType__Frontend = {
  vaults: VaultObjectType__Frontend[];
  keepers: KeeperObjectType;
};

export type StrandsEthereumContractsObjectType__Backend = {
  vaults: VaultStrategyType;
  keepers: KeeperObjectType;
};

export type MinCollateralType = {
  minCollateral: BigNumber;
  isCall: boolean;
};

export type MinLiqPriceType = {
  minLiqPrice: number;
  isCall: boolean;
};

export type CachedBoardsType = { [key: string]: Board };

export type TargetOption = {
  strikeId: number;
  strikeDelta: number;
  strikePrice: BigNumber;
  boardId: number;
  expiry: Date;
  isCall: boolean;
  noStrikeFound: boolean;
  isLong: boolean;
  size: number;
};

export type CachedTargetOptionsType = { [key: string]: TargetOption };

export type PortfolioMarketType = {
  asset: { assetName: string; assetSymbol };
  dailyPrice: { price: number; percentChange: number };
  openInterest: { inUsd: number; inBaseAsset: number };
  volume: number;
};

export type ShareBalancesType = {
  heldByAccount: BigNumber;
  heldByVault: BigNumber;
};

export type OptionDataType = {
  oneClicks: ocType[];
  cachedBoards: any;
  currentAssetPrice: number;
  cachedOptions: CachedTargetOptionsType;
  setCachedBoards: Dispatch<SetStateAction<any>>;
  setcachedOptions: Dispatch<SetStateAction<CachedTargetOptionsType>>;
};

export type OCQuickMenuState__Group = {
  ocQuickMenuState: OCQuickMenuState;
  setOCQuickMenuState: Dispatch<SetStateAction<OCQuickMenuState>>;
};

export type OnSubmitHandler__Group = {
  handleApprove: (e: any) => void;
  handleSocketPlugin: (e: any) => void;
  handleSetApprovalForAll: (e: any) => void;
  handleTrade: (e: any, isBid: boolean, strategyNameKey?: string) => void;
};

export type OnInputHandler__Group = {
  debouncedOnSizeChange: any;
};

export type LyraOpenPosition = {
  owner: string;
  isLong: boolean;
  isCall: boolean;
  size: BigNumber;
  equity: BigNumber;
  expiryDate: string;
  positionId: number;
  marketName: string;
  assetSymbol: string;
  averageCost: BigNumber;
  strikePrice: BigNumber;
  currentPrice: BigNumber;
  lyraPositionUrl: string;
  unrealizedPnl: BigNumber;
  unrealizedPnlPercentage: BigNumber;
};

export type StatesAndBalances = {
  isDeposit: boolean;
  isValidAmount: boolean;
  needMoreDepositAsset: boolean;
  needGreaterAllowance: boolean;
  hasPendingWithdrawal: boolean;
  canCompleteWithdrawal: boolean;
};

/**
 * @dev `p`ortfolio `h`istory `t`able `h`eader` `T`ype
 */
export type phthType = {
  title: string;
  css: string;
};

export type LyraHistoricalPosition = {
  pnl: BigNumber;
  status: string;
  isLong: boolean;
  isCall: boolean;
  size: BigNumber;
  timeNumber: number | string;
  marketName: string;
  assetSymbol: string;
  openPrice: BigNumber;
  closePrice: BigNumber;
  strikePrice: BigNumber;
  lastUpdatedDate: string;
  lyraPositionUrl: string;
  openSpotPrice: BigNumber;
  pnlPercentage: BigNumber;
  closeSpotPrice: BigNumber;
};

export type GeneralVaultEventType = {
  deposits: DepositEvent[];
  approvals: any;
  withdraws: WithdrawEvent[];
  roundCloseds: RoundClosedEvent[];
  roundStarteds: RoundStartedEvent[];
  initiateWithdraws: InitiateWithdrawEvent[];
};

export type VaultEventsByAccountType = {
  deposits: DepositEvent[];
  approvals: any;
  withdraws: WithdrawEvent[];
  initiateWithdraws: InitiateWithdrawEvent[];
};

export type ExistingPositionType = {
  positionId: BigNumber;
  amount: BigNumber;
  isLong: boolean;
  collateral: BigNumber;
};

export type ExistingPositionType__Display = {
  amount: number;
  isLong: boolean;
  isCall: boolean;
  collateral: number;
};

// ---------------------------- Event data types -------------------------------
/**
 * @dev Deposit event type for vaults
 */
export type DepositEvent = {
  __typename: string;
  account: string;
  amount: string;
  vaultTotalPending: string;
  walletDepositAmount: string;
  round: string;
  blockTimestamp: string;
};

/**
 * @dev Withdraw event type for vaults
 */
export type WithdrawEvent = {
  __typename: string;
  account: string;
  amount: string;
  shares: string;
  blockTimestamp: string;
};

/**
 * @dev RoundClosed event type for vaults
 */
export type RoundClosedEvent = {
  __typename: string;
  lockAmount: string;
  roundId: number;
  blockTimestamp: string;
};

/**
 * @dev RoundStarted event type for vaults
 */
export type RoundStartedEvent = {
  __typename: string;
  lockAmount: string;
  newPricePerShare: string;
  roundEnds: string;
  roundId: number;
  blockTimestamp: string;
};

/**
 * @dev InitiateWithdraw event type for vaults
 */
export type InitiateWithdrawEvent = {
  __typename: string;
  account: string;
  round: string;
  shares: string;
  walletWithdrawalShares: string;
  blockTimestamp: string;
};

// ------------------------ Types taken from Lyra's interface ------------------
export type SynthetixSpotPriceHistoryResult = {
  id: string;
  close: string;
  open: string;
  high: string;
  low: string;
  timestamp: string;
};
