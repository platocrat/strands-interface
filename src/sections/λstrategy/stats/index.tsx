// Externals
import { FC } from "react";
import styled from "@emotion/styled";
// Locals
import { CardSection } from "../../strategies/table";
import Spinner from "../../../components/Suspense/Spinner";
import { OuterCard } from "../../../components/ProductInfo";
// Misc
import { cl, nFormatter, numberWithCommas } from "../../../utils/misc";
// Props
import { GeneralSectionProps } from "../../../utils/props";
// CSS
import { fonts } from "../../../theme/styles";
import { definitelyCentered } from "../../../theme/componentStyles";
import { ARBITRUM_MAINNET_CHAIN_ID } from "../../../utils/constants";
// Images
// import {
//   ReactComponent as CellTooltipSVG
// } from '../../../assets/svg/cell-tooltip.svg'
// import StrandsRewardsToken from '../../../assets/png/token-logos/strands-rewards-token.png'

const Stats: FC<GeneralSectionProps> = ({
  vault,
  web3User,
  suspense,
  eventData,
  assetSymbol,
  vaultName,
}) => {
  const wrappedSymbol =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + assetSymbol;
  const quoteAsset =
    web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "USDC" : "sUSD";
  const totalPending_ = `${nFormatter(
    suspense.txConfirmed ? vault.totalPending : eventData.totalPendingDeposits,
    4
  )} ${vaultName === "coveredCall" ? wrappedSymbol : quoteAsset}`;

  const totalPendingInUSD =
    vaultName === "coveredCall"
      ? `($${numberWithCommas(
          (suspense.txConfirmed
            ? vault.totalPending
            : eventData.totalPendingDeposits) * vault.underlyingPrice
        )})`
      : "";

  const pricePerShare_ = `${nFormatter(eventData.pricePerShare, 4)} 
  ${vaultName === "coveredCall" ? wrappedSymbol : quoteAsset}`;

  const pricePerShareInUSD =
    vaultName === "coveredCall"
      ? `($${numberWithCommas(
          eventData.pricePerShare * vault.underlyingPrice
        )})`
      : "";

  return (
    <>
      {/* Stats section */}
      <CardSection>
        <OuterCard>
          {suspense.chartDataLoaded && !suspense.edIsLoading ? (
            <>
              <StatsWrapper>
                <div className="section-title">{`Vault Stats`}</div>

                <StatsContent
                  style={{
                    marginTop: "24px",
                    marginBottom: "24px",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  }}
                >
                  <StatsCell>
                    <div className="stats-name">{`Round Status`}</div>
                    <div
                      className="stats-value"
                      style={{
                        color:
                          fonts.colors.solid[
                            eventData.roundStatus === "IN PROGRESS"
                              ? "green"
                              : eventData.roundStatus === "NEW"
                              ? "lightBlue"
                              : "red"
                          ],
                      }}
                    >
                      {`${eventData.roundStatus}`}
                    </div>
                  </StatsCell>
                  <StatsCell>
                    <div className="stats-name">{`Round Ends`}</div>
                    <div className="stats-value">
                      {eventData.roundStatus === "IN PROGRESS"
                        ? eventData.roundEnds
                        : "-"}
                    </div>
                  </StatsCell>
                  <StatsCell>
                    <div className="stats-name">{`Total Pending Deposits`}</div>
                    <div className="stats-value">
                      {`${
                        vault.totalPending === undefined ||
                        isNaN(vault.totalPending)
                          ? "$0"
                          : `${totalPending_} ${totalPendingInUSD}`
                      }`}
                    </div>
                  </StatsCell>
                  <StatsCell>
                    <div className="stats-name">{`Price Per Share`}</div>
                    <div className="stats-value">
                      {`${pricePerShare_} ${pricePerShareInUSD}`}
                    </div>
                  </StatsCell>
                </StatsContent>

                <div
                  className="stats-name"
                  style={{
                    marginBottom: "24px",
                    fontSize: fonts.sizes.mdLg,
                    color: fonts.colors.solid.white,
                  }}
                >
                  {`Greeks`}
                </div>

                <StatsContent>
                  <StatsCell>
                    <div className="stats-name">{`Net Delta`}</div>
                    <div className="stats-value">
                      {/* { `${netDelta} sUSD` }  */}
                      {`-`}
                    </div>
                  </StatsCell>
                  <StatsCell>
                    <div className="stats-name">{`Net Gamma`}</div>
                    <div className="stats-value">
                      {/* { `${netGamma} sUSD` }  */}
                      {`-`}
                    </div>
                  </StatsCell>
                  <StatsCell>
                    <div className="stats-name">{`Net Theta`}</div>
                    <div className="stats-value">
                      {/* { `${netTheta} sUSD` }  */}
                      {`-`}
                    </div>
                  </StatsCell>
                  <StatsCell>
                    <div className="stats-name">{`Net Vega`}</div>
                    <div className="stats-value">
                      {/* { `${netVega} sUSD` } */}
                      {`-`}
                    </div>
                  </StatsCell>
                </StatsContent>
              </StatsWrapper>
            </>
          ) : (
            <>
              <div style={{ ...definitelyCentered, padding: "45px" }}>
                <Spinner style={{ height: "60px", width: "auto" }} />
              </div>
            </>
          )}
        </OuterCard>
      </CardSection>
    </>
  );
};

const TooltipWrapper = styled.div`
  margin: 0px 0px 0px 4px;
  padding-bottom: 1px;
  width: 14px;
  height: 14px;
  color: #6b7d94;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
`;

const StatsCell = styled.div`
  flex-direction: column;
  display: flex;
`;

const StatsContent = styled.div`
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 24px;
  display: grid;
`;

const StatsWrapper = styled.div`
  border-bottom: 0px solid transparent;
  border-right: 0px solid transparent;
  border-bottom-width: 3px;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  flex-direction: column;

  border-radius: 28px;

  padding: 24px;
  display: flex;
`;

export default Stats;
