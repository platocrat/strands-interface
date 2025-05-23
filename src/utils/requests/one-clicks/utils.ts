// Externals
import { BigNumber } from "@ethersproject/bignumber";
import { Board, Market, Quote } from "@lyrafinance/lyra-js";
// Locals
// utils
import { lyra } from "../../lyra";
import { bnToNumber, cl } from "../../misc";
import { getLots } from "../../one-clicks";
import { TargetOption } from "../../types";
import { getLiveBoardsFromMarkeAddress } from "./customize";

export type Deltas = {
  minDelta: number;
  maxDelta: number;
  targetDelta: number;
};

export type DayExpiries = {
  minDaysToExpiry: number;
  maxDaysToExpiry: number;
  targetDayExpiry: number;
};

/**
 * @dev Returns the target `option` object that is closest to the `targetDelta`
 * @param _board
 * @param _deltas
 * @param _isCall
 * @returns `option`
 */
export function getTargetOption(
  _board: Board,
  _deltas: Deltas,
  _isCall: boolean
): TargetOption {
  let liveStrikes = _board.strikes(),
    targetStrikeIdIndex: number = 0,
    strikeDelta = 0,
    bestDelta = _deltas.minDelta,
    bestStrikeId: number | undefined = undefined,
    strikePrice: BigNumber = BigNumber.from("0"),
    option: any = {},
    noStrikeFound: boolean = false;

  for (let i = 0; i < liveStrikes.length; i++) {
    _isCall
      ? (strikeDelta = bnToNumber(liveStrikes[i].call().delta, 4))
      : (strikeDelta = 1 - bnToNumber(liveStrikes[i].call().delta, 4));

    if (strikeDelta > _deltas.minDelta && strikeDelta < _deltas.maxDelta) {
      const diffFromTargetDelta = Math.abs(strikeDelta - _deltas.targetDelta);
      const diffFromBestSoFar = Math.abs(bestDelta - _deltas.targetDelta);

      if (diffFromTargetDelta < diffFromBestSoFar) {
        bestStrikeId = Number(liveStrikes[i].__strikeData.strikeId);
        bestDelta = strikeDelta;
        targetStrikeIdIndex = i;
      }
    }
  }

  if (bestStrikeId === undefined) {
    noStrikeFound = true;
  } else {
    strikePrice = liveStrikes[targetStrikeIdIndex].strikePrice;
  }

  // construct `option` object
  option = {
    strikeId: bestStrikeId,
    strikeDelta: bestDelta,
    strikePrice: strikePrice,
    boardId: Number(_board.__boardData.boardId),
    expiry: new Date(_board.expiryTimestamp * 1000),
    isCall: _isCall,
    noStrikeFound: noStrikeFound,
  } as TargetOption;

  return option;
}

export function getOptionDetails(
  _board: Board,
  _strikeId: number,
  _isCall: boolean,
  _isLong: boolean
) {
  let liveStrikes = _board.strikes(),
    delta = 0,
    strikePrice: BigNumber = BigNumber.from("0"),
    option: any = {};

  _isCall
    ? (delta = bnToNumber(
        liveStrikes?.find((item) => item.id === _strikeId)?.call().delta ?? 0,
        4
      ))
    : (delta = Math.abs(
        bnToNumber(
          liveStrikes?.find((item) => item.id === _strikeId)?.put().delta ?? 0,
          4
        )
      ));

  strikePrice =
    BigNumber.from(
      liveStrikes?.find((item) => item.id === _strikeId)?.strikePrice
    ) ?? BigNumber.from("0");
  // construct `option` object
  const tempDate = new Date(_board.expiryTimestamp * 1000);

  option = {
    strikeId: _strikeId,
    strikeDelta: delta,
    strikePrice: strikePrice,
    boardId: Number(_board.__boardData.boardId),
    expiry: tempDate,
    isCall: _isCall,
    isLong: _isLong,
    noStrikeFound: false,
    size: 1,
  };

  return option;
}

/**
 * @dev Returns `board` object closest to the `targetDelta` and
 * `targetDayExpiry`
 * @param _ma Market address
 * @param _dayExpiries Contains `minDayToExpiry`, maxDayToExpiry`, and
 * `targetDayExpiry`
 * @returns `board`
 */
export async function getTargetBoard(
  _dayExpiries: DayExpiries,
  liveBoards: any = []
): Promise<any> {
  let tD = new Date(), // `targetDate`
    bestExpiry = new Date(),
    board = {},
    targetLiveBoardIndex: number = -1,
    bestBoardId: number | undefined = undefined;

  const msInSecs = 1000;
  const secondsInDay = 86_400;

  tD.setDate(new Date().getDate() + _dayExpiries.targetDayExpiry);

  for (let i = 0; i < liveBoards.length; i++) {
    // `expiryTimestamp`
    const eT = new Date(liveBoards[i].expiryTimestamp * msInSecs);
    const ttoE = liveBoards[i].timeToExpiry; // `timeToExpiry

    if (
      ttoE > _dayExpiries.minDaysToExpiry * secondsInDay &&
      ttoE < _dayExpiries.maxDaysToExpiry * secondsInDay
    ) {
      const diffFromTargetExpiry = Math.abs((eT as any) - (tD as any));
      const diffFromBestSoFar = Math.abs((bestExpiry as any) - (tD as any));

      if (diffFromTargetExpiry < diffFromBestSoFar) {
        bestBoardId = Number(liveBoards[i].__boardData.boardId);
        bestExpiry = new Date(eT);

        targetLiveBoardIndex = i;
      }
    }
  }

  board = liveBoards[targetLiveBoardIndex];
  return board;
}

/**
 * @dev Returns the bid and ask price of an option for a given `board` and
 * `strikeId`
 * @param _board Market board for the option
 * @param _strikeId
 * @param _isCall Whether the option is a call
 * @param _size Contract size, i.e. the lot size
 * @returns `marketMakerBidAsk` -- bid and ask price from the market maker's
 * perspective
 */
export function getOptionBidAsk(
  _board: Board,
  _strikeId: number,
  _isCall: boolean,
  _size: number = 1 // might be different for bitcoin
) {
  let size = getLots(_size);

  // Use `quoteSync()` to match use of `quoteAllSync()`
  const bidQuote = _board.quoteSync(_strikeId, _isCall, false, size);
  const askQuote = _board.quoteSync(_strikeId, _isCall, true, size);

  const bidPrice = bnToNumber(bidQuote.premium);
  const askPrice = bnToNumber(askQuote.premium);

  const optionBidAsk = { bid: bidPrice, ask: askPrice };
  //cl('getOptionBidAsk StrikeId=%s size=%s isCall=%s  bidAsk=%s|%s',_strikeId,size, _isCall,bidPrice,askPrice)
  return optionBidAsk;
}

/**
 * @dev Returns the quote price of an option for a given lot size
 */
export async function getOptionQuotePrice(
  _ma: string, // Market address
  _strikeId: number,
  _isCall: boolean,
  _isBuy: boolean,
  _size: number
): Promise<Quote> {
  const size = getLots(_size);
  const quote = await lyra.quote(_ma, _strikeId, _isCall, _isBuy, size);
  return quote;
}
