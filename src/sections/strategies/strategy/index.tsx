// -------------------------------- Externals ----------------------------------
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { FC, useContext, useLayoutEffect, useState } from "react";
// -------------------------------- Locals -------------------------------------
import APYCell from "../../../components/Tables/Cells/APYCell";
import TVLCell from "../../../components/Tables/Cells/TVLCell";
import AssetImgTernary from "../../../components/AssetImgTernary";
import UsersCell from "../../../components/Tables/Cells/UsersCell";
// Requests
import { getApolloClient } from "../../../utils/subgraph/graphql/clients";
// Subgraph utils
import {
  apolloClient,
  getRoundStatus,
  getCurrentTotalValueLocked,
  getUniqueUserCount,
} from "../../../utils/subgraph";
// Subgraph queries
import {
  getLasts,
  getDeposits,
} from "../../../utils/subgraph/graphql/queries/vaults";
// CSS
import { cstb } from "../../../theme/componentStyles";
// Utils Misc
import { cl, web3UserIsUndefined } from "../../../utils/misc";
// Types
import { DepositEvent, Web3UserType } from "../../../utils/types";
// Props
import { StrategyProps } from "../../../utils/props";
// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// Images
import { ReactComponent as RightArrowSVG } from "../../../assets/svg/right-arrow-short.svg";
import { UnderlierContext } from "../../../contexts/UnderlierContext";

const Strategy: FC<StrategyProps> = ({
  isHome,
  isActive,
  _assetName,
  instrument,
  vaultAddress,
  vaultNameKey,
  vaultNameTitle,
  isAssetPriceLoading,
}) => {
  const { assetName, assetSymbol } = useContext(UnderlierContext);
  //cl('Strategy instrument name=%s tvl=%s users=%s',instrument?.name,instrument?.tvl,instrument?.users)

  _assetName = _assetName ?? assetName;

  const account = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  let web3User_: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  const wrappedSymbol =
    (web3User_.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + assetSymbol;
  const quoteAsset =
    web3User_.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "USDC" : "sUSD";
  const networkName = chain?.id === OPTIMISM_MAINNET_CHAIN_ID
    ? 'optimism'
    : 'arbitrum'

  // booleans
  const [edIsLoading, setEdIsLoading] = useState<boolean>(false);
  // numbers
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalValueLocked, setTotalValueLocked] = useState<number>(0);

  const firstHalf = `/vaults/${_assetName}-${assetSymbol}/strategies/`;
  const secondHalf = `${vaultNameKey}/${vaultAddress}`;
  const strategyPath = `${firstHalf}${secondHalf}`;
  const isActiveStrategy = isActive && assetSymbol === "ETH";
  const isActiveVault = vaultNameKey !== undefined && assetSymbol === "ETH";

  async function getVaultEd(): Promise<void> {
    if (isActiveVault) {
      setEdIsLoading(true);

      const generalEd = await apolloClient(
        getApolloClient[networkName].vaults[vaultNameKey as string],
        getLasts,
        {
          first: 1,
          orderBy: "blockTimestamp",
          orderDirection: "desc",
        }
      );

      const depositsED = await apolloClient(
        getApolloClient[networkName].vaults[vaultNameKey],
        getDeposits
      );

      // Not an empty array nor a default object
      const _roundStatus = getRoundStatus(generalEd);
      setTotalValueLocked(getCurrentTotalValueLocked(generalEd, _roundStatus));
      setTotalUsers(getUniqueUserCount(depositsED));

      setEdIsLoading(false);
    }
  }

  useLayoutEffect(() => {
    if (!isHome && !web3UserIsUndefined(web3User_)) {
      const requests = [getVaultEd()];
      Promise.all(requests).then((response: any) => { });
    }
  }, [
    _assetName,
    assetSymbol,
    account.address,
    account.connector,
    provider.network.chainId,
  ]);

  return (
    <>
      <Str2>
        {/* col 1 */ }
        <Std
          role="cell"
          style={ {
            /**
             * @todo Finish mobile view
             * 1. Handle unpleasant look of table when the window size is in
             *    between 932px - 901px
             */
            // prevent other cols from shifting to the right
            maxWidth: isHome ? "" : "235px",
          } }
        >
          <StrategyCell>
            <AssetImgTernary isHome={ isHome } />
            <StrategyTitle>
              <div className="table-cell-value">{ vaultNameTitle }</div>
              <div className="row-title-details">
                { isHome ? null : (
                  <>
                    { vaultNameKey === "coveredCall"
                      ? wrappedSymbol
                      : quoteAsset }
                  </>
                ) }
              </div>
            </StrategyTitle>
          </StrategyCell>
        </Std>
        {/* col 2 */ }
        <Std role="cell">
          <TVLCell
            isHome={ isHome }
            vaultName={ vaultNameKey }
            isAssetPriceLoading={ isAssetPriceLoading }
            stratTVL={ instrument ? instrument.tvl : totalValueLocked }
          />
        </Std>
        {/* col 3 */ }
        <Std role="cell">
          <UsersCell
            isHome={ isHome }
            totalUsers={ instrument ? instrument.users : totalUsers }
          />
        </Std>
        {/* col 4 */ }
        <Std role="cell">
          <APYCell />
        </Std>
        {/* column 5 */ }
        <Std role="cell">
          { isActiveStrategy && !isHome ? (
            <>
              <StyledLink to={ strategyPath }>
                <button className="anchor-button">
                  { `Engage` }
                  <RightArrowSVGWrapper>
                    <RightArrowSVGContent>
                      <RightArrowSVG />
                    </RightArrowSVGContent>
                  </RightArrowSVGWrapper>
                </button>
              </StyledLink>
            </>
          ) : (
            <>
              { isHome && isActive && instrument?.path ? (
                <>
                  <StyledLink to={ instrument.path }>
                    <button className="anchor-button">
                      { `Activate` }
                      <RightArrowSVGWrapper>
                        <RightArrowSVGContent>
                          <RightArrowSVG />
                        </RightArrowSVGContent>
                      </RightArrowSVGWrapper>
                    </button>
                  </StyledLink>
                </>
              ) : (
                <div style={ cstb }>{ `Coming soon` }</div>
              ) }
            </>
          ) }
        </Std>
      </Str2>
    </>
  );
};

export const StyledLink = styled(Link)`
  :link {
    text-decoration: none;
  }
`;

const RightArrowSVGContent = styled.div`
  display: flex;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;

  width: 16px;
  height: 16px;
`;

const RightArrowSVGWrapper = styled.div`
  display: flex;
  -webkit-box-pack: end;
  justify-content: flex-end;

  padding-left: 8px;
`;

const StrategyTitle = styled.div`
  margin: 0px 0px 0px 8px;
`;

const StrategyCell = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

/**
 * @todo Hard coded `width` becomes an issue for flex-grow to work without
 *       refreshing the page.
 */
const Std = styled.td`
  display: flex;
  padding: 16px 24px;

  flex: 150 0 auto;
  width: 150px;

  -webkit-box-align: center;
  align-items: center;
`;

const Str2 = styled.tr`
  display: flex;
`;

export default Strategy;
