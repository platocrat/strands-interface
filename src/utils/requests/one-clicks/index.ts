// Externals
import { ethers } from "ethers";
import { Board, Market } from "@lyrafinance/lyra-js";
import { lyra } from "../../lyra";
// Locals
import { getTargetBoard, getTargetOption, getOptionBidAsk } from "./utils";
import { bnToNumber } from "../../misc";
// Constants
import {
  dayExpiries30,
  ocStrategyConfigs,
  initOCNotFound,
} from "../../constants";
// Types
import {
  ocType,
  TargetOption,
  CachedBoardsType,
  CachedTargetOptionsType,
} from "../../types";
// Utils

export async function getStrategyBidAsk(ma, legs, size = 0) {
  let bid: number = 0;
  let ask: number = 0;
  const market: Market = await lyra.market(ma);
  if (legs.length === 1) {
    return { bid, ask };
  }
  await Promise.all(
    legs.map((leg) => {
      let optionBidAsk = { bid: 0, ask: 0 };
      if (leg.boardId > 0 && leg.strikeId > 0) {
        optionBidAsk = getOptionBidAsk(
          market.liveBoard(leg.boardId),
          leg.strikeId,
          leg.isCall,
          size || leg.size
        );
      }
      bid += leg.isLong ? optionBidAsk.bid : -optionBidAsk.ask;
      ask += leg.isLong ? optionBidAsk.ask : -optionBidAsk.bid;
      return true;
    })
  );
  //cl("getStrategyBidAsk legs=%s", JSON.stringify(legs));

  return { bid, ask };
}

export async function getDefaultOCOs(
  _ma: string,
  liveBoards
): Promise<ocType[]> {
  console.log("getDefaultOCOs");
  let oneClickObjs: ocType[] = [], // main global variable
    board: Board;

  const keys = Object.keys(ocStrategyConfigs);
  let cachedBoards: CachedBoardsType = {};

  if (dayExpiries30.targetDayExpiry in Object.keys(cachedBoards)) {
    board = cachedBoards[dayExpiries30.targetDayExpiry] as Board;
  } else {
    console.log("no target board in cache");
    board = await getTargetBoard(dayExpiries30, liveBoards); // http request
    // If we find a board, cache it
    if (typeof board === "object") {
      cachedBoards[dayExpiries30.targetDayExpiry] = board;
    } else {
      // If board not found
      keys.forEach((key: string) => {
        oneClickObjs.push({ ...initOCNotFound, strategyName: key });
      });

      return oneClickObjs;
    }
  }

  // O(n) for `n` strategies
  await Promise.all(
    keys.map(async (strategyName, i): Promise<void> => {
      let legs: any = [],
        options: any = [];

      const ocStrategyConfig = ocStrategyConfigs[strategyName];
      let noStrikeFound = true;
      for (let j = 0; j < ocStrategyConfig.length; j++) {
        board = await getTargetBoard(ocStrategyConfig[j][3], liveBoards); // http request

        let isCall = ocStrategyConfig[j][1];
        let deltas = ocStrategyConfig[j][2];

        options[j] = getTargetOption(board, deltas, isCall) as TargetOption;

        let leg = {
          strikeId: options[j].strikeId,
          strikeDelta: options[j].strikeDelta,
          strikePrice: options[j].strikePrice,
          boardId: board.id,
          expiry: options[j].expiry,
          isCall: isCall,
          noStrikeFound: options[j].strikeId == 0,
          isLong: ocStrategyConfig[j][0],
          size: 1,
        };
        if (options[j].strikeId > 0) {
          noStrikeFound = false;
        }
        legs.push(leg);
      }

      let oneClickObj_ = {
        strategyName: strategyName,
        isActive: true,
        legs: legs,
        bidPrice: 0, //strategyBidAsk.bid,
        askPrice: 0, //strategyBidAsk.ask,
        noStrikeFound: !options.every(
          (option: TargetOption): boolean => option.strikeId > 0
        ),
      };

      oneClickObjs[i] = oneClickObj_;
    })
  );

  return oneClickObjs;
}
