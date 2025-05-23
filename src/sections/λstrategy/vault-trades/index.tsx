// Externals
import { useAccount, useNetwork, useProvider } from "wagmi";
import { FC, useLayoutEffect, useMemo, useState } from "react";
// Locals
import { CardSection } from "../../strategies/table";
import VaultTradesHistoryTable from "./history/table";
import VaultTradesHeaderButtons from "./header-buttons";
import Spinner from "../../../components/Suspense/Spinner";
import { OuterCard } from "../../../components/ProductInfo";
import VaultTradesOpenPositionsTable from "./open-positions/table";
// Requests
import {
  getOpenLyraPositions,
  lyraPositionUrlPrefix,
} from "../../../utils/requests/portfolio";
import { apolloClient } from "../../../utils/subgraph";
// Subgraph utils
import { getTrades } from "../../../utils/subgraph/graphql/queries/lyra";
import { getApolloClient } from "../../../utils/subgraph/graphql/clients";
// Misc utils
import { toBN } from "../../../utils/misc";
// Types
import {
  Web3UserType,
  LyraOpenPosition,
  LyraHistoricalPosition,
} from "../../../utils/types";
// Constants
import {
  initLyraOpenPosition,
  initLyraHistoricalPosition,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// CSS
import { fonts } from "../../../theme/styles";
import { definitelyCentered } from "../../../theme/componentStyles";
import { getVaultStrategyAddress } from "../../../utils/one-clicks";

export type VaultTradesProps = {
  assetSymbol: string;
  vaultAddress: string;
  strategyName: string;
  suspense: {
    edIsLoading: boolean;
    chartDataLoaded: boolean;
  };
};

const isVault = true;

const VaultTrades: FC<VaultTradesProps> = ({
  suspense,
  assetSymbol,
  vaultAddress,
  strategyName,
}) => {
  const account = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  let web3User_: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  // boolean
  const [edIsLoading, setEdIsLoading] = useState<boolean>(false);
  const [viewOpenPositions_, setViewOpenPositions] = useState<boolean>(false);
  const [openPositionsLoaded, setOpenPositionsLoaded] =
    useState<boolean>(false);
  // Custom
  const [positions, setPositions] = useState<any[]>([
    initLyraHistoricalPosition,
  ]);
  const [openPositions, setOpenPositions] = useState<LyraOpenPosition[]>([
    initLyraOpenPosition,
  ]);

  const isDefaultOpenPosition = useMemo((): boolean => {
    if (
      openPositions[0].assetSymbol === initLyraOpenPosition.assetSymbol &&
      openPositions[0].positionId === initLyraOpenPosition.positionId &&
      openPositions[0].averageCost === initLyraOpenPosition.averageCost &&
      openPositions[0].currentPrice === initLyraOpenPosition.currentPrice &&
      openPositions[0].equity === initLyraOpenPosition.equity &&
      openPositions[0].expiryDate === initLyraOpenPosition.expiryDate &&
      openPositions[0].isCall === initLyraOpenPosition.isCall &&
      openPositions[0].lyraPositionUrl ===
        initLyraOpenPosition.lyraPositionUrl &&
      openPositions[0].marketName === initLyraOpenPosition.marketName &&
      openPositions[0].owner === initLyraOpenPosition.owner &&
      openPositions[0].size === initLyraOpenPosition.size
    ) {
      return true;
    } else {
      return false;
    }
  }, [openPositions[0].positionId, openPositions[0].assetSymbol]);
  const isDefaultPosition = useMemo((): boolean => {
    if (
      positions[0].assetSymbol === initLyraHistoricalPosition.assetSymbol &&
      positions[0].timeNumber === initLyraHistoricalPosition.timeNumber &&
      positions[0].isLong === initLyraHistoricalPosition.isLong &&
      positions[0].isCall === initLyraHistoricalPosition.isCall &&
      positions[0].lyraPositionUrl ===
        initLyraHistoricalPosition.lyraPositionUrl &&
      positions[0].strikePrice === initLyraHistoricalPosition.strikePrice
    ) {
      return true;
    } else {
      return false;
    }
  }, [positions[0].timeNumber, positions[0].assetSymbol]);

  // -------------------------------- Functions --------------------------------
  function viewAllPositions(): void {
    setViewOpenPositions(true);
  }

  function viewOpenPositions(): void {
    setViewOpenPositions(false);
  }

  // ------------------------------ Async functions ----------------------------
  async function getPositions(): Promise<void> {
    setEdIsLoading(true);

    const owner = await getVaultStrategyAddress(web3User_, strategyName);

    const tradeEd = await apolloClient(getApolloClient.lyra, getTrades, {
      first: 1000,
      orderBy: "timestamp",
      orderDirection: "desc",
      trader: typeof owner === "string" ? owner : undefined,
    });

    let positions_: any = [];

    tradeEd.trades.forEach((te) => {
      const size = toBN(te.size);
      const strikePrice = toBN(te.strike.strikePrice);
      const expiryTimestamp = te.board.expiryTimestamp;

      let lastUpdatedDate: Date | string = new Date(expiryTimestamp * 1000);
      lastUpdatedDate = lastUpdatedDate.toDateString();
      lastUpdatedDate = lastUpdatedDate.slice(
        lastUpdatedDate.indexOf(" "),
        lastUpdatedDate.indexOf(" ", 9)
      );

      const openPrice = toBN(te.pricePerOption);
      const openSpotPrice = toBN(te.spotPrice);
      const timestamp = parseFloat(te.timestamp);
      let time: Date | string = new Date(timestamp * 1000);
      time = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`;

      const marketSlug = assetSymbol.slice(1).toLowerCase();
      const lyraPositionUrl = `${lyraPositionUrlPrefix}${marketSlug}-susd&id=${te.position.positionId}#/position/${assetSymbol}-susd/${te.position.positionId}`;

      const position = {
        pnl: toBN("0"),
        timeNumber: time as string,
        // Use the closing trade for the size of the option
        size: size,
        openPrice: openPrice,
        closePrice: toBN("0"),
        isLong: te.isBuy,
        isCall: te.option.isCall,
        assetSymbol: assetSymbol,
        status: "",
        time: `${0}d`,
        pnlPercentage: toBN("0"),
        openSpotPrice: openSpotPrice,
        closeSpotPrice: toBN("0"),
        marketName: assetSymbol.slice(1),
        lyraPositionUrl: lyraPositionUrl,
        strikePrice: strikePrice,
        lastUpdatedDate: lastUpdatedDate,
      } as LyraHistoricalPosition;

      positions_.push(position);
    });

    positions_.length === 0
      ? setPositions([initLyraHistoricalPosition])
      : setPositions(positions_);

    setEdIsLoading(false);
  }

  async function getOpenPositions(): Promise<void> {
    setOpenPositionsLoaded(false);

    const owner = await getVaultStrategyAddress(web3User_, strategyName);
    const openPositions_ = await getOpenLyraPositions(
      owner,
      web3User_.provider.network.name as string
    );

    setOpenPositions(openPositions_);
    setOpenPositionsLoaded(true);
  }

  // ------------------------- useLayoutEffects --------------------------------
  useLayoutEffect(() => {
    const requests = [getPositions()];
    Promise.all(requests).then((response: any) => {});
  }, [viewOpenPositions_]);

  useLayoutEffect(() => {
    const requests = [getOpenPositions()];
    Promise.all(requests).then((response: any) => {});
  }, [viewOpenPositions_]);

  return (
    <>
      {suspense.chartDataLoaded && !suspense.edIsLoading ? (
        <>
          <CardSection style={{ marginTop: "24px" }}>
            <OuterCard>
              <div
                className="my-liquidity-section"
                style={{ marginBottom: "-44px" }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <h3 className="section-title">
                    {!viewOpenPositions_
                      ? `Vault Open Positions`
                      : "Vault Trade History"}
                  </h3>

                  <VaultTradesHeaderButtons
                    buttonHandlers={{
                      viewAllPositions: viewAllPositions,
                      viewOpenPositions: viewOpenPositions,
                    }}
                  />
                </div>
              </div>

              {viewOpenPositions_ ? (
                <>
                  {!isDefaultPosition ? (
                    <>
                      <VaultTradesHistoryTable
                        isVault={isVault}
                        positions={positions}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          padding: "12px 0px 24px 0px",
                          marginTop: "13px",
                          marginLeft: "27px",
                          marginBottom: "15px",
                          color: fonts.colors.transparent.white,
                        }}
                      >
                        {`There is no position history.`}
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  {!isDefaultOpenPosition ? (
                    <>
                      <VaultTradesOpenPositionsTable
                        isVault={isVault}
                        strategyName={strategyName}
                        openPositions={openPositions}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          marginTop: "13px",
                          marginLeft: "27px",
                          marginBottom: "15px",
                          padding: "12px 0px 24px 0px",
                          color: fonts.colors.transparent.white,
                        }}
                      >
                        {`There are no open positions.`}
                      </p>
                    </>
                  )}
                </>
              )}
            </OuterCard>
          </CardSection>
        </>
      ) : (
        <>
          <CardSection style={{ margin: "24px 0px" }}>
            <OuterCard>
              <div className="my-liquidity-section">
                <div style={{ ...definitelyCentered, padding: "45px" }}>
                  <Spinner style={{ height: "60px", width: "60px" }} />
                </div>
              </div>
            </OuterCard>
          </CardSection>
        </>
      )}
    </>
  );
};

export default VaultTrades;
