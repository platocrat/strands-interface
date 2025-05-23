// Externals
import { BigNumber } from "ethers";
import { wei } from "@synthetixio/wei";
import { formatUnits } from "ethers/lib/utils.js";
import { getBlackScholesPrice } from "./blackScholes";
import { Board, Market, MarketParameters, Option } from "@lyrafinance/lyra-js";
// Locals
import { arbiLyra, opLyra } from "../lyra";
import { getMarketAddress } from "../../contract-apis/utils";
// Constants
import {
  UNIT,
  MAX_BN,
  INIT_ZERO,
  ARBITRUM_MAINNET_CHAIN_ID,
} from "../../utils/constants";
// Types
import { Web3UserType } from "../types";
import { cl } from "../misc";

export function fromBigNumber(
  number: BigNumber,
  decimals: number = 18
): number {
  const numberString = formatUnits(number.toString(), decimals);
  const _ = parseFloat(numberString);
  return _;
}

function getTimeToExpiryAnnualized(board: Board) {
  const daysInYear = 365;
  const timeToExpiry = board.timeToExpiry;
  const timeToExpiryAnnualized = timeToExpiry / (60 * 60 * 24 * daysInYear);
  return timeToExpiryAnnualized;
}

const getShockVol = (
  marketParams: MarketParameters,
  _timeToExpiry: number,
  isMaxMinCollateral?: boolean
) => {
  if (isMaxMinCollateral) {
    // Default to largest shock vol
    return marketParams.shockVolA;
  }
  const timeToExpiry = BigNumber.from(_timeToExpiry);
  if (timeToExpiry.lte(marketParams.shockVolPointA)) {
    return marketParams.shockVolA;
  }
  if (timeToExpiry.gte(marketParams.shockVolPointB)) {
    return marketParams.shockVolB;
  }

  const shockVolDiff = marketParams.shockVolA.sub(marketParams.shockVolB);
  const timeToMaturityShockVolPointA = timeToExpiry.sub(
    marketParams.shockVolPointA
  );
  return marketParams.shockVolA.sub(
    shockVolDiff
      .mul(timeToMaturityShockVolPointA)
      .div(marketParams.shockVolPointB.sub(marketParams.shockVolPointA))
  );
};

export const getMinStaticCollateral = (
  market: Market,
  isBaseCollateral?: boolean
) => {
  return isBaseCollateral
    ? market.params.minStaticBaseCollateral
    : market.params.minStaticQuoteCollateral;
};

export function getMinCollateralForSpotPrice(
  option: Option,
  size: BigNumber,
  spotPrice: BigNumber,
  isBaseCollateral?: boolean,
  // Use largest min collateral that will ever be required (informs liquidation price)
  isMaxMinCollateral?: boolean
): BigNumber {
  const timeToExpiry = option.board().timeToExpiry;
  const timeToExpiryAnnualized = getTimeToExpiryAnnualized(option.board());
  if (timeToExpiryAnnualized === 0) {
    return INIT_ZERO;
  }
  const market = option.market();
  const shockSpotPrice = option.isCall
    ? spotPrice.mul(market.params.callSpotPriceShock).div(UNIT)
    : spotPrice.mul(market.params.putSpotPriceShock).div(UNIT);
  const rate = option.market().params.rateAndCarry;
  const shockOptionPrice = wei(
    getBlackScholesPrice(
      timeToExpiryAnnualized,
      fromBigNumber(
        getShockVol(market.params, timeToExpiry, isMaxMinCollateral)
      ),
      fromBigNumber(shockSpotPrice),
      fromBigNumber(option.strike().strikePrice),
      fromBigNumber(rate),
      option.isCall
    )
  ).bn;

  let fullCollat: BigNumber;
  let volCollat: BigNumber;
  const staticCollat = getMinStaticCollateral(
    option.market(),
    isBaseCollateral
  );
  if (option.isCall) {
    if (isBaseCollateral) {
      volCollat = shockOptionPrice.mul(size).div(shockSpotPrice);
      fullCollat = size;
    } else {
      volCollat = shockOptionPrice.mul(size).div(UNIT);
      fullCollat = MAX_BN;
    }
  } else {
    volCollat = shockOptionPrice.mul(size).div(UNIT);
    fullCollat = option.strike().strikePrice.mul(size).div(UNIT);
  }
  const maxCollat = volCollat.gt(staticCollat) ? volCollat : staticCollat;
  const minCollat = maxCollat.lt(fullCollat) ? maxCollat : fullCollat;

  return minCollat;
}

export async function getSpotPrice(
  isArbi: boolean,
  web3User: Web3UserType,
  assetSymbol: string
): Promise<BigNumber | Error> {
  if (
    web3User.account.address === null ||
    web3User.account.address === undefined
  )
    return Error("Account not found!");

  let spotPrice_;

  const marketAddress = getMarketAddress(
    isArbi ? ARBITRUM_MAINNET_CHAIN_ID : web3User.chainId,
    assetSymbol
  );

  const market = await (isArbi ? arbiLyra : opLyra).market(marketAddress);

  spotPrice_ = market.spotPrice;
  return spotPrice_;
}
