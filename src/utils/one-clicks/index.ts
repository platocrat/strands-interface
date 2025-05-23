// Externals
import { ethers } from "ethers";
import { wei } from "@synthetixio/wei";
import { BigNumber } from "@ethersproject/bignumber";
import {
  Board,
  Quote,
  QuoteDisabledReason,
  Strike,
} from "@lyrafinance/lyra-js";
// Locals
import { bnToNumber } from "../misc";
import { Web3UserType } from "../types";
import { strategy } from "../../contract-apis/apis/strandsLyraVault";

/**
 * @dev Returns the lot size for the desired option to trade.
 * @param lotSize Size of the option to trade
 */
export const getLots = (lotSize: number): BigNumber => {
  if ((lotSize as any) === "") {
    return wei(0).bn;
  } else {
    const numLotsBN = wei(`${lotSize}`);
    const numLotsInWei = numLotsBN.mul(ethers.constants.WeiPerEther);
    return numLotsInWei.bn;
  }
};

export const areExpiriesEqual = (expiries: string[]) => {
  return expiries.every((expiry: string): boolean => expiry === expiries[0]);
};

export const areStrikesEqual = (strikes: (string | number | BigNumber)[]) => {
  return strikes.every((strike: string | number | BigNumber): boolean =>
    // either `strikePrice as string | BigNumber` or `strikeId as number`
    BigNumber.isBigNumber(strike)
      ? bnToNumber(strike, 2) === bnToNumber(strikes[0], 2)
      : strike === strikes[0]
  );
};

/**
 * @dev `i`s `f`irst `p`air `e`qual and `s`econd `p`air `e`qual
 */
export const ifpespe = (_array?: (string | number | BigNumber)[]) => {
  if (_array) {
    return _array[0] === _array[1] && _array[2] === _array[3];
  } else {
    throw Error(`No array detected!`);
  }
};

export type StrikeQuotesNullable = {
  callBid: Quote | null;
  callAsk: Quote | null;
  putBid: Quote | null;
  putAsk: Quote | null;
  strike: Strike;
};

// strikes to ignore
export type IgnoreStrike = {
  marketName: string;
  strikeId: number;
};

const IGNORE_STRIKE_LIST: IgnoreStrike[] = [
  {
    marketName: "btc",
    strikeId: 36,
  },
];

const getIsQuoteHidden = (disabledReason: QuoteDisabledReason): boolean => {
  switch (disabledReason) {
    case QuoteDisabledReason.InsufficientLiquidity:
      return false;
    default:
      return true;
  }
};

export function useBoardQuotesSync(
  board: Board,
  size: BigNumber
): StrikeQuotesNullable[] | any[] {
  const market = board.market();
  // return useMemo(
  //   () =>
  //     board.quoteAllSync(size).strikes.map(({ callBid, callAsk, putBid, putAsk, strike }) => {
  //       const quoteStrikeId = strike.id
  //       const isIgnored = !!IGNORE_STRIKE_LIST.find(
  //         ({ strikeId, marketName }) =>
  //           quoteStrikeId === strikeId && market.name.toLowerCase() === marketName.toLowerCase()
  //       )
  //       if (isIgnored) {
  //         return {
  //           callBid: null,
  //           callAsk: null,
  //           putBid: null,
  //           putAsk: null,
  //           strike,
  //         }
  //       }
  //       const hideCallBid = callBid.disabledReason ? getIsQuoteHidden(callBid.disabledReason) : false
  //       const hideCallAsk = callAsk.disabledReason ? getIsQuoteHidden(callAsk.disabledReason) : false
  //       const hidePutBid = putBid.disabledReason ? getIsQuoteHidden(putBid.disabledReason) : false
  //       const hidePutAsk = putAsk.disabledReason ? getIsQuoteHidden(putAsk.disabledReason) : false
  //       return {
  //         callBid: !hideCallBid ? callBid : null,
  //         callAsk: !hideCallAsk ? callAsk : null,
  //         putBid: !hidePutBid ? putBid : null,
  //         putAsk: !hidePutAsk ? putAsk : null,
  //         strike,
  //       }
  //     }),
  //   [board, market, size]
  // )
  return [];
}

export function filterNulls<TValue>(
  array: (TValue | null | undefined)[]
): TValue[] {
  return array.filter(
    (val: TValue | null | undefined) => val !== null && val !== undefined
  ) as TValue[];
}

/**
 * @dev Gets the strategy address of the given vault strategy.
 * Uses `sessionStorage` to keep track o the user's session
 */
export async function getVaultStrategyAddress(
  web3User: Web3UserType,
  strategyName: string
): Promise<string> {
  let owner: string | Error = "";

  const key = `${strategyName}-strategy-address`;

  if (sessionStorage.getItem(key) !== null) {
    // Restore the cached address
    owner = sessionStorage.getItem(key) as string;
  } else {
    owner = await strategy(web3User, strategyName);
    sessionStorage.setItem(key, `${owner}`);
  }

  return owner as string;
}
