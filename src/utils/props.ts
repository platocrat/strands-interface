// Externals
import React, {
  Dispatch,
  ReactNode,
  CSSProperties,
  SetStateAction,
} from "react";
import { BigNumberish } from "ethers";
import { Board } from "@lyrafinance/lyra-js";
import { Chain, Provider } from "@wagmi/core";
import { BigNumber } from "@ethersproject/bignumber";
// Locals
import {
  ocType,
  AssetType,
  Web3UserType,
  DataIsLoaded,
  VaultStateType,
  OptionDataType,
  OCQuickMenuState,
  LyraOpenPosition,
  ShareBalancesType,
  StatesAndBalances,
  PortfolioMarketType,
  OnInputHandler__Group,
  LyraHistoricalPosition,
  OnSubmitHandler__Group,
  DepositReceiptsStructType,
  VaultObjectType__Frontend,
} from "./types";
import { PromiseOrValue } from "../contract-apis/types/common";
import { StrandsInstrumentsType } from "../components/Tables/StrategyTable";

export type GeneralSectionProps = {
  assetSymbol: string;
  strategyName: string;
  web3User: Web3UserType;
  suspense: {
    edIsLoading: boolean;
    txConfirmed: boolean;
    chartDataLoaded: boolean;
  };
  eventData: {
    roundEnds: string;
    roundStatus: string;
    thirtyDayVolume: number;
    totalPendingDeposits: number;
    pricePerShare: number;
  };
  vault: {
    lockedAmount: number;
    totalPending: number;
    underlyingPrice: number;
    isRoundInProgress: boolean;
  };
};

export type DepositWithdrawProps = {
  assetSymbol: string;
  web3User: Web3UserType;
  amount: BigNumber | number;
  suspense: {
    txConfirmed: boolean;
    setTxConfirmed: Dispatch<SetStateAction<boolean>>;
  };
  vault: {
    shares: BigNumber;
    currentRound: number;
    isRoundInProgress: boolean;
    vaultState: VaultStateType;
    withdrawalShares: BigNumber;
    accountVaultBalance: BigNumber;
    shareBalances: ShareBalancesType;
    depositReceipts: DepositReceiptsStructType;
    setIsRoundInProgress: Dispatch<SetStateAction<boolean>>;
    setWithdrawalShares: Dispatch<SetStateAction<BigNumber>>;
    setAccountVaultBalance: Dispatch<SetStateAction<BigNumber>>;
  };
  setAmount: Dispatch<SetStateAction<BigNumber | number>>;
  switchNetwork: ((chainId_?: number | undefined) => void) | undefined;
};

export type GridProps = {
  web3User: Web3UserType;
};

export type StrategyProps = {
  isHome?: boolean;
  isActive: boolean;
  _assetName?: string;
  _assetSymbol?: string;
  vaultAddress?: string;
  instrumentPath?: string;
  strategyNameKey?: string;
  strategyNameTitle?: string;
  isAssetPriceLoading?: boolean;
  instrument?: StrandsInstrumentsType;
};

export type AssetsSectionProps = {
  isActive: boolean;
  assetName: string;
  assetSymbol: string;
  assetAddress: string;
};

export type OneClicksSectionProps = {
  currentAssetPrice: number;
  handleSocketPlugin: (e: any) => void;
  // txSuspense: {
  //   txConfirmed: boolean
  //   pendingTxConfirmation: boolean
  //   setTxHash: Dispatch<SetStateAction<string>>
  //   setTxConfirmed: Dispatch<SetStateAction<boolean>>
  //   setPendingTxConfirmation: Dispatch<SetStateAction<boolean>>
  // }
};

export type OneClickSectionProps = {
  handleSocketPlugin: (e: any) => void;
  suspense: {
    isDataLoaded: DataIsLoaded;
  };
};

export type StrategyTableProps = {
  isHome?: boolean;
  isAssetPriceLoading?: boolean;
  vaultCtcs?: VaultObjectType__Frontend[];
  TVL?: number;
  CUB?: number;
};

export type AssetTableProps = {
  assetObjs: any[];
};

export type CustomConnectProps = {
  className?: string;
};

export type RowLeftSideProps = {
  isAssets: boolean;
  isActive?: boolean;
  strategyNameTitle?: string;
};

export type UnorderedListProps = {
  isAssets: boolean;
  assetName?: string;
  assetSymbol?: string;
  oneClicks?: ocType[];
  assetObjs?: AssetType[];
  vaultCtcs?: VaultObjectType__Frontend[];
  chain?: (Chain & { unsupported?: boolean | undefined }) | undefined;
};

export type ListItemProps = {
  isAssets: boolean;
  isActive?: boolean;
  oneClickObjs?: any;
  vaultAddress?: string;
  strategyNameKey?: string;
  strategyNameTitle?: string;
  vaultCtcs?: VaultObjectType__Frontend[];
};

export type RowRightSideProps = {
  isActive?: boolean;
  isAssets?: boolean;
};

export type OneClicksTableProps = {
  isDataLoaded: DataIsLoaded;
  handleSocketPlugin: (e: any) => void;
};

export type AssetSelectorProps = {
  isOneClicks: boolean;
};

export type PriceCellProps = {
  handleSocketPlugin: (e: any) => void;
  suspense: {
    isDataLoaded: DataIsLoaded;
  };
};

export type DWButtonTextProps = {
  shares: BigNumber;
  strategyName: string;
  web3User: Web3UserType;
  amount: BigNumber | number;
  statesAndBalances: StatesAndBalances;
};

export type TVLSectionProps = {
  assetSymbol: string;
  strategyName: string;
  children?: ReactNode;
  web3User: Web3UserType;
  chartDataLoaded: boolean;
  suspense: {
    edIsLoading: boolean;
    txConfirmed: boolean;
    chartDataLoaded: boolean;
  };
  vault: {
    totalPending: number;
    lockedAmount: number;
  };
  eventData: {
    totalValueLocked: number;
    totalPendingDeposits: number;
  };
};

export type BidOrAskPriceProps = {
  oneClick: ocType;
};

export type AssetPriceProps = {
  currentAssetPrice: number;
  assetPriceIsLoading: boolean;
};

export type TableHeadProps = {
  isHome?: boolean;
  assetSymbol?: string;
  isOneClicks?: boolean;
  firstHeaderName: string;
};

export type StrategyCellProps = {
  isDataLoaded: {
    dataIsLoaded: boolean;
    dataIsLoading: boolean;
  };
};

export type ModalProps = {
  assetName: string;
  assetSymbol: string;
  clickOutsideRef: any;
  ocQuickMenuState: OCQuickMenuState;
};

export type AppLinkProps = {};

export type PasswordButtonProps = {
  password: string;
  strandsPassword: string;
  textStyle: CSSProperties;
  showInputPassword: boolean;
  setIsCorrectPassword: Dispatch<SetStateAction<boolean>>;
  setShowInputPassword: Dispatch<SetStateAction<boolean>>;
};

export type BidAskButtonProps = {
  handleBidAsk: (e: any, isBid?: boolean) => void;
};

export type BidAskMenuProps = {
  isBuy: boolean;
  handleSocketPlugin: (e: any) => void;
};

export type QuickMenuButtonProps = {
  isBid: boolean;
};

export type QuickMenuProps = {
  isBid: boolean;
  web3User: Web3UserType;
  children: React.ReactNode;
  oih: OnInputHandler__Group;
  osh: OnSubmitHandler__Group;
  trader: {
    needSUSD: boolean;
    isApprovedForAll: boolean;
    needGreaterAllowance: boolean;
  };
};

export type OneClickOptionLegsProps = {
  size: number;
  isBuy: boolean;
  web3User: Web3UserType;
  debouncedOnLiqPriceChange: (...args: any) => void;
};

export type MyBalancesProps = {
  assetSymbol: string;
  strategyName: string;
  web3User: Web3UserType;
  suspense: {
    edIsLoading: boolean;
    txConfirmed: boolean;
    chartDataLoaded: boolean;
  };
  eventData: {
    currentRound: number;
    pendingDeposits: number;
    currentVaultShares: number;
    pendingWithdrawals: number;
  };
  vault: {
    shares: BigNumber;
    strategyName: string;
    underlyingPrice: number;
    withdrawalShares: BigNumber;
    shareBalances: ShareBalancesType;
    depositReceipts: DepositReceiptsStructType;
  };
};

export type PageHeaderProps = {
  assetName: string;
  assetSymbol: string;
};

export type RechartsContainerProps = {
  data?: any[];
  yPos?: number;
  height?: number;
  isMobile?: boolean;
  chartHeight?: number;
  chartTopMargin?: string;
  mobileChartHeight?: number;
};

export type ProductInfoProps = {
  isOneClicks?: boolean;
};

export type SocketBridgeProps = {
  provider: Provider;
  isOneClicks: boolean;
  setOpenSocketPlugin: Dispatch<SetStateAction<boolean>>;
};

export type CustomInputProps = {
  type?: string | undefined;
  step?: number | undefined;
  canE?: boolean | undefined;
  right?: ReactNode | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  dataTestId?: string | undefined;
  placeholder?: string | undefined;
  min?: number | string | undefined;
  style?: CSSProperties | undefined;
  id?: string | undefined | undefined;
  value?: string | number | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  onChange: (e: any) => void;
};

export type PortfolioProps = {
  assetName: string;
  assetSymbol: string;
};

export type MarketsProps = {
  marketsDataLoaded: boolean;
  markets: PortfolioMarketType[];
};

export type QuotePriceProps = {
  size: number;
  isBid: boolean;
  ocQuote: number;
  web3User: Web3UserType;
  trader: {
    needSUSD: boolean;
    isApprovedForAll: boolean;
    needGreaterAllowance: boolean;
  };
  txSuspense: {
    revertMsg: string;
    ctcCallReverted: boolean;
    pendingUserAction: boolean;
    pendingTxConfirmation: boolean;
  };
};

export type MarketsTableProps = {
  markets: PortfolioMarketType[];
};

export type MarketsTableBodyProps = {
  markets: PortfolioMarketType[];
};

export type MarketsTableRowProps = {
  market: PortfolioMarketType;
};

export type HeaderSectionProps = {
  isDeposit: boolean;
  setIsDeposit: Dispatch<SetStateAction<boolean>>;
};

export type OpenPositionTableProps = {
  isVault?: boolean;
  strategyName?: string;
  isCloseSelectedOn?: boolean;
  openPositions: LyraOpenPosition[];
  positionIds?: { id: BigNumber; underlier: string }[];
  setPositionIds?: Dispatch<
    SetStateAction<
      {
        id: BigNumber;
        underlier: string;
      }[]
    >
  >;
};

export type OpenPositionsProps = {
  assetName: string;
  assetSymbol: string;
  web3User: Web3UserType;
  modal: {
    getIsApprovedForAll: () => void;
    isApprovedForAll: boolean;
    openCloseAllModal: boolean;
    setOpenCloseAllModal: Dispatch<SetStateAction<boolean>>;
  };
  suspense: {
    txConfirmed: boolean;
    pendingUserAction: boolean;
    pendingTxConfirmation: boolean;
    setTxHash: Dispatch<SetStateAction<string>>;
    setRevertMsg: Dispatch<SetStateAction<string>>;
    setTxConfirmed: Dispatch<SetStateAction<boolean>>;
    setCtcCallReverted: Dispatch<SetStateAction<boolean>>;
    setPendingUserAction: Dispatch<SetStateAction<boolean>>;
    setPendingTxConfirmation: Dispatch<SetStateAction<boolean>>;
  };
};

export type MobileDepositWithdrawProps = {
  strategyName: string;
  vault: {
    buttonStates: {
      isDeposit: boolean;
      isPinkButton: boolean;
      cursorPointer: string;
      isValidAmount: boolean;
      isButtonDisabled: boolean;
      isCorrectChainId: boolean;
      isRoundInProgress: boolean;
      needMoreDepositAsset: boolean;
      hasPendingWithdrawal: boolean;
      needGreaterAllowance: boolean;
      canCompleteWithdrawal: boolean;
      setIsRoundInProgress: Dispatch<SetStateAction<boolean>>;
    };
    // `d`eposits and `w`withdrawals
    dw: {
      amount: number | BigNumber;
      shares: BigNumber;
      currentRound: number;
      vaultState: VaultStateType;
      withdrawalShares: BigNumber;
      accountVaultBalance: BigNumber;
      shareBalances: ShareBalancesType;
      depositReceipts: DepositReceiptsStructType;
      setAmount: Dispatch<SetStateAction<number | BigNumber>>;
      setWithdrawalShares: Dispatch<SetStateAction<BigNumber>>;
      setAccountVaultBalance: Dispatch<SetStateAction<BigNumber>>;
    };
  };
  suspense: {
    pendingUserAction: boolean;
    pendingTxConfirmation: boolean;
  };
  handleSwitchNetwork: (e: any) => void;
  web3User: Web3UserType;
};

export type CloseAllButtonProps = {
  isCloseSelectedOn: boolean;
  handleCloseAllPositions: (e: any) => void;
  suspense: { pendingTxConfirmation: boolean; pendingUserAction: boolean };
};

export type CloseSelectedButtonProps = {
  isCloseSelectedOn: boolean;
  handleCloseSelectedPositions: (e: any) => void;
  positionIds: { id: BigNumber; underlier: string }[];
  suspense: { pendingTxConfirmation: boolean; pendingUserAction: boolean };
};

export type CancelCloseSelectedButtonProps = {
  setIsCloseSelectedOn: Dispatch<SetStateAction<boolean>>;
  suspense: { pendingTxConfirmation: boolean; pendingUserAction: boolean };
  setPositionIds: Dispatch<
    SetStateAction<
      {
        id: BigNumber;
        underlier: string;
      }[]
    >
  >;
};

export type OpenPositionsTableRowProps = {
  isVault?: boolean;
  strategyName?: string;
  position: LyraOpenPosition;
  positionIds?: { id: BigNumber; underlier: string }[];
  isCloseSelectedOn?: boolean;
  setPositionIds?: Dispatch<
    SetStateAction<
      {
        id: BigNumber;
        underlier: string;
      }[]
    >
  >;
};

export type OpenPositionsButtonsProps = {
  web3User: Web3UserType;
  suspense: {
    pendingUserAction: boolean;
    pendingTxConfirmation: boolean;
  };
  positions: {
    isCloseSelectedOn: boolean;
    openPositions: LyraOpenPosition[];
    positionIds: { id: BigNumber; underlier: string }[];
    setIsCloseSelectedOn: Dispatch<SetStateAction<boolean>>;
    handleCloseAllPositions: (e: any, methodName?: string) => void;
    handleCloseSelectedPositions: (e: any, methodName?: string) => void;
    setPositionIds: Dispatch<
      SetStateAction<
        {
          id: BigNumber;
          underlier: string;
        }[]
      >
    >;
  };
};

export type PageLockProps = {
  header: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  mobileNav: ReactNode;
  suspense?: {
    isDataLoaded: boolean;
  };
};

export type WelcomeMessageProps = {
  sizeControls: {
    isMobile: boolean;
    isDesktop: boolean;
  };
  hasFirst100NFT: boolean;
  hasAgreedToMessage: boolean;
  showWelcomeMessage: boolean;
  setHasAgreedToMessage: Dispatch<SetStateAction<boolean>>;
};

export type PortfolioHistoryProps = {
  assetName: string;
  assetSymbol: string;
};

export type PortfolioHistoryTableRowProps = {
  isVault?: boolean;
  position: LyraHistoricalPosition;
};

export type PortfolioHistorySectionProps = {
  positions: LyraHistoricalPosition[];
};

export type PortfolioHistoryTableProps = {
  isVault?: boolean;
  positions: LyraHistoricalPosition[];
};

export type CustomizePanelProps = {
  assetSymbol: string;
  strategyName: string;
  optionData: OptionDataType;
  isCustomizePanelOpen: boolean;
  txSuspense: {
    txConfirmed: boolean;
    pendingTxConfirmation: boolean;
    setTxHash: Dispatch<SetStateAction<string>>;
    setTxConfirmed: Dispatch<SetStateAction<boolean>>;
    setPendingTxConfirmation: Dispatch<SetStateAction<boolean>>;
  };
};

export type BoardQuotesProps = {
  board: Board;
  spotPrice: number;
  boardIndex: number;
  strategyName: string;
  _useCollapse: (index: number) => boolean;
  handleCollapse: (e: any, index: number) => void;
  customizeSubmitForm: {
    setSelectedLegs: Dispatch<
      SetStateAction<
        {
          amount: PromiseOrValue<BigNumberish>;
          strikeId: PromiseOrValue<BigNumberish>;
          strikePrice: PromiseOrValue<BigNumberish>;
          isCall: PromiseOrValue<boolean>;
          isLong: PromiseOrValue<boolean>;
          collateral: PromiseOrValue<BigNumberish>;
        }[]
      >
    >;
  };
};
