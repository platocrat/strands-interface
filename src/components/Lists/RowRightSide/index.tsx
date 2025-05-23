// Externals
import { FC, useContext } from "react";
import styled from "@emotion/styled";
// Locals
import { TinyValue } from "../../../sections/strategies/chart/TVL";
// Contexts
import { UnderlierContext } from "../../../contexts/UnderlierContext";
// CSS and Types
import { fonts } from "../../../theme/styles";
import { RowRightSideProps } from "../../../utils/props";
// Images
import { ReactComponent as InfoIconSVG } from "../../../assets/svg/info-icon-pink.svg";
import { ReactComponent as RightArrowIcon } from "../../../assets/svg/right-arrow-short.svg";
import { cstb } from "../../../theme/componentStyles";

const RowRightSide: FC<RowRightSideProps> = ({ isActive, isAssets }) => {
  const { assetSymbol } = useContext(UnderlierContext);

  let tvl = 0, // in millions
    apy: any = 0.0; // as a percent

  const isETHorBTC = assetSymbol === "ETH" || assetSymbol === "BTC";
  const isActiveStrategy = isActive && isETHorBTC;

  if (isActiveStrategy) {
    tvl = 17.52;
    apy = (0.0656 * 100).toFixed(2);
  }

  return (
    <>
      <RowRightSideSection>
        <RowRightSideWrapper>
          {isActiveStrategy ? (
            <>
              <div>
                <div className="table-cell-value">{`$${tvl}m TVL`}</div>
                <AssetAPYSection>
                  <APYWrapper>
                    <TinyValue>{`${apy}% APY`}</TinyValue>
                    <SVGWrapper>
                      <InfoIconSVG />
                    </SVGWrapper>
                  </APYWrapper>
                </AssetAPYSection>
              </div>
              <RightArrowButton>
                <InnerButtonSection>
                  <RightArrowIcon />
                </InnerButtonSection>
              </RightArrowButton>
            </>
          ) : (
            <>
              <div style={cstb}>{`Coming soon`}</div>
            </>
          )}
        </RowRightSideWrapper>
      </RowRightSideSection>
    </>
  );
};

const InnerButtonSection = styled.div`
  width: 16px;
  height: 16px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
`;

const RightArrowButton = styled.button`
  margin: 0px 0px 0px 16px;
  appearance: none;
  text-align: center;
  line-height: inherit;
  text-decoration: none;
  border-image: initial;
  border-width: 1px;
  border-style: solid;
  border-color: #1f242999;
  font-family: InterVariable, sans-serif;
  font-weight: 500;
  font-size: 15px;

  cursor: pointer;

  border-radius: 99999px;
  height: 36px;
  background-color: #1f242999;

  color: ${fonts.colors.solid.white};
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;

  min-width: 36px;
`;

export const SVGWrapper = styled.div`
  margin: 0px 0px 0px 4px;
  padding-bottom: 1px;
  width: 13px;
  height: 13px;
  color: #6b7d94;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
`;

const APYWrapper = styled.div`
  opacity: 1;
  cursor: pointer;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const AssetAPYSection = styled.div`
  align-self: flex-end;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const RowRightSideWrapper = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const RowRightSideSection = styled.div`
  padding-left: 32px;
  min-width: fit-content;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
`;

export default RowRightSide;
