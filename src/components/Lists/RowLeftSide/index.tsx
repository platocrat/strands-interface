// Externals
import { FC, useContext } from "react";
import styled from "@emotion/styled";
// Locals
import AssetImgTernary from "../../AssetImgTernary";
// Contexts
import { UnderlierContext } from "../../../contexts/UnderlierContext";
// CSS and types
import { fonts } from "../../../theme/styles";
import { RowLeftSideProps } from "../../../utils/props";

const RowLeftSide: FC<RowLeftSideProps> = ({
  isActive,
  isAssets,
  vaultNameTitle,
}) => {
  const { assetSymbol, assetName } = useContext(UnderlierContext);

  const assetPairTitle = isAssets ? `${assetSymbol}-sUSD` : assetSymbol;
  const cellTitle = isAssets ? `${assetName}` : `${vaultNameTitle}`;

  return (
    <>
      <RowLeftSideSection>
        <RowLeftSideWrapper>
          <AssetContentSection>
            <AssetImgTernary />
            <AssetContent>
              <div className="table-cell-value">{cellTitle}</div>
              <div className="styled-asset-pair">{assetPairTitle}</div>
            </AssetContent>
          </AssetContentSection>
        </RowLeftSideWrapper>
      </RowLeftSideSection>
    </>
  );
};

const AssetContent = styled.div`
  margin: 0px 0px 0px 8px;
  min-width: 0px;
`;

const AssetContentSection = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const RowLeftSideWrapper = styled.div`
  color: ${fonts.colors.solid.white};
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const RowLeftSideSection = styled.div`
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  -webkit-box-flex: 1;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

export default RowLeftSide;
