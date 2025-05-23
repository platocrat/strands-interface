// Externals
import styled from "@emotion/styled";
import { FC, useLayoutEffect, useState } from "react";
// Locals
import {
  TVLDateRangeValue,
  TVLDateRangeWrapper,
} from "../../strategies/chart/TVL";
import Spinner from "../../../components/Suspense/Spinner";
import RechartsContainer from "../../../components/RechartsContainer";
// Misc utils
import { nFormatter, web3UserIsUndefined } from "../../../utils/misc";
// Constants
import {
  placeholderData,
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// Props
import { TVLSectionProps } from "../../../utils/props";
// CSS
import { cards, fonts } from "../../../theme/styles";
// Images
import { ReactComponent as DropdownSVG } from "../../../assets/svg/dropdown.svg";
import { apolloClient } from "../../../utils/subgraph";
import { getApolloClient } from "../../../utils/subgraph/graphql/clients";
import { getTVL } from "../../../utils/subgraph/graphql/queries/vaults";
import { useNetwork } from "wagmi";

const TVL: FC<TVLSectionProps> = ({
  vault,
  children,
  web3User,
  suspense,
  eventData,
  assetSymbol,
  vaultName,
}) => {
  const { chain } = useNetwork()

  const [historicalTVL, setHistoricalTVL] = useState<any[]>([]);
  // boolean
  const [historicalVaultDataLoaded, setHistoricalVaultDataLoaded] =
    useState<boolean>(false);
  const wrappedSymbol =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + assetSymbol;
  const quoteAsset =
    web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "USDC" : "sUSD";
  const networkName = chain?.id === OPTIMISM_MAINNET_CHAIN_ID
    ? 'optimism'
    : 'arbitrum'

  // Async functions
  async function getHistoricalVaultData() {
    const historicalTVL_ = await apolloClient(
      getApolloClient[networkName].vaults[vaultName],
      getTVL,
      {
        first: 1,
        orderBy: "blockTimestamp",
        orderDirection: "desc",
      }
    );

    setHistoricalTVL(historicalTVL_);
  }

  // For fetching TVL data points
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      // setHistoricalVaultDataLoaded(false)

      Promise.all([
        // getHistoricalVaultData(),
      ]).then((response: any) => {
        // setHistoricalVaultDataLoaded(true)
      });
    }
  }, [
    web3User.provider,
    web3User.account.address,
    web3User.provider.network.name,
    web3User.provider.network.chainId,
  ]);

  return (
    <>
      <TVLSection
        style={ {
          backdropFilter: cards.blur,
          backgroundColor: cards.backgroundColor,
          boxShadow: cards.boxShadows.lightShadow,
        } }
      >
        {/**
         * @todo Add isMobile and isDesktop state vars
         */}
        <TVLWrapper>
          <LeftOrTopPanel>
            <TVLButton>
              <div className="section-title" style={ { marginBottom: "-5px" } }>
                { `TVL` }
              </div>
              <DropdownSection>
                <Dropdown>
                  <DropdownSVG />
                </Dropdown>
              </DropdownSection>
            </TVLButton>
            {/* Left side, brief stats on chart content */ }
            <div>
              {/** @todo Replace with value from `vault.lockedAmount() */ }
              <div className="tvl-value">
                <>
                  { suspense.edIsLoading || !suspense.chartDataLoaded ? (
                    <Spinner height={ "30px" } width={ "30px" } />
                  ) : (
                    <>
                      { `${nFormatter(
                        suspense.txConfirmed
                          ? vault.lockedAmount
                          : eventData.totalValueLocked,
                        2
                      )} ${vaultName === "coveredCall" ? wrappedSymbol : quoteAsset
                        }` }
                    </>
                  ) }
                </>
              </div>
              {/* <div className='tvl-percentage'>{ `+86.46%` }</div> */ }
              <TVLStatSection>
                <div className="tvl-stat-name">{ `Total Pending Deposits` }</div>
                <TVLStatValue>
                  <>
                    { suspense.edIsLoading || !suspense.chartDataLoaded ? (
                      <Spinner height={ "25px" } width={ "25px" } />
                    ) : (
                      <>
                        { `${nFormatter(
                          suspense.txConfirmed
                            ? vault.totalPending
                            : eventData.totalPendingDeposits,
                          2
                        )} ${vaultName === "coveredCall"
                          ? wrappedSymbol
                          : quoteAsset
                          }` }
                      </>
                    ) }
                  </>
                </TVLStatValue>
              </TVLStatSection>
            </div>
          </LeftOrTopPanel>
        </TVLWrapper>

        <DepositButtonPosition>{ children }</DepositButtonPosition>

        <RightOrBottomPanel>
          <TVLDateRanges>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>30D</TVLDateRangeValue>
            </TVLDateRangeWrapper>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>3M</TVLDateRangeValue>
            </TVLDateRangeWrapper>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>6M</TVLDateRangeValue>
            </TVLDateRangeWrapper>
            <TVLDateRangeWrapper>
              <TVLDateRangeValue>1Y</TVLDateRangeValue>
            </TVLDateRangeWrapper>
          </TVLDateRanges>

          <ChartPosition>
            <RechartsContainer data={ placeholderData } />
          </ChartPosition>
        </RightOrBottomPanel>
      </TVLSection>
    </>
  );
};

const DepositButtonPosition = styled.div`
  @media screen and (max-width: 900px) {
    position: relative;
    top: 205px;

    z-index: 4;
  }
`;

export const ChartPosition = styled.div`
  @media screen and (max-width: 900px) {
    position: relative;
    bottom: 180px;
  }
`;

export const TVLDateRanges = styled.div`
  @media screen and (max-width: 900px) {
    position: relative;
    top: 150px;

    z-index: 5;

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

export const RightOrBottomPanel = styled.div`
  @media screen and (max-width: 900px) {
    border: none;
    padding: 24px;

    position: relative;
    bottom: 82.5px;
  }

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
  color: ${fonts.colors.solid.white};
`;

const TVLStatSection = styled.div`
  @media screen and (max-width: 900px) {
    display: none;
  }

  margin: 24px 0px 0px;
`;

export const Dropdown = styled.div`
  width: 16px;
  height: 16px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
`;

export const DropdownSection = styled.div`
  -webkit-box-pack: end;
  justify-content: flex-end;
  -webkit-box-flex: 1;
  flex-grow: 1;
  padding-left: 8px;
  display: flex;
`;

export const SectionHeader = styled.h3`
  font-family: Sohne, sans-serif;
  font-weight: 500;
  line-height: 34px;
  font-size: 22px;
  color: inherit;
`;

export const TVLButton = styled.div`
  z-index: 4;

  margin: 0px -12px 5px -12px;
  appearance: none;
  text-align: center;
  line-height: inherit;
  text-decoration: none;
  padding: 8px 12px;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: ${fonts.sizes.normal};
  cursor: pointer;
  border-radius: 99999px;
  height: 36px;
  background-color: transparent;

  color: ${fonts.colors.solid.white};

  :hover {
    background-color: black;
  }

  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  opacity: 1;
`;

export const LeftOrTopPanel = styled.div`
  @media screen and (max-width: 900px) {
    margin-bottom: -35px;
  }

  flex-direction: column;

  padding: 24px;
  min-width: 120px;
  display: flex;

  margin-right: -1px;
`;

export const TVLWrapper = styled.div`
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

  margin-left: -1px;
  margin-top: -1px;
`;

export const TVLSection = styled.div`
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

  border-radius: 28px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  text-decoration: none;

  position: relative;
  flex-direction: row;
  height: 300px;
  display: flex;
`;

export default TVL;
