// Externals
import {
  Market,
  Position,
  PositionState,
  SnapshotPeriod,
} from "@lyrafinance/lyra-js";
// Locals
import { opLyra, arbiLyra } from "../../lyra";
import { getApolloClient } from "../../subgraph/graphql/clients";
import { candlesQuery } from "../../subgraph/graphql/queries/synthetix-client";
// Misc utils
import { bnToNumber, cl, toBN } from "../../misc";
// Constants
import {
  initPortfolioMarket,
  initLyraOpenPosition,
  availableLyraMarkets,
  initLyraHistoricalPosition,
} from "../../constants";
// Types
import {
  LyraOpenPosition,
  PortfolioMarketType,
  LyraHistoricalPosition,
  SynthetixSpotPriceHistoryResult,
} from "../../types";
import { fromBigNumber } from "../../from-lyra";

export const lyraPositionUrlPrefix = "https://app.lyra.finance/#/position/";

export async function getLiveLyraMarkets(
  _isArbi: boolean
): Promise<PortfolioMarketType[]> {
  let liveMarkets = [initPortfolioMarket, initPortfolioMarket];

  const availableLyraMarkets_ =
    availableLyraMarkets[_isArbi ? "arbitrum" : "optimism"];

  for (let i = 0; i < availableLyraMarkets_.length; i++) {
    const market = availableLyraMarkets_[i];

    if (market.asset.assetName !== "Solana") {
      // Use `lyraMarket` to get current spot price, open interest, and volume
      const lyraMarket: Market = await (_isArbi ? arbiLyra : opLyra).market(
        market.address
      );

      // 1.) Set `asset`
      const assetName = _isArbi ? lyraMarket.name : market.asset.assetName;
      const assetSymbol = market.asset.assetSymbol;

      // 2.) Set `dailyPrice`
      const timestamp = lyraMarket.block.timestamp;
      const SECONDS_IN_DAY = 86400;
      const SECONDS_IN_MONTH = 2592000;

      const spotPriceHistory = await lyraMarket.spotPriceHistory({
        period: SnapshotPeriod.EightHours,
        startTimestamp: timestamp - SECONDS_IN_DAY,
      });
      const tradingVolumeHistory = await lyraMarket.tradingVolumeHistory({
        period: SnapshotPeriod.OneDay,
        startTimestamp: timestamp - SECONDS_IN_MONTH,
      });

      const totalNotionalVolume = fromBigNumber(
        tradingVolumeHistory[tradingVolumeHistory.length - 1]
          .totalNotionalVolume
      );

      const spotPrice = bnToNumber(lyraMarket.spotPrice);
      const spotPrice24HAgo = spotPriceHistory.length
        ? fromBigNumber(spotPriceHistory[0].close)
        : 0;
      const spotPrice24HChange = spotPrice24HAgo
        ? (spotPrice - spotPrice24HAgo) / spotPrice24HAgo
        : 0;

      const openInterest = fromBigNumber(lyraMarket.openInterest);

      const liveMarket: PortfolioMarketType = {
        asset: {
          assetName: assetName,
          assetSymbol: assetSymbol,
        },
        dailyPrice: {
          price: spotPrice,
          percentChange: spotPrice24HChange,
        },
        openInterest: {
          inUsd: openInterest * spotPrice,
          inBaseAsset: openInterest,
        },
        volume: totalNotionalVolume,
      };

      liveMarkets[i] = liveMarket;
    }
  }

  return liveMarkets;
}

export async function getOpenLyraPositions(
  _owner: string,
  _isArbi: boolean,
  _networkName: string
): Promise<LyraOpenPosition[]> {
  let openPositions: LyraOpenPosition[] = [initLyraOpenPosition];

  const openPositions_ = await (_isArbi ? arbiLyra : opLyra).openPositions(
    _owner
  );

  if (openPositions_.length === 0) return openPositions;

  openPositions_.forEach((position: Position, i: number): void => {
    let expiryDate: Date | string = new Date(position.expiryTimestamp * 1_000);
    expiryDate = expiryDate.toDateString();
    expiryDate = expiryDate.slice(
      expiryDate.indexOf(" "),
      expiryDate.indexOf(" ", 9)
    );

    const averageCost = position.averageCostPerOption();
    const unrealizedPnl = position.pnl().unrealizedPnl;
    const unrealizedPnlPercentage = position.pnl().unrealizedPnlPercentage;
    const currentPrice = position.pricePerOption;
    const equity = position.isLong
      ? position.pricePerOption.mul(position.size)
      : position.collateral?.value ?? toBN(0);

    const marketSlug = position.marketName.toLowerCase();
    const assetSymbol = `${position.marketName.slice(
      0,
      position.marketName.indexOf("-")
    )}`;
    const lyraPositionUrl = `${lyraPositionUrlPrefix}${_networkName}/${marketSlug}/${position.id}`;

    const position_: LyraOpenPosition = {
      owner: _owner,
      equity: equity,
      size: position.size,
      expiryDate: expiryDate,
      positionId: position.id,
      isLong: position.isLong,
      isCall: position.isCall,
      averageCost: averageCost,
      assetSymbol: assetSymbol,
      currentPrice: currentPrice,
      unrealizedPnl: unrealizedPnl,
      marketName: assetSymbol,
      lyraPositionUrl: lyraPositionUrl,
      strikePrice: position.strikePrice,
      unrealizedPnlPercentage: unrealizedPnlPercentage,
    };

    openPositions[i] = position_;
  });

  return openPositions;
}

export async function getLyraPositions(
  _owner: string,
  _isArbi: boolean
): Promise<LyraHistoricalPosition[]> {
  let positions: LyraHistoricalPosition[] = [initLyraHistoricalPosition];

  const positions_ = await (_isArbi ? arbiLyra : opLyra).positions(_owner);

  positions_.forEach((position: Position, i: number): void => {
    const {
      realizedPnl,
      realizedPnlPercentage,
      settlementPnl,
      settlementPnlPercentage,
    } = position.pnl();

    const pnl = position.isSettled ? settlementPnl : realizedPnl;
    const pnlPercentage = position.isSettled
      ? settlementPnlPercentage
      : realizedPnlPercentage;

    const size =
      position.trades().length > 0 ? position.trades()[0].size : position.size;

    const firstTrade = position.firstTrade();
    const lastTrade = position.lastTrade();
    const lastUpdatedTimestamp = position.isSettled
      ? position.expiryTimestamp
      : lastTrade?.timestamp ?? 0;

    let lastUpdatedDate: Date | string = new Date(lastUpdatedTimestamp * 1_000);

    const timeDiff =
      new Date().getTime() -
      (lastUpdatedTimestamp ? lastUpdatedTimestamp * 1000 : 0);
    const time = timeDiff / (1000 * 3600 * 24);

    lastUpdatedDate = lastUpdatedDate.toDateString();
    lastUpdatedDate = lastUpdatedDate.slice(
      lastUpdatedDate.indexOf(" "),
      lastUpdatedDate.indexOf(" ", 9)
    );

    // Get position status
    let status: PositionState | string = position.state;

    switch (status) {
      case 0:
        status = "EMPTY";
        break;
      case 1:
        status = "ACTIVE";
        break;
      case 2:
        status = "CLOSED";
        break;
      case 3:
        status = "LIQUIDATED";
        break;
      case 4:
        status = "SETTLED";
        break;
      case 5:
        status = "MERGED";
        break;
    }

    const openPrice = position.averageCostPerOption();
    const openSpotPrice = firstTrade?.spotPrice ?? toBN(0);

    const closePrice = position.isSettled
      ? 0
      : lastTrade?.pricePerOption ?? toBN(0);
    const closeSpotPrice = position.isSettled
      ? position.spotPriceAtExpiry ?? toBN(0)
      : lastTrade?.spotPrice ?? toBN(0);

    const marketSlug = position.marketName.toLowerCase();

    const assetSymbol = `${position.marketName.slice(
      0,
      position.marketName.indexOf("-")
    )}`;

    const lyraPositionUrl = `${lyraPositionUrlPrefix}${marketSlug}-susd&id=${position.id}`;

    const position_ = {
      pnl: pnl,
      timeNumber: time,
      // Use the closing trade for the size of the option
      size: size,
      openPrice: openPrice,
      closePrice: closePrice,
      marketName: assetSymbol,
      isLong: position.isLong,
      isCall: position.isCall,
      assetSymbol: assetSymbol,
      status: status as string,
      time: `${time.toFixed(0)}d`,
      pnlPercentage: pnlPercentage,
      openSpotPrice: openSpotPrice,
      closeSpotPrice: closeSpotPrice,
      lyraPositionUrl: lyraPositionUrl,
      strikePrice: position.strikePrice,
      lastUpdatedDate: lastUpdatedDate.slice(1),
    } as LyraHistoricalPosition;

    positions[i] = position_;
  });

  positions.sort((a, b) => (a.timeNumber as number) - (b.timeNumber as number));

  return positions;
}
