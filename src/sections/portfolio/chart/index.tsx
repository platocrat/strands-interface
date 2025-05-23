// Externals
import styled from "@emotion/styled";
import { FC, useLayoutEffect, useState } from "react";
import { useAccount, useProvider, useNetwork } from "wagmi";
// Locals
import {
  TVLDateRangeValue,
  TVLDateRangeWrapper,
} from "../../strategies/chart/TVL";
import RechartsContainer from "../../../components/RechartsContainer";
// Constants
import { OPTIMISM_MAINNET_CHAIN_ID } from "../../../utils/constants";
// Types
import { Web3UserType } from "../../../utils/types";

// CSS
import { cards, fonts } from "../../../theme/styles";
import { ChartPosition, RightOrBottomPanel } from "../../λstrategy/tvl";

export type PortfolioChartProps = {
  marketsDataLoaded: boolean;
};

/**
 * @todo Break this up into a few sub-components
 */
const PortfolioChart: FC<PortfolioChartProps> = ({ marketsDataLoaded }) => {
  // Web3 user hooks
  const account = useAccount();
  const provider = useProvider();
  const { chain } = useNetwork();

  let web3User: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  // Boolean
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);

  const mediaQuery = window.matchMedia("(max-width: 900px)");

  function handleMobile(e: any) {
    setIsMobile(e.matches ? true : false);
  }

  useLayoutEffect(() => {
    if (marketsDataLoaded) setDataIsLoading(false);
  }, [
    web3User.chainId,
    web3User.provider,
    marketsDataLoaded,
    web3User.account.address,
  ]);

  useLayoutEffect(() => {
    handleMobile(mediaQuery); // required to set `isMobile` on initial render
    mediaQuery.addEventListener("change", handleMobile);
  }, [isMobile]);

  return (
    <>
      <TVLSection
        style={{
          backdropFilter: cards.blur,
          backgroundColor: cards.backgroundColor,
        }}
      >
        <TVLWrapper>
          <LeftPanel>
            <div>
              <div className="section-title">{`Portfolio`}</div>
            </div>
            {/* Left side, brief stats on chart content */}
            <div>
              {/** @todo Replace with value from `vault.lockedAmount() */}
              <div className="tvl-value">{`$0.00`}</div>
              <div className="tvl-percentage">{`+TBA %`}</div>
              {/* <TVLStatSection>
                <div className='tvl-stat-name'>{ `PnL` }</div>
                <TVLStatValue style={ { marginBottom: '20px' } }>
                  <>
                    { dataIsLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        { `$${96.96}` }
                      </>
                    ) }
                  </>
                </TVLStatValue>
              </TVLStatSection> */}
            </div>
          </LeftPanel>
        </TVLWrapper>

        <RightOrBottomPanel>
          <TVLDateRanges>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>1W</TVLDateRangeValue>
            </TVLDateRangeWrapper>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>1M</TVLDateRangeValue>
            </TVLDateRangeWrapper>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>3M</TVLDateRangeValue>
            </TVLDateRangeWrapper>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>ALL</TVLDateRangeValue>
            </TVLDateRangeWrapper>
          </TVLDateRanges>

          <ChartPosition>
            <RechartsContainer height={isMobile ? 350 : undefined} />
          </ChartPosition>
        </RightOrBottomPanel>
      </TVLSection>
    </>
  );
};

const TVLDateRanges = styled.div`
  @media screen and (max-width: 900px) {
    position: relative;
    top: 180px;

    margin-right: auto;
    margin-left: auto;
  }

  margin: 0px 0px 8px auto;
  border-radius: 99999px;
  -webkit-box-align: center;
  align-items: center;
  background-color: #1f242999;
  padding: 6px;
  height: 36px;
  display: flex;
`;

const RightPanel = styled.div`
  border-bottom: 0px solid transparent;
  border-right: 0px solid transparent;
  border-right-width: 3px;
  border-right-style: solid;
  flex-direction: column;
  padding: 24px;
  -webkit-box-flex: 1;
  flex-grow: 1;
  display: flex;
  min-width: 305px;
  width: auto;
`;

const TVLStatValue = styled.p`
  font-family: InterVariable, sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: 23px;
  font-size: ${fonts.sizes.normal};
  letter-spacing: 0px;
  color: #ffffff;
`;

const TVLStatSection = styled.div`
  margin: 24px 0px 0px;
`;

const LeftPanel = styled.div`
  flex-direction: column;
  padding: 24px;
  min-width: 220px;
  display: flex;
`;

const TVLWrapper = styled.div`
  @media screen and (min-width: 40em) {
    height: 380px;
  }

  @media screen and (max-width: 900px) {
    border: none;
    background: none;
    margin-bottom: 24px;
    flex-direction: column;
  }

  border-radius: 28px 0px 0px 28px;

  border-color: ${fonts.colors.transparent.mdPink};
  border-style: inset;
  border-right-width: 4px;
  border-right-style: outset;
  border-right-color: ${fonts.colors.transparent.mdPink};

  text-decoration: none;
  background-color: #1f242980;
  position: relative;
  flex-direction: row;
  height: 300px;
  display: flex;

  margin-top: -1px;
  margin-left: -1px;
`;

const TVLSection = styled.div`
  @media screen and (min-width: 40em) {
    height: 380px;
    margin-bottom: 24px;
  }

  @media screen and (max-width: 900px) {
    height: 340px;
    flex-direction: column;
  }

  @media screen and (max-width: 639px) {
    height: 340px;
    margin-bottom: 24px;
    flex-direction: column;
  }

  box-shadow: ${cards.boxShadows.lightShadow};
  border-radius: 28px;
  margin: 3px 0px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  text-decoration: none;

  position: relative;
  flex-direction: row;
  height: 300px;
  display: flex;
`;

export default PortfolioChart;
