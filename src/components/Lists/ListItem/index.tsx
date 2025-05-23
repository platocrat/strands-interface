// Externals
import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { useNetwork } from "wagmi";
// Locals
import RowLeftSide from "../RowLeftSide";
import RowRightSide from "../RowRightSide";
import { StyledLink } from "../../../sections/strategies/strategy";
// Types and CSS
import { ListItemProps } from "../../../utils/props";
import { containers, fonts } from "../../../theme/styles";
import { UnderlierContext } from "../../../contexts/UnderlierContext";
// Constants
import { ARBITRUM_MAINNET_CHAIN_ID } from "../../../utils/constants";

const ListItem: FC<ListItemProps> = ({
  isAssets,
  isActive,
  vaultCtcs,
  oneClickObjs,
  vaultAddress,
  vaultNameKey,
  vaultNameTitle,
}) => {
  const { assetName, assetSymbol } = useContext(UnderlierContext);
  const { chain } = useNetwork();

  let pagePath: string = "",
    isOpenPath = false,
    hasVaultAddress = false;

  const wrappedSymbol =
    (chain?.id === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + assetSymbol;
  /**
   * @todo `vaultAddress` for every strategy MUST be unique
   *        (sBTC covered call vaultAddress is the same for sETH covered call)
   */
  const isETHorBTC = assetSymbol === "BTC" || assetSymbol === "ETH";
  const isActiveStrategy = (isActive as boolean) && isETHorBTC;

  // If strategies path
  if (isAssets) {
    pagePath = `/vaults/${assetName}-${wrappedSymbol}/strategies`;
    isOpenPath = isAssets;
  }

  // If strategy path
  if (!isAssets && !vaultCtcs && !oneClickObjs) {
    const firstHalf = `/vaults/${assetName}-${wrappedSymbol}/strategies/`;
    const secondHalf = `${vaultNameKey}/${vaultAddress}`;

    pagePath = `${firstHalf}${secondHalf}`;
    hasVaultAddress = vaultAddress !== "";
    isOpenPath = isActiveStrategy && hasVaultAddress;
  }

  return (
    <>
      <Item>
        <ListRow>
          {isOpenPath ? (
            <>
              <StyledLink to={pagePath}>
                <ListRowSection className={`${isActiveStrategy}`}>
                  <RowLeftSide
                    isAssets={isAssets}
                    isActive={isActive}
                    vaultNameTitle={vaultNameTitle}
                  />
                  <RowRightSide isAssets={isAssets} isActive={isActive} />
                </ListRowSection>
              </StyledLink>
            </>
          ) : (
            <ListRowSection>
              <RowLeftSide
                isAssets={isAssets}
                isActive={isActive}
                vaultNameTitle={vaultNameTitle}
              />
              <RowRightSide isAssets={isAssets} isActive={isActive} />
            </ListRowSection>
          )}
        </ListRow>
      </Item>
    </>
  );
};

const ListRowSection = styled.div`
  text-decoration: none;
  color: #b5beca;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  padding: 12px 12px;
  height: 100%;
  display: flex;

  backdrop-filter: blur(100px);

  border-radius: 3rem;

  transition: 0.07s ease;

  :hover {
    transition: 0.07s ease;
    cursor: ${(props) =>
      props.className === "true" ? "cursor" : "not-allowed"};
    opacity: ${(props) => (props.className === "true" ? 0.9 : "")};
    backdrop-filter: blur(100px);
    transform: ${(props) =>
      props.className === "true" ? "scaleX(0.99) scaleY(0.99)" : ""};
    box-shadow: ${containers.boxShadows.softPink};
  }

  :active {
    transition: 0.07s ease;
    opacity: 1;
    transform: ${(props) =>
      props.className === "true" ? "scaleX(0.985) scaleY(0.985)" : ""};
  }
`;

const ListRow = styled.div`
  box-sizing: border-box;
  text-decoration: none;
  color: #b5beca;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  padding: 10px 24px;
  height: 100%;
`;

const Item = styled.li`
  display: list-item;

  color: ${fonts.colors.solid.white};
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  text-decoration: none;
  text-align: left;

  border-bottom-color: #000000;
  overflow: hidden;
`;

export default ListItem;
