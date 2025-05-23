// Externals
import { Chain } from "wagmi";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
// Locals
// Constants
import {
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  vaultInputMin,
} from "./constants";
// Metadata
import {
  ethereumContracts__Backend,
  ethereumOneClicks__Backend,
} from "./globalMetadata";
// Enums
import { VaultButton__Enum } from "./enums";
// Types
import {
  Web3UserType,
  StatesAndBalances,
  VaultObjectType__Frontend,
} from "./types";
// CSS
import { fonts } from "../theme/styles";

const nFormatterLookup = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];

export function nFormatter(num: number, toFixed: number): string {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  let item = nFormatterLookup
    .slice()
    .reverse()
    .find((item): boolean => num >= item.value);

  return item
    ? (num / item.value).toFixed(toFixed).replace(rx, "$1") + item.symbol
    : num.toFixed(toFixed);
}

export function numberWithCommas(
  x: number,
  toFixed?: number | undefined
): string {
  return x.toFixed(toFixed ?? 2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @dev Returns contract address from the given `chain` object and contract
 *      address object, `caObj`
 * @param chain A chain object in a format supported by `wagmi`
 * @param caObj A contract object in a format defined by Strands
 * @returns Contract address
 */
export function getCA(
  chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined,
  sObj: VaultObjectType__Frontend
): string {
  let ctcAddress: any = "";

  switch (chain?.id) {
    case OPTIMISM_GOERLI_CHAIN_ID:
      ctcAddress = sObj.address.testnet;
      break;
    case OPTIMISM_MAINNET_CHAIN_ID:
      ctcAddress = sObj.address.mainnet;
      break;
    default:
      ctcAddress = sObj.address.mainnet; // default to mainnet address
  }

  return ctcAddress;
}

/**
 * @dev Returns a React component key for a `StrategyVault`
 */
export function strategyVaultReactKey(
  sObjIndex: number,
  chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined,
  sObj: VaultObjectType__Frontend
): string {
  return `${sObjIndex}-${getCA(chain, sObj)}`;
}

/**
 * @dev Finds and returns `strategyNameTitle` from `strategyNameKey`
 * @param strategyNameKey
 */
export function findStrategyNameTitle(strategyNameKey: string) {
  const strategyNameTitle =
    ethereumContracts__Backend.vaults[`${strategyNameKey}`].strategyName.title;

  return strategyNameTitle;
}

/**
 * @dev Finds and returns `strategyNameTitle` from `strategyNameKey`
 * @param strategyNameKey
 */
export function findOCStrategyNameTitle(strategyNameKey: string) {
  const strategyNameTitle =
    ethereumOneClicks__Backend[`${strategyNameKey}`].title;

  return strategyNameTitle;
}

/**
 * @dev Finds and returns `strategyNameTitle` from `strategyNameKey`
 * @param strategyNameKey
 */
export function findOCStrategyNameKey(strategyNameTitle: string) {
  const strategyNameKey =
    ethereumOneClicks__Backend[`${strategyNameTitle}`].key;

  return strategyNameKey;
}

/**
 * @dev Finds and returns `strategyNameKey` from `strategyNameTitle`
 * @param strategyNameTitle
 */
export function findStrategyNameKey(strategyNameTitle: string) {
  const strategyNameKey =
    ethereumContracts__Backend.vaults[`${strategyNameTitle}`].strategyName
      .title;

  return strategyNameKey;
}

export function getAssetName(assetSymbol: string): string | Error {
  let assetName = "";

  switch (assetSymbol) {
    case "sETH":
      assetName = "Ethereum";
      return assetName;
    case "sBTC":
      assetName = "Bitcoin";
      return assetName;
    case "sLINK":
      assetName = "Chainlink";
      return assetName;
    case "sSOL":
      assetName = "Solana";
      return assetName;
    default:
      throw Error("Asset name not found!");
  }
}

/**
 * @dev Used to format Recharts data inside of tooltip.
 * @param value
 * @param name
 * @param props
 * @returns `[formattedValue, formattedName, props]`
 */
export const formatter = (value, name, props) => {
  const formattedName = name;
  const formattedValue = value;
  return [formattedValue, formattedName, props];
};

/**
 * @dev Returns Ether amount from wei amount.
 */
export function formatETH(wei: any) {
  return ethers.utils.formatEther(wei);
}

export function updateRoute(
  _assetName: string,
  _assetSymbol: string,
  _isOneClicks: boolean
) {
  let path = "";

  _isOneClicks
    ? (path = `/one-clicks/${_assetName}-${_assetSymbol}`)
    : (path = `/vaults/${_assetName}-${_assetSymbol}`);

  return path;
}

export function toBN(_: number | string): BigNumber {
  return ethers.BigNumber.from(_);
}

export function formatNumber(num: number) {
  return `${num.toPrecision(2)}k`;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function web3UserIsUndefined(web3User: Web3UserType): boolean {
  if (
    web3User.account.address === undefined ||
    web3User.chainId === undefined ||
    web3User.provider === undefined
  ) {
    return true;
  } else {
    return false;
  }
}

export function cl(message?: any, ...optionalParams: any[]) {
  return console.log(message, ...optionalParams);
}

export function redirectToKwenta(e: any): void {
  e.preventDefault();
  window.open("https://kwenta.io/exchange", "popUpWindow");
}

/**
 * @param date
 * @returns Date as a string in `dd-MM-yyyy` format
 */
export function getFormattedDate(date: Date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return day + "/" + month + "/" + year;
}

export function bnToNumber(
  _: BigNumber | string | number,
  toFixed?: number | undefined,
  isFloored?: boolean | undefined
): number {
  const bnToNumber = (_: BigNumber | string | number): number =>
    isFloored && toFixed !== undefined
      ? floor(parseFloat(ethers.utils.formatUnits(_, 18)), toFixed)
      : parseFloat(ethers.utils.formatUnits(_, 18));

  let bnToNumber_ =
    parseFloat(_.toString()) < 1 && parseFloat(_.toString()) > 0.000001
      ? isFloored && toFixed
        ? floor(parseFloat(_.toString()), toFixed)
        : parseFloat(_.toString())
      : bnToNumber(
          BigNumber.isBigNumber(_)
            ? _.eq(0)
              ? 0
              : _.toString()
            : _ === "0"
            ? 0
            : _.toString()
        );

  bnToNumber_ = toFixed
    ? parseFloat(bnToNumber_.toFixed(toFixed))
    : bnToNumber_;
  return bnToNumber_;
}

export function fixedDecimals(
  _: BigNumber | string | number,
  toFixed?: number
): number | 4 | 2 {
  return BigNumber.isBigNumber(_) || typeof _ === "string"
    ? bnToNumber(_, 4) < 0.9
      ? toFixed ?? 4
      : 2
    : _ < 10
    ? toFixed ?? 4
    : 2;
}

export function floor(num: number, precision: number): number {
  let multiplier = Math.pow(10, precision || 0);
  return Math.floor(num * multiplier) / multiplier;
}

/**
 * @dev Converts a BigNumber, number, or string to a string representing a
 * price, formatted as either a negative or positive number.
 * @returns price
 */
export function formatPrice(
  _: BigNumber | string | number,
  isPnL?: boolean,
  toFixed?: number
): string {
  const priceFixedDecimals = bnToNumber(_, toFixed ?? fixedDecimals(_), true);

  return priceFixedDecimals.toString()[0] === "-"
    ? `-$${nFormatter(
        Math.abs(priceFixedDecimals),
        toFixed ?? fixedDecimals(_)
      )}`
    : `${isPnL ? "+" : ""}$${priceFixedDecimals}`;
}

export function getVaultButtonState(
  web3User: Web3UserType,
  statesAndBalances: StatesAndBalances,
  amount: BigNumber | number,
  shares: BigNumber,
  switch_: VaultButton__Enum,
  strategyName?: string
) {
  let state: any = "";

  if (web3UserIsUndefined(web3User)) {
    switch (switch_) {
      case VaultButton__Enum.TEXT:
        state = "Connect Your Wallet";
        break;
      case VaultButton__Enum.COLOR:
        state = fonts.colors.solid.pink;
        break;
      case VaultButton__Enum.DISABLED:
        state = true;
        break;
      case VaultButton__Enum.CURSOR:
        state = "not-allowed";
        break;
      case VaultButton__Enum.PINK_BUTTON:
        state = false;
        break;
    }
  } else {
    if (statesAndBalances.isDeposit) {
      if (
        BigNumber.isBigNumber(amount)
          ? amount.eq(0) ||
            parseFloat(amount.toString()) / 1e18 <= vaultInputMin
          : amount === 0 || amount <= vaultInputMin
      ) {
        switch (switch_) {
          case VaultButton__Enum.TEXT:
            state = "Enter Amount";
            break;
          case VaultButton__Enum.COLOR:
            state = "gray";
            break;
          case VaultButton__Enum.DISABLED:
            state = true;
            break;
          case VaultButton__Enum.CURSOR:
            state = "not-allowed";
            break;
          case VaultButton__Enum.PINK_BUTTON:
            state = false;
            break;
        }
      } else if (statesAndBalances.needMoreDepositAsset) {
        switch (switch_) {
          case VaultButton__Enum.TEXT:
            state = `Get ${strategyName === "coveredCall" ? "sETH" : "sUSD"}`;
            break;
          case VaultButton__Enum.COLOR:
            state = fonts.colors.solid.pink;
            break;
          case VaultButton__Enum.DISABLED:
            state = false;
            break;
          case VaultButton__Enum.CURSOR:
            state = "pointer";
            break;
          case VaultButton__Enum.PINK_BUTTON:
            state = true;
            break;
        }
      } else if (statesAndBalances.needGreaterAllowance) {
        switch (switch_) {
          case VaultButton__Enum.TEXT:
            state = `Approve ${
              strategyName === "coveredCall" ? "sETH" : "sUSD"
            }`;
            break;
          case VaultButton__Enum.COLOR:
            state = fonts.colors.solid.pink;
            break;
          case VaultButton__Enum.DISABLED:
            state = false;
            break;
          case VaultButton__Enum.CURSOR:
            state = "pointer";
            break;
          case VaultButton__Enum.PINK_BUTTON:
            state = true;
            break;
        }
      } else {
        switch (switch_) {
          case VaultButton__Enum.TEXT:
            state = "Deposit";
            break;
          case VaultButton__Enum.COLOR:
            state = fonts.colors.solid.pink;
            break;
          case VaultButton__Enum.DISABLED:
            state = false;
            break;
          case VaultButton__Enum.CURSOR:
            state = "pointer";
            break;
          case VaultButton__Enum.PINK_BUTTON:
            state = true;
            break;
        }
      }
    } else {
      if (statesAndBalances.canCompleteWithdrawal) {
        switch (switch_) {
          case VaultButton__Enum.TEXT:
            state = "Complete Withdrawal";
            break;
          case VaultButton__Enum.COLOR:
            state = fonts.colors.solid.pink;
            break;
          case VaultButton__Enum.DISABLED:
            state = false;
            break;
          case VaultButton__Enum.CURSOR:
            state = "pointer";
            break;
          case VaultButton__Enum.PINK_BUTTON:
            state = true;
            break;
        }
      } else {
        if (statesAndBalances.hasPendingWithdrawal) {
          switch (switch_) {
            case VaultButton__Enum.TEXT:
              state = "Pending Withdrawal";
              break;
            case VaultButton__Enum.COLOR:
              state = fonts.colors.solid.mdPink;
              break;
            case VaultButton__Enum.DISABLED:
              state = true;
              break;
            case VaultButton__Enum.CURSOR:
              state = "not-allowed";
              break;
            case VaultButton__Enum.PINK_BUTTON:
              state = false;
              break;
          }
        } else {
          if (
            BigNumber.isBigNumber(amount)
              ? amount.eq(0) ||
                parseFloat(amount.toString()) / 1e18 <= vaultInputMin
              : amount === 0 || amount <= vaultInputMin
          ) {
            switch (switch_) {
              case VaultButton__Enum.TEXT:
                state = "Enter Amount";
                break;
              case VaultButton__Enum.COLOR:
                state = "gray";
                break;
              case VaultButton__Enum.DISABLED:
                state = true;
                break;
              case VaultButton__Enum.CURSOR:
                state = "not-allowed";
                break;
              case VaultButton__Enum.PINK_BUTTON:
                state = false;
                break;
            }
          } else {
            if (
              BigNumber.isBigNumber(amount)
                ? parseFloat(amount.toString()) / 1e18 <=
                  parseFloat(shares.toString()) / 1e18
                : amount <= parseFloat(shares.toString()) / 1e18
            ) {
              switch (switch_) {
                case VaultButton__Enum.TEXT:
                  state = "Start Withdrawal";
                  break;
                case VaultButton__Enum.COLOR:
                  state = fonts.colors.solid.pink;
                  break;
                case VaultButton__Enum.DISABLED:
                  state = false;
                  break;
                case VaultButton__Enum.CURSOR:
                  state = "pointer";
                  break;
                case VaultButton__Enum.PINK_BUTTON:
                  state = true;
                  break;
              }
            } else {
              switch (switch_) {
                case VaultButton__Enum.TEXT:
                  state = "Insufficient Shares!";
                  break;
                case VaultButton__Enum.COLOR:
                  state = fonts.colors.solid.pink;
                  break;
                case VaultButton__Enum.DISABLED:
                  state = true;
                  break;
                case VaultButton__Enum.CURSOR:
                  state = "not-allowed";
                  break;
                case VaultButton__Enum.PINK_BUTTON:
                  state = false;
                  break;
              }
            }
          }
        }
      }
    }
  }

  return state;
}

export const debounce = (fn: any, delay: number): ((...args: any) => void) => {
  let timer: any = null;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export function debugLog(
  componentName: string,
  functionName: string,
  variableName: string,
  variable: any,
  options?: {
    additionalContext?: string;
    variableAsOtherType?: any;
    nameOfOtherType?: string;
  }
): void {
  const variableAsOtherTypeText = options?.variableAsOtherType
    ? `\n Or, as ${options.nameOfOtherType} = `
    : "";
  const variableAsOtherType = options?.variableAsOtherType
    ? options.variableAsOtherType
    : "";

  return console.log(
    `Debug log at`,
    `${new Date().toUTCString()}, where: \n`, // log current date time as a marker
    `1) Component: <${componentName}>`,
    `\n 2) Function: ${functionName}`,
    options ? `\n 3) Additional context: ${options.additionalContext}` : "",
    `\n ${options ? 4 : 3}) Variable: ${variableName} = `,
    variable,
    variableAsOtherTypeText,
    variableAsOtherType
  );
}

// ----------------------------------- Cookies ---------------------------------
export function setCookie(name: string, value: string, days: number): void {
  let expires = "";

  if (days) {
    let date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name: string): string | undefined {
  let nameEQ = name + "=",
    ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) === " ") c = c.substring(1, c.length);

    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return undefined;
}

export function eraseCookie(name: string): void {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
