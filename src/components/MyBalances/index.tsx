// Externals
import { FC } from "react";
// Locals
import Spinner from "../Suspense/Spinner";
import { OuterCard } from "../ProductInfo";
import { SVGWrapper } from "../Lists/RowRightSide";
import { CardSection } from "../../sections/strategies/table";
// Misc
import {
  bnToNumber,
  fixedDecimals,
  formatETH,
  nFormatter,
} from "../../utils/misc";
// Props
import { MyBalancesProps } from "../../utils/props";
// CSS
import { fonts } from "../../theme/styles";
import { definitelyCentered } from "../../theme/componentStyles";
// Images
import { ReactComponent as InfoIconSVG } from "../../assets/svg/info-icon-pink.svg";
import { ARBITRUM_MAINNET_CHAIN_ID } from "../../utils/constants";
// import StakedLyraToken from '../../assets/png/token-logos/staked-lyra-token.png'

const MyBalances: FC<MyBalancesProps> = ({
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
  return (
    <>
      {suspense.chartDataLoaded && !suspense.edIsLoading ? (
        <>
          <CardSection style={{ marginBottom: "25px" }}>
            <OuterCard>
              <div className="my-liquidity-section">
                <h3 className="section-title">{`My Balances`}</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    margin: "24px 0px",
                  }}
                >
                  <div>
                    <p className="stats-name">{`Current Vault Shares`}</p>
                    <p
                      className="section-subtitle"
                      style={{ fontSize: fonts.sizes.biggieSmalls }}
                    >
                      {`${nFormatter(
                        suspense.txConfirmed
                          ? bnToNumber(vault.shares.add(vault.withdrawalShares))
                          : eventData.currentVaultShares,
                        4
                      )} Shares`}
                    </p>
                  </div>
                  <div>
                    <p className="stats-name">{`Pending Deposits`}</p>
                    <p
                      className="section-subtitle"
                      style={{ fontSize: fonts.sizes.biggieSmalls }}
                    >
                      {`${
                        suspense.txConfirmed
                          ? vault.depositReceipts.round ===
                            eventData.currentRound
                            ? nFormatter(
                                parseFloat(
                                  formatETH(vault.depositReceipts.amount)
                                ),
                                2
                              )
                            : 0
                          : parseFloat(
                              eventData.pendingDeposits.toFixed(
                                fixedDecimals(eventData.pendingDeposits)
                              )
                            )
                      } ${
                        vaultName === "coveredCall" ? wrappedSymbol : quoteAsset
                      } ${
                        vaultName === "coveredCall"
                          ? `($${
                              suspense.txConfirmed
                                ? (
                                    (parseFloat(
                                      vault.depositReceipts.amount.toString()
                                    ) /
                                      1e18) *
                                    vault.underlyingPrice
                                  ).toFixed(2)
                                : (
                                    eventData.pendingDeposits *
                                    vault.underlyingPrice
                                  ).toFixed(2)
                            })`
                          : ""
                      }`}
                    </p>
                  </div>
                  <div className="my-liquidity-boosted-apy-section">
                    <p className="stats-name">{`Pending Withdrawals`}</p>
                    <p
                      className="section-subtitle"
                      style={{
                        width: "120x",
                        fontSize: fonts.sizes.biggieSmalls,
                      }}
                    >
                      {`${
                        suspense.txConfirmed
                          ? nFormatter(bnToNumber(vault.withdrawalShares), 5)
                          : eventData.pendingWithdrawals.toFixed(
                              fixedDecimals(eventData.pendingWithdrawals)
                            )
                      } Shares`}
                    </p>
                  </div>
                </div>

                <div className="my-liquidity-bottom-section">
                  <div className="my-liquidity-boosted-apy-section">
                    <p className="stats-name">{`Boosted Reward APY`}</p>
                    <div className="my-liquidity-boosted-apy-value-section">
                      <div className="my-liquidity-boosted-apy-images">
                        <div
                          style={{
                            width: "38.4px",
                            height: "auto",
                            display: "flex",
                          }}
                        >
                          {/* <img
                            style={ {
                              width: '24px',
                              height: '24px',
                              minWidth: '24px',
                              minHeight: '24px',
                              maxWidth: '100%',
                              // margin: '0px 0px 0px -9.6px',
                            } }
                            alt='Optimism Token Logo'
                            src='https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.svg'
                          /> */}
                        </div>
                        <p
                          className="my-liquidity-boosted-apy-amount"
                          style={{
                            marginLeft: "-38px",
                            color: fonts.colors.solid.white,
                          }}
                        >
                          {`TBA`}
                        </p>
                      </div>
                      <SVGWrapper>
                        <InfoIconSVG />
                      </SVGWrapper>
                    </div>
                  </div>

                  <div>
                    <p className="stats-name">{`Pending Rewards`}</p>
                    <div className="my-liquidity-pending-rewards-value-section">
                      <div className="my-liquidity-pending-rewards-value-wrapper">
                        {/* <img
                          style={ {
                            width: '24px',
                            height: '24px',
                            minWidth: '24px',
                            minHeight: '24px',
                            maxWidth: '100%',
                            margin: '0px 0px 0px 0px',
                          } }
                          alt='Optimism Token Logo'
                          src='https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.svg'
                        /> */}
                        <p
                          className="my-liquidity-pending-rewards-amount"
                          style={{
                            marginLeft: "0px",
                            color: fonts.colors.solid.white,
                          }}
                        >
                          {`-`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </OuterCard>
          </CardSection>
        </>
      ) : (
        <>
          <CardSection style={{ marginBottom: "25px" }}>
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

export default MyBalances;
