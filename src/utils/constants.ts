// Externals
import { ethers } from "ethers";
// Locals
// APIs
import { Vault } from "../contract-apis/types/StrandsLyraVault";
// Requests
import { Deltas, DayExpiries } from "./requests/one-clicks/utils";
// Types
import {
  ocType,
  AssetType,
  ocLegType,
  DataIsLoaded,
  VaultStateType,
  MinLiqPriceType,
  OCQuickMenuState,
  LyraOpenPosition,
  ShareBalancesType,
  MinCollateralType,
  PortfolioMarketType,
  WithdrawalStructType,
  GeneralVaultEventType,
  LyraHistoricalPosition,
  VaultEventsByAccountType,
  DepositReceiptsStructType,
  ExistingPositionType__Display,
} from "./types";
import { OneClicks } from "../contract-apis/types/OneClicks";

// --------------------------- Contract addresses ------------------------------
/**
 * @dev Stands for `D`elta `S`hort `S`trategy `S`trands `L`yra `V`ault `A`ddress
 * @notice An address for a `StrandsLyraVault` contract which has its strategy
 *         set to a `DeltaLongStrategy`.
 * @notice on Optimism Goerli testnet
 */
export const DSSSLVA__OPTIMISM_GOERLI =
  "0x15021744eF2a856E7D5574185bfe76B396d5Fbef";
export const DSSSLVA__OPTIMISM_MAINNET =
  "0x83b5Da20319D011144eA9E34205bBC734ABFf1C8";
export const DSSA__OPTIMISM_MAINNET =
  "0x0f14281AE44190585105066dEAD359Cf898b1BaF";

/**
 * @dev Stands for `L`ong `G`amma `S`trategy `S`trands `V`ault `A`ddress
 * @notice An address for a `StrandsLyraVault` contract which has its strategy
 *         set to a `LongGammaStrategy`.
 */
export const LGSSVA__OPTIMISM_MAINNET =
  "0x87CC0d40801f47CacF6dEC2f080741eA52FA93fb";
export const LGSSVA__OPTIMISM_GOERLI = "";
export const LGSSVA__ARBITRUM_MAINNET =
  "0x8880AcC8D7f602652863636C5b2839FCD417ABFD";

// Short Gamma vault address
export const SGVA__OPTIMISM_MAINNET =
  "0xa2f4Eb64Ea4B1CAd4317DFFBD18970F912A3311a";
// Short Gamma strategy address
export const SGSVA__OPTIMISM_MAINNET =
  "0xe1A957B54E797494FDaDD1b08CBE5478188E18fd";
/**
 * @dev Stands for `L`ong `G`amma `S`trategy `A`ddress
 */
export const LGSA__OPTIMISM_MAINNET =
  "0xC36e1a228F75C303EB518De73c4A97162cb84cd0";

export const FIRST_100_ADDRESS_OPTIMISM_GOERLI =
  "0x2a843bf1c209172BCe1e606A647Ae8Bb597323E0";
export const FIRST_100_ADDRESS_OPTIMISM_MAINNET =
  "0x8C406F5aA2a614615c965de2899C04fEda40ED01";
export const FIRST_100_ADDRESS_ARBITRUM_MAINNET =
  "0x8C406F5aA2a614615c965de2899C04fEda40ED01";

/**
 * @dev `O`ne `C`licks `A`ddress
 * @notice on Optimism Goerli testnet
 */
export const OCA_sETH_OPTIMISM_GOERLI = "";
/**
 * @dev `O`ne `C`licks `A`ddress
 * @notice on Optimism Mainnet
 */
export const OCA_GLOBAL_OPTIMISM_MAINNET =
  "0xed72e68Ea914919580341cEFef8c7E795Abcc70c";
export const OCA_GLOBAL_ARBITRUM_MAINNET =
  "0x6Ae4Cda3E9F9BDD3c34d13aafc5414EfAaC345A1";

// Network details
export const OPTIMISM_MAINNET_CHAIN_ID = 10;
export const OPTIMISM_GOERLI_CHAIN_ID = 420;
export const ARBITRUM_MAINNET_CHAIN_ID = 42161;

/**
 * @dev Look-up table of network name to address
 */
export const ocAddresses = {
  42161: OCA_GLOBAL_ARBITRUM_MAINNET,
  10: OCA_GLOBAL_OPTIMISM_MAINNET,
};

/**
 * @dev Synthetix contracts
 */
export const SYNTHETIC_ADAPTER_OPTIMISM_GOERLI =
  "0x573fB076C3D17F23a9B5008678e9194A6a2F8914";
export const SYNTHETIC_ADAPTER_OPTIMISM_MAINNET =
  "0xbfa31380ED380cEb325153eA08f296A45A489108";

/**
 * @dev Increased gas limit for OneClicks contract
 */
export const TEN_MILLION_GAS_LIMIT = 10_000_000;

export const PORTFOLIO_QUOTE_ASSET = "sUSD";

export const MS_IN_SECS = 1_000;

export const MIN_COLLATERAL = 420;

export const SECS_IN_MIN = 60;

export const vaultInputMin = 0.000000999999999999999999;

export const liqPriceBuffer = 0.05; // 5% above/below spot price

export const estimatedCostBuffer = 1.1; // 10% buffer

// From `lyra-js`
export const UNIT = ethers.BigNumber.from(10).pow(18);
export const MAX_BN = ethers.BigNumber.from(2).pow(256).sub(1);

/**
 * @dev sUSD address that Lyra gave you
 */
export const sUSD_ADDRESS__OPTIMISM_GOERLI =
  "0x5108a03E4daFb6Af2cb8416cDBe20b4D6c675704";
export const sUSD_ADDRESS__OPTIMISM_MAINNET =
  "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9";
// ETH
export const sETH_ADDRESS__OPTIMISM_GOERLI =
  "0x2db9cB23277C4A73F1c53822AE61A68e55147E33";
export const sETH_ADDRESS__OPTIMISM_MAINNET =
  "0xE405de8F52ba7559f9df3C368500B6E6ae6Cee49";
export const wETH_ADDRESS__ARBITRUM_MAINNET =
  "0x919E5e0C096002cb8a21397D724C4e3EbE77bC15";
// sBTC
export const sBTC_ADDRESS__OPTIMISM_GOERLI = "";
export const sBTC_ADDRESS__OPTIMISM_MAINNET =
  "0x298B9B95708152ff6968aafd889c6586e9169f1D";
// sSOL
export const sSOL_ADDRESS__OPTIMISM_GOERLI = "";
export const sSOL_ADDRESS__OPTIMISM_MAINNET =
  "0x8b2F7Ae8cA8EE8428B6D76dE88326bB413db2766";

export const USDC_ADDRESS__ARBITRUM_MAINNET =
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";

// `OptionMarket`s
export const sETH_OPTION_MARKET_OPTIMISM_MAINNET =
  "0x1d42a98848e022908069c2c545aE44Cc78509Bc8";
export const sBTC_OPTION_MARKET_OPTIMISM_MAINNET =
  "0xc7f1a22c30ae981e6a74a0267ce6cbbf27d8ecd5";
export const sSOL_OPTION_MARKET_OPTIMISM_MAINNET =
  "0x3d96418b63749df7d6c31ad66ecbee210b1456b4";

export const sETH_OPTION_TOKEN_OPTIMISM_MAINNET =
  "0xCfDfF4E171133D55dE2e45c66a0E144a135D93f2";
export const sBTC_OPTION_TOKEN_OPTIMISM_MAINNET =
  "0xFbDcdeFD5CD7992aC6Fee832227B3cefDe46ed95";
export const sSOL_OPTION_TOKEN_OPTIMISM_MAINNET =
  "0xb5adf58391efec58a1497332fbc5233f93a28d65";

// Node provider URLs
export const ALCHEMY_SECOND_KEY_OPTIMISM_MAINNET_URL = `https://opt-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_OPTIMISM_SECOND_KEY}`;
export const ALCHEMY_THIRD_KEY_OPTIMISM_MAINNET_URL = `https://opt-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_OPTIMISM_THIRD_KEY}`;
export const ALCHEMY_SECOND_KEY_ARBITRUM_MAINNET_URL = `https://arb-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_ARBITRUM_SECOND_KEY}`;
export const ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL = `https://arb-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_ARBITRUM_THIRD_KEY}`;
export const INFURA_OPTIMISM_MAINNET_URL = `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

/**
 * @dev Use `provider` instead of user `signer` to avoid case where the chainId
 * that the user is connected to is different than the market they want to view
 * the total cost for
 */
export const ALCHEMY_ARBITRUM_PROVIDER_1 = new ethers.providers.JsonRpcProvider(
  ALCHEMY_SECOND_KEY_ARBITRUM_MAINNET_URL
);
/**
 * @dev Use `provider` instead of user `signer` to avoid case where the chainId
 * that the user is connected to is different than the market they want to view
 * the total cost for
 */
export const ALCHEMY_ARBITRUM_PROVIDER_2 = new ethers.providers.JsonRpcProvider(
  ALCHEMY_THIRD_KEY_ARBITRUM_MAINNET_URL
);

/**
 * @dev `S`ame `S`trike `S`ame `E`xpiry `S`trategy `N`ames
 */
export const SSSESNs: string[] = ["Synthetic", "Straddle"];

// --------------------------- OptionMarket addresses --------------------------
export const OPTION_MARKET_ADDRESSES = {
  arbitrum: {
    wETH: {
      testnet: "",
      mainnet: "0x919E5e0C096002cb8a21397D724C4e3EbE77bC15",
    },
    wBTC: {
      testnet: "",
      mainnet: "0xe044919cf58dfb066fc9de7c69c7db19f336b20c",
    },
  },
  optimism: {
    sETH: {
      testnet: "",
      mainnet: sETH_OPTION_MARKET_OPTIMISM_MAINNET,
    },
    sBTC: {
      testnet: "",
      mainnet: "0xc7f1a22c30ae981e6a74a0267ce6cbbf27d8ecd5",
    },
    // sSOL: {
    //   testnet: "",
    //   mainnet: "0x3d96418b63749df7d6c31ad66ecbee210b1456b4",
    // },
  },
};

//------------------------------- ERC20`s -------------------------------------
export const erc20Addresses = {
  42161: {
    wETH: wETH_ADDRESS__ARBITRUM_MAINNET,
    wBTC: wETH_ADDRESS__ARBITRUM_MAINNET,
    USDC: USDC_ADDRESS__ARBITRUM_MAINNET,
  },
  10: {
    sETH: sETH_ADDRESS__OPTIMISM_MAINNET,
    sBTC: sBTC_ADDRESS__OPTIMISM_MAINNET,
    sUSD: sUSD_ADDRESS__OPTIMISM_MAINNET,
  },
};

export const erc721OptionTokens = {
  optimism: {
    sETH: {
      testnet: "",
      mainnet: sETH_OPTION_TOKEN_OPTIMISM_MAINNET,
    },
    sBTC: {
      testnet: "",
      mainnet: sBTC_OPTION_TOKEN_OPTIMISM_MAINNET,
    },
    // sSOL: {
    //   testnet: "",
    //   mainnet: sSOL_OPTION_TOKEN_OPTIMISM_MAINNET,
    // },
  },
  arbitrum: {
    wETH: {
      mainnet: "0xe485155ce647157624C5E2A41db45A9CC88098c3",
    },
    wBTC: {
      mainnet: "0x0e97498F3d91756Ec7F2d244aC97F6Ea9f4eBbC3",
    },
  },
};

/**
 * @dev Placeholder data used for TVL charts
 */
export const placeholderData = [
  { date: "Aug 31, 7AM", tvl: 0 },
  { date: "Aug 31, 7AM", tvl: 3 },
  { date: "Aug 31, 7AM", tvl: 6 },
  { date: "Aug 31, 7AM", tvl: 50 },
  { date: "Aug 31, 7AM", tvl: 20 },
  { date: "Aug 31, 7AM", tvl: 110 },
  { date: "Aug 31, 7AM", tvl: 240 },
  { date: "Aug 31, 7AM", tvl: 425 },
  { date: "Aug 31, 7AM", tvl: 545 },
  { date: "Aug 31, 7AM", tvl: 699 },
  { date: "Aug 31, 7AM", tvl: 825 },
  { date: "Aug 31, 7AM", tvl: 950 },
  { date: "Aug 31, 7AM", tvl: 975 },
  { date: "Aug 31, 7AM", tvl: 1188 },
  { date: "Aug 31, 7AM", tvl: 1321 },
  { date: "Aug 31, 7AM", tvl: 1527 },
  { date: "Aug 31, 7AM", tvl: 1485 },
  { date: "Aug 31, 7AM", tvl: 1701 },
  { date: "Aug 31, 7AM", tvl: 1856 },
  { date: "Aug 31, 7AM", tvl: 1980 },
  { date: "Aug 31, 7AM", tvl: 2103 },
  { date: "Aug 31, 7AM", tvl: 2278 },
  { date: "Aug 31, 7AM", tvl: 2634 },
  { date: "Aug 31, 7AM", tvl: 2790 },
  { date: "Aug 31, 7AM", tvl: 2940 },
  { date: "Aug 31, 7AM", tvl: 3087 },
  { date: "Aug 31, 7AM", tvl: 3189 },
  { date: "Aug 31, 7AM", tvl: 3200 },
  { date: "Aug 31, 7AM", tvl: 3489 },
  { date: "Aug 31, 7AM", tvl: 3880 },
];

export const availableLyraMarkets = {
  optimism: [
    {
      asset: {
        assetName: "Ethereum",
        assetSymbol: "sETH",
      },
      address: sETH_OPTION_MARKET_OPTIMISM_MAINNET,
    },
    {
      asset: {
        assetName: "Bitcoin",
        assetSymbol: "sBTC",
      },
      address: sBTC_OPTION_MARKET_OPTIMISM_MAINNET,
    },
    {
      asset: {
        assetName: "Solana",
        assetSymbol: "sSOL",
      },
      address: sSOL_OPTION_MARKET_OPTIMISM_MAINNET,
    },
  ],
  arbitrum: [
    {
      asset: {
        assetName: "Ethereum",
        assetSymbol: "wETH",
      },
      address: "0x919E5e0C096002cb8a21397D724C4e3EbE77bC15",
    },
    {
      asset: {
        assetName: "Bitcoin",
        assetSymbol: "wBTC",
      },
      address: "0xe044919cf58dfb066fc9de7c69c7db19f336b20c",
    },
  ],
};

export const assetObjs: AssetType[] = [
  {
    assetName: "Ethereum",
    assetSymbol: "ETH",
    address: sETH_ADDRESS__OPTIMISM_GOERLI,
  },
  {
    assetName: "Bitcoin",
    assetSymbol: "BTC",
    address: sBTC_ADDRESS__OPTIMISM_GOERLI,
  },
  // {
  //   assetName: 'Solana',
  //   assetSymbol: 'sSOL',
  //   address: sSOL_ADDRESS__OPTIMISM_GOERLI
  // },
];

export const oneClickDescriptions = [
  {
    description:
      "A long (short) call and short (long) put where both options have the same underlying contract, same expiration date, and the same exercise price.",
  },
  {
    description:
      "The purchase of a call at one exercise price and the sale of a call at a different exercise price where both calls have the same expiration contract, and expire at the same time.",
  },
  {
    description:
      "The purchase of a put at one exercise price and the sale of a put at a different exercise price where both puts have the same expiration contract, and expire at the same time.",
  },
  {
    description:
      "A long (short) call and a long (short) put where both options have the same underlying contract, the same expiration date, and the same exercise price.",
  },
  {
    description:
      "A long (short) call and a long (short) put where both options have the same underlying contract, the same expiration date, but different exercise prices.",
  },
  {
    description:
      "A long (short) call and short (long) put with one expiration date, together with a short (long) call and long put with a different expiration date. All four options must have the same exercise price and the same underlying contract.",
  },
];

// deltas
export const delta25: Deltas = {
  minDelta: 0.15,
  maxDelta: 0.35,
  targetDelta: 0.25,
};
export const delta50: Deltas = {
  minDelta: 0.38,
  maxDelta: 0.62,
  targetDelta: 0.5,
};
// expiries
export const dayExpiries6: DayExpiries = {
  minDaysToExpiry: 2,
  maxDaysToExpiry: 10,
  targetDayExpiry: 6,
};
export const dayExpiries30: DayExpiries = {
  minDaysToExpiry: 6,
  maxDaysToExpiry: 36,
  targetDayExpiry: 30,
};

/**
 * @dev Lookup table for option combination vs
 * [false, false,,] === short put
 * [true, true,,] === long call
 */
export const ocStrategyConfigs = {
  Synthetic: [
    [true, true, delta50, dayExpiries30], // long call leg
    [false, false, delta50, dayExpiries30], // long put leg
  ],
  "Call Spread": [
    [true, true, delta50, dayExpiries30], // long low strike call leg
    [false, true, delta25, dayExpiries30], // short high strike call leg
  ],
  "Put Spread": [
    [true, false, delta50, dayExpiries30], // long high strike put leg
    [false, false, delta25, dayExpiries30], // short low strike put leg
  ],
  Straddle: [
    [true, true, delta50, dayExpiries30], // long call leg
    [true, false, delta50, dayExpiries30], // long put leg
  ],
  Strangle: [
    [true, false, delta25, dayExpiries30], //long put leg
    [true, true, delta25, dayExpiries30], //long call leg
  ],
  Roll: [
    [true, true, delta50, dayExpiries30], // long far expiry call leg
    [false, false, delta50, dayExpiries30], // short far expiry put leg
    [false, true, delta50, dayExpiries6], // short close expiry call leg
    [true, false, delta50, dayExpiries6], // long close expiry put leg
  ],
};

// ---------------------- Initial React hook states ----------------------------
export const initDataIsLoaded: any = {
  dataIsLoaded: false,
  dataIsLoading: true,
};

export const INIT_ZERO = ethers.BigNumber.from(0);

/**
 * @dev
 */
export const initLegs: ocLegType[] = [
  {
    strikeId: 0,
    strikeDelta: 0,
    strikePrice: "----",
    boardId: 0,
    expiry: new Date(),
    isCall: true,
    isLong: true,
    size: 0,
  },
];

export const initOC: ocType = {
  strategyName: "Synthetic",
  isActive: true,
  legs: initLegs,
  bidPrice: 0,
  askPrice: 0,
  noStrikeFound: false,
};

export const initOCNotFound: ocType = {
  strategyName: "Synthetic",
  isActive: true,
  legs: initLegs,
  bidPrice: 0,
  askPrice: 0,
  noStrikeFound: true,
};

export const initOneClicks: ocType[] = [
  {
    strategyName: "Synthetic",
    isActive: true,
    legs: initLegs,
    bidPrice: 0,
    askPrice: 0,
    noStrikeFound: false,
  },
  {
    strategyName: "Call Spread",
    isActive: true,
    legs: initLegs,
    bidPrice: 0,
    askPrice: 0,
    noStrikeFound: false,
  },
  {
    strategyName: "Put Spread",
    isActive: true,
    legs: initLegs,
    bidPrice: 0,
    askPrice: 0,
    noStrikeFound: false,
  },
  {
    strategyName: "Straddle",
    isActive: true,
    legs: initLegs,
    bidPrice: 0,
    askPrice: 0,
    noStrikeFound: false,
  },
  {
    strategyName: "Strangle",
    isActive: true,
    legs: initLegs,
    bidPrice: 0,
    askPrice: 0,
    noStrikeFound: false,
  },
  {
    strategyName: "Roll",
    isActive: true,
    legs: initLegs,
    bidPrice: 0,
    askPrice: 0,
    noStrikeFound: false,
  },
];

export const initVaultState: VaultStateType = {
  round: 0,
  lockedAmount: ethers.BigNumber.from(0),
  totalPending: ethers.BigNumber.from(0),
  lastLockedAmount: ethers.BigNumber.from(0),
  lockedAmountLeft: ethers.BigNumber.from(0),
  queuedWithdrawShares: ethers.BigNumber.from(0),
  nextRoundReadyTimestamp: ethers.BigNumber.from(0),
  roundInProgress: false,
};

export const initVaultParams: Vault.VaultParamsStruct = {
  asset: "",
  cap: ethers.BigNumber.from(0),
  decimals: ethers.BigNumber.from(0),
};

export const initDepositReceipts: DepositReceiptsStructType = {
  round: -1,
  amount: ethers.BigNumber.from(0),
  unredeemedShares: ethers.BigNumber.from(0),
};

export const initWithdrawalsStruct: WithdrawalStructType = {
  round: -1,
  shares: ethers.BigNumber.from(0),
};

export const initOCQuickMenuState: any = {
  isBid: false,
  legs: initLegs,
  strategyName: "",
  oneClickIndex: -1,
  isSubmittingTrade: false,
  isArbitrumOCMenuOpen: false,
  isOptimismOCMenuOpen: false,
};

export const initMinLiqPrice: MinLiqPriceType = {
  minLiqPrice: 0,
  isCall: false,
};

export const initMinCollateral: MinCollateralType = {
  minCollateral: INIT_ZERO,
  isCall: false,
};

export const initLegDetailsStruct: OneClicks.LegDetailsStruct = {
  amount: INIT_ZERO,
  strikeId: INIT_ZERO,
  isCall: false,
  isLong: false,
  finalPositionCollateral: INIT_ZERO,
};

export const initPortfolioMarket: PortfolioMarketType = {
  asset: { assetName: "Ethereum", assetSymbol: "sETH" },
  dailyPrice: { price: 0, percentChange: 0 },
  openInterest: { inUsd: 0, inBaseAsset: 0 },
  volume: 0,
};

export const initShareBalances: ShareBalancesType = {
  heldByAccount: INIT_ZERO,
  heldByVault: INIT_ZERO,
};

export const initWeb3User: any = {
  account: undefined,
  chainId: OPTIMISM_MAINNET_CHAIN_ID,
  provider: undefined,
};

export const initLyraOpenPosition: LyraOpenPosition = {
  owner: "",
  isLong: true,
  isCall: true,
  positionId: 0,
  marketName: "",
  expiryDate: "",
  assetSymbol: "",
  size: INIT_ZERO,
  equity: INIT_ZERO,
  lyraPositionUrl: "",
  averageCost: INIT_ZERO,
  strikePrice: INIT_ZERO,
  currentPrice: INIT_ZERO,
  unrealizedPnl: INIT_ZERO,
  unrealizedPnlPercentage: INIT_ZERO,
};

export const initLyraHistoricalPosition: LyraHistoricalPosition = {
  isLong: true,
  isCall: true,
  timeNumber: 0,
  pnl: INIT_ZERO,
  size: INIT_ZERO,
  status: "CLOSED",
  marketName: "ETH",
  assetSymbol: "ETH",
  lyraPositionUrl: "",
  openPrice: INIT_ZERO,
  lastUpdatedDate: "1d",
  closePrice: INIT_ZERO,
  strikePrice: INIT_ZERO,
  openSpotPrice: INIT_ZERO,
  pnlPercentage: INIT_ZERO,
  closeSpotPrice: INIT_ZERO,
};

export const initGeneralVaultEvents: GeneralVaultEventType = {
  deposits: [
    {
      __typename: "",
      account: "",
      amount: "",
      walletDepositAmount: "",
      vaultTotalPending: "",
      round: "",
      blockTimestamp: "",
    },
  ],
  approvals: [{}],
  withdraws: [
    {
      __typename: "",
      account: "",
      amount: "",
      shares: "",
      blockTimestamp: "",
    },
  ],
  roundCloseds: [
    {
      __typename: "",
      lockAmount: "",
      roundId: 0,
      blockTimestamp: "",
    },
  ],
  roundStarteds: [
    {
      __typename: "",
      lockAmount: "",
      newPricePerShare: "",
      roundEnds: "",
      roundId: 0,
      blockTimestamp: "",
    },
  ],
  initiateWithdraws: [
    {
      __typename: "",
      account: "",
      round: "",
      shares: "",
      walletWithdrawalShares: "",
      blockTimestamp: "",
    },
  ],
};

export const initVaultEventsByAccount: VaultEventsByAccountType = {
  deposits: [
    {
      __typename: "",
      account: "",
      amount: "",
      walletDepositAmount: "",
      vaultTotalPending: "",
      round: "",
      blockTimestamp: "",
    },
  ],
  approvals: [{}],
  withdraws: [
    {
      __typename: "",
      account: "",
      amount: "",
      shares: "",
      blockTimestamp: "",
    },
  ],
  initiateWithdraws: [
    {
      __typename: "",
      account: "",
      round: "",
      shares: "",
      walletWithdrawalShares: "",
      blockTimestamp: "",
    },
  ],
};

export const initExistingPosition__Display: ExistingPositionType__Display = {
  amount: 0,
  isLong: true,
  isCall: true,
  collateral: 0,
};
