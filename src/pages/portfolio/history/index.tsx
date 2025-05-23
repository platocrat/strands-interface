// Externals
import { FC, useLayoutEffect, useState } from "react";
import { useAccount, useProvider, useNetwork } from "wagmi";
// Locals
import {
  BackArrowSection,
  BackArrowWrapper,
} from "../../../sections/λstrategy/page-header";
import Nav from "../../../components/Nav";
import { MainPageSection } from "../../vaults";
import Header from "../../../components/Header";
import PageLock from "../../../components/PageLock";
import { StyledLink } from "../../../sections/strategies/strategy";
import PortfolioHistorySection from "../../../sections/portfolio/history";
// Requests
import { getLyraPositions } from "../../../utils/requests/portfolio";
// Misc utils
import { web3UserIsUndefined } from "../../../utils/misc";
// Constants
import {
  OPTIMISM_MAINNET_CHAIN_ID,
  initLyraHistoricalPosition,
  ARBITRUM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// Types
import { Web3UserType, LyraHistoricalPosition } from "../../../utils/types";
// Props
import { PortfolioHistoryProps } from "../../../utils/props";
// CSS
import { fonts } from "../../../theme/styles";
import { definitelyCentered } from "../../../theme/componentStyles";
// Images
import { ReactComponent as BackArrowSVG } from "../../../assets/svg/back-arrow.svg";

const PortfolioHistory: FC<PortfolioHistoryProps> = ({
  assetName,
  assetSymbol,
}) => {
  // Web3 user hooks
  const account = useAccount();
  const provider = useProvider();
  const { chain } = useNetwork();

  let web3User_: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  // boolean
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [positionsLoaded, setPositionsLoaded] = useState<boolean>(false);
  // Custom
  const [web3User, setWeb3User] = useState<Web3UserType>(web3User_);
  const [positions, setPositions] = useState<LyraHistoricalPosition[]>([
    initLyraHistoricalPosition,
  ]);

  const mobileMediaQuery = window.matchMedia("(max-width: 900px)");
  const desktopMediaQuery = window.matchMedia("(min-width: 1440px)");

  function handleMobile(e: any): void {
    setIsMobile(e.matches ? true : false);
  }

  function handleDesktop(e: any): void {
    setIsDesktop(e.matches ? true : false);
  }

  async function getPositions(): Promise<void> {
    if (web3User.account.address !== undefined) {
      const owner = web3User.account.address;
      const positions_ = await getLyraPositions(
        owner,
        web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? true : false
      );
      setPositions(positions_);
    }
  }

  // For PageLock
  useLayoutEffect((): void => {
    handleMobile(mobileMediaQuery); // required to set `isMobile` on initial render
    mobileMediaQuery.addEventListener("change", handleMobile);
  }, [isMobile]);

  // For PageLock
  useLayoutEffect((): void => {
    handleDesktop(desktopMediaQuery); // required to set `isMobile` on initial render
    desktopMediaQuery.addEventListener("change", handleDesktop);
  }, [isDesktop]);

  // ------------------------- useLayoutEffects --------------------------------
  useLayoutEffect(() => {
    setWeb3User(web3User_);
  }, [
    account.address,
    account.connector,
    account.isConnected,
    provider.network.chainId,
  ]);

  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      setPositionsLoaded(false);

      Promise.all([getPositions()]).then((response: any) => {
        setPositionsLoaded(true);
      });
    }
  }, [
    account.address,
    account.connector,
    web3User_.account.address,
    web3User_.account.connector,
    web3User_.provider.network.chainId,
  ]);

  return (
    <>
      <PageLock
        mobileNav={<Nav />}
        header={<Header />}
        suspense={{
          isDataLoaded: positionsLoaded,
        }}
      >
        <div style={{ ...definitelyCentered }}>
          <MainPageSection>
            <div className="portfolio-history-section">
              {/** @todo Turn into separate component */}
              <div className="portfolio-history-top-section">
                <div className="portfolio-back-button-section">
                  <div style={{ display: "flex" }}>
                    <StyledLink to={`/portfolio`}>
                      <div
                        className="anchor-button"
                        style={{
                          width: "80px",
                          margin: "0px 0px 24px",
                        }}
                      >
                        <BackArrowSection>
                          <BackArrowWrapper>
                            <BackArrowSVG />
                          </BackArrowWrapper>
                        </BackArrowSection>
                        <p style={{ position: "relative", top: "-0.25px" }}>
                          {`Back`}
                        </p>
                      </div>
                    </StyledLink>
                  </div>
                </div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "500",
                    lineHeight: "36px",
                    filter: fonts.filters["drop-shadow"].transparent.black,
                    color: fonts.colors.solid.white,
                  }}
                >
                  {`History`}
                </h2>
              </div>

              <PortfolioHistorySection positions={positions} />
            </div>
          </MainPageSection>
        </div>
      </PageLock>
    </>
  );
};

export default PortfolioHistory;
