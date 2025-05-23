// Externals
import styled from "@emotion/styled";
import { FC, useContext } from "react";
// Locals
import { StyledLink } from "../../strategies/strategy";
import AssetImgTernary from "../../../components/AssetImgTernary";
// Contexts
import { UnderlierContext } from "../../../contexts/UnderlierContext";
// Utils
import { findVaultNameTitle } from "../../../utils/misc";
// Images
import { ReactComponent as BackArrowSVG } from "../../../assets/svg/back-arrow.svg";

export type PageHeaderProps = {
  vaultName: string;
};

const PageHeader: FC<PageHeaderProps> = ({ vaultName }) => {
  const { assetName, assetSymbol } = useContext(UnderlierContext);

  const vaultNameTitle = findVaultNameTitle(vaultName);

  return (
    <>
      <PageHeaderSection>
        <div style={ { display: "flex" } }>
          <StyledLink to={ `/vaults/${assetName}-${assetSymbol}` }>
            <div
              className="anchor-button"
              style={ {
                width: "80px",
                margin: "0px 0px 24px",
              } }
            >
              <BackArrowSection>
                <BackArrowWrapper>
                  <BackArrowSVG />
                </BackArrowWrapper>
              </BackArrowSection>
              <p style={ { position: "relative", top: "-0.25px" } }>{ `Back` }</p>
            </div>
          </StyledLink>
        </div>
        <TitleSection>
          <AssetImgTernary
            style={ {
              margin: "0px 8px 0px 0px",
              maxWidth: "100%",
              borderRadius: "32px",
              objectFit: "contain",
              width: "32px",
              height: "32px",
              minWidth: "32px",
              minHeight: "32px",
            } }
          />
          <Title>{ `${assetSymbol} ${vaultNameTitle} Vault` }</Title>
        </TitleSection>
      </PageHeaderSection>
    </>
  );
};

const Title = styled.h2`
  font-family: Sohne, sans-serif;
  font-weight: 500;
  font-size: 28px;

  line-height: 36px;

  color: #ffffff;
`;

const TitleSection = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

export const BackArrowWrapper = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;

  width: 16px;
  height: 16px;
`;

export const BackArrowSection = styled.div`
  display: flex;

  padding-right: 5px;

  -webkit-box-pack: start;
  justify-content: flex-start;
`;

const BackAnchor = styled.a`
  margin: 0px 0px 16px;

  appearance: none;

  text-align: center;
  line-height: inherit;
  text-decoration: none;

  padding: 8px 12px;

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
  color: #b5beca;

  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;

  opacity: 1;
`;

const PageHeaderSection = styled.div`
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px;
`;

export default PageHeader;
