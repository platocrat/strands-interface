// Externals
import { FC, useEffect, useLayoutEffect, useState } from "react";
// Locals
import Nav from "../../components/Nav";
import Header from "../../components/Header";
import PageLock from "../../components/PageLock";
import Spinner from "../../components/Suspense/Spinner";
import { OuterCard } from "../../components/ProductInfo";
import StrategyTable from "../../components/Tables/StrategyTable";
// Sections
import { CardSection, TableSection } from "../../sections/strategies/table";
// Subgraph utils
import {
  apolloClient,
  getRoundStatus,
  getCurrentTotalValueLocked,
  getUniqueUserCount,
} from "../../utils/subgraph";
import { getApolloClient } from "../../utils/subgraph/graphql/clients";
// Subgraph queries
import {
  getLasts,
  getDeposits,
} from "../../utils/subgraph/graphql/queries/vaults";
import { DepositEvent, GeneralVaultEventType } from "../../utils/types";

// Requests
import { getAndSetAssetPrice } from "../../utils/requests";
// Styled components
import {
  RightArrowSVGWrapper,
  RightArrowSVGContent,
} from "../../sections/one-clicks/one-click";
import { MainPageSection } from "../vaults";
import { StyledLink } from "../../sections/strategies/strategy";
// Misc utils
import { numberWithCommas, cl } from "../../utils/misc";
// CSS
import { fonts } from "../../theme/styles";
import { definitelyCentered } from "../../theme/componentStyles";
// Images
import { ReactComponent as RightArrowSVG } from "../../assets/svg/right-arrow-short.svg";
import { OPTIMISM_MAINNET_CHAIN_ID } from "../../utils/constants";
import { useNetwork } from "wagmi";

export type HomeProps = {};

const welcomeNewsTitle = `Welcome to Strands.`;
const welcomeNewsDescription = `Enjoy!`;
const startTradingButtonText = `Start Trading`;

const Home: FC<HomeProps> = ({ }) => {
  const { chain } = useNetwork()
  // booleans
  const [edIsLoading, setEdIsLoading] = useState<boolean>(false);
  const [showWelcomeSection, setShowWelcomeSection] = useState(true);
  const [isAssetPriceLoading, setIsAssetPriceLoading] =
    useState<boolean>(false);
  // numbers
  const [strandsGlobalTVL, setStrandsGlobalTVL] = useState<number>(0);
  const [currentAssetPrice, setCurrentAssetPrice] = useState<number>(0);
  const [volatilityTradingTVL, setVolatilityTradingTVL] = useState<number>(0);
  const [volatilityTradingCUB, setVolatilityTradingCUB] = useState<number>(0);

  const startTradingButtonPath = "/one-clicks/Ethereum-sETH";
  const networkName = chain?.id === OPTIMISM_MAINNET_CHAIN_ID
    ? 'optimism'
    : 'arbitrum'

  function handleCloseWelcomeMessage(): void {
    setShowWelcomeSection(false);
    localStorage.setItem(`hasDismissedMessage`, `true`);
  }

  async function getEthPrice(): Promise<void> {
    getAndSetAssetPrice(10, "Ethereum".toLowerCase(), setCurrentAssetPrice);
  }

  async function getVolatilityTradingSummary(): Promise<void> {
    setEdIsLoading(true);

    let TVL_ = 0;
    let CUB_ = 0;

    const vaultNames = ["longGamma", "shortGamma", "coveredCall"];

    await Promise.all(
      vaultNames.map(async (vaultName, i: number): Promise<void> => {
        const generalEd: GeneralVaultEventType = await apolloClient(
          getApolloClient[networkName].vaults[vaultName],
          getLasts,
          {
            first: 1,
            orderBy: "blockTimestamp",
            orderDirection: "desc",
          }
        );
        const depositsEd: GeneralVaultEventType = await apolloClient(
          getApolloClient[networkName].vaults[vaultName],
          getDeposits
        );

        const _roundStatus = getRoundStatus(generalEd);
        let vaultTVL = getCurrentTotalValueLocked(generalEd, _roundStatus);
        let vaultCUB = getUniqueUserCount(depositsEd);

        if (vaultName === "coveredCall") {
          vaultTVL = vaultTVL * currentAssetPrice;
        }

        //cl('%s vault CUB=%s TVL=%s', vaultName,vaultCUB,vaultTVL)
        TVL_ += vaultTVL;
        CUB_ += vaultCUB;
      })
    );

    setVolatilityTradingTVL(TVL_);
    setVolatilityTradingCUB(CUB_);
    /**
     * @todo Global TVL must be a sum of every instrument/product
     */
    setStrandsGlobalTVL(TVL_);
    setEdIsLoading(false);
  }

  // First, fetch underlying spot price
  useLayoutEffect(() => {
    const timeout = 2_000;

    setIsAssetPriceLoading(true);

    const requests = [getEthPrice()];
    Promise.all(requests).then((response: any) => { });

    const ethPriceTimeout = setTimeout(() => {
      setIsAssetPriceLoading(false);
    }, timeout);

    return () => {
      clearTimeout(ethPriceTimeout);
    };
  }, []);

  useLayoutEffect(() => {
    const hasDismissedMessage = localStorage.getItem(`hasDismissedMessage`);

    if (hasDismissedMessage === undefined || hasDismissedMessage === null) {
      setShowWelcomeSection(true);
    } else {
      setShowWelcomeSection(false);
    }
  }, []);

  useEffect(() => {
    //cl('useEffect to get VolatilityTrading stats currentAssetPrice=%s',currentAssetPrice)
    if (currentAssetPrice > 0) {
      const requests = [getVolatilityTradingSummary()];
      Promise.all(requests).then((response: any) => { });
    }
  }, [currentAssetPrice]);

  return (
    <>
      <PageLock mobileNav={ <Nav /> } header={ <Header /> }>
        <div style={ { ...definitelyCentered } }>
          <MainPageSection style={ { maxWidth: "1080px" } }>
            {/* Home content goes here */ }
            <div
              style={ {
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingBottom: "16px",
              } }
            >
              <h2
                style={ {
                  fontSize: "28px",
                  fontWeight: "500",
                  lineHeight: "36px",
                  letterSpacing: "0px",
                  margin: "0px 0px 8px",
                  fontFamily: `Sohne, sans-serif`,
                  color: fonts.colors.solid.white,
                } }
              >
                { `Home` }
              </h2>
            </div>
            <div
              style={ {
                width: "100%",
                display: "flex",
                flexGrow: "1",
                WebkitBoxFlex: "1",
              } }
            >
              <div
                style={ {
                  flexGrow: "1",
                  display: "flex",
                  WebkitBoxFlex: "1",
                  flexDirection: "column",
                } }
              >
                <div className="home-section">
                  {/* Welcome message and news/updates */ }
                  { showWelcomeSection ? (
                    <>
                      <CardSection>
                        <div className="home-welcome-news-inner-section">
                          <div className="home-welcome-news-content">
                            <h3 className="home-welcome-news-title">
                              { welcomeNewsTitle }
                            </h3>
                            <p className="home-welcome-news-description">
                              { welcomeNewsDescription }
                            </p>
                            <div style={ { display: "flex" } }>
                              <div className="home-welcome-news-button-section">
                                <StyledLink
                                  to={ startTradingButtonPath }
                                  style={ {
                                    width: "auto",
                                    display: "flex",
                                    maxWidth: "139px",
                                    marginTop: "14px",
                                  } }
                                >
                                  <button
                                    className="anchor-button"
                                    style={ { maxWidth: "139px", width: "auto" } }
                                  >
                                    { startTradingButtonText }
                                    <RightArrowSVGWrapper>
                                      <RightArrowSVGContent>
                                        <RightArrowSVG />
                                      </RightArrowSVGContent>
                                    </RightArrowSVGWrapper>
                                  </button>
                                </StyledLink>
                              </div>
                            </div>
                          </div>

                          <div className="home-welcome-news-controls">
                            <div className="home-welcome-news-dismiss-icon-wrapper">
                              {/* Close button */ }
                              <button
                                onClick={ (e: any) =>
                                  handleCloseWelcomeMessage()
                                }
                                className="home-welcome-news-dismiss-button"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#95A4B5"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardSection>
                    </>
                  ) : null }

                  {/* Company metrics, at-a-glance */ }
                  <CardSection>
                    <div className="home-company-metrics-section">
                      <div className="home-company-metrics">
                        <div className="home-company-metrics-title-wrapper">
                          <p className="home-company-metrics-title">{ `TVL` }</p>
                          <div className="home-company-metrics-value-wrapper">
                            <p className="home-company-metrics-value">
                              { isAssetPriceLoading ? (
                                <Spinner height={ "24px" } width={ "24px" } />
                              ) : (
                                `$${numberWithCommas(strandsGlobalTVL, 0)}`
                              ) }
                            </p>
                          </div>
                        </div>

                        <div className="home-company-metrics-title-wrapper">
                          <p className="home-company-metrics-title">
                            { `30D Volume` }
                          </p>
                          <div className="home-company-metrics-value-wrapper">
                            <p className="home-company-metrics-value">{ `-` }</p>
                          </div>
                        </div>

                        <div className="home-company-metrics-title-wrapper">
                          <p className="home-company-metrics-title">
                            { `30D Fees` }
                          </p>
                          <div className="home-company-metrics-value-wrapper">
                            <p className="home-company-metrics-value">{ `-` }</p>
                          </div>
                        </div>

                        <div className="home-company-metrics-title-wrapper">
                          <p className="home-company-metrics-title">
                            { `Open Interest` }
                          </p>
                          <div className="home-company-metrics-value-wrapper">
                            <p className="home-company-metrics-value">{ `-` }</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardSection>
                </div>
              </div>
            </div>

            <CardSection style={ { marginTop: "-24px" } }>
              <OuterCard>
                <div
                  className="section-title"
                  style={ { margin: "24px 24px 12px 24px" } }
                >
                  { "Products" }
                </div>
                <TableSection>
                  <StrategyTable
                    isHome={ true }
                    isAssetPriceLoading={ isAssetPriceLoading }
                    TVL={ volatilityTradingTVL }
                    CUB={ volatilityTradingCUB }
                  />
                </TableSection>
              </OuterCard>
            </CardSection>
          </MainPageSection>
        </div>
      </PageLock>
    </>
  );
};

export default Home;
