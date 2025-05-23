// Externals
import { FC } from "react";
import styled from "@emotion/styled";
// Locals
// CSS
import { cards, fonts } from "../../theme/styles";
// Props
import { ProductInfoProps } from "../../utils/props";
// Images
import ProductInfoIcon1 from "../../assets/svg/product-info-icon-1.svg";
import ProductInfoIcon2 from "../../assets/svg/product-info-icon-2.svg";
import ProductInfoIcon3 from "../../assets/svg/product-info-icon-3.svg";
// import ExternalLinkIcon from '../../assets/svg/external-link-icon.svg'

const ProductInfo: FC<ProductInfoProps> = ({ isOneClicks }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "24px",
          marginBottom: "10px",
          justifyContent: "center",
          zIndex: "-1",
        }}
      >
        <Grid>
          <OuterCard>
            <InnerCard>
              <IconDiv>
                <img src={ProductInfoIcon1} alt={"product-info-icon-1"} />
              </IconDiv>
              <ThemeBodyText>About</ThemeBodyText>
              <SecondaryBodyText>
                {isOneClicks
                  ? `Strands 1Clicks use automated systems to execute strategies across all execution venues that have been Stranded together.`
                  : `Strands Volatility Trading Algorithms use automated systems to execute strategies across all execution venues that have been Stranded together.`}
              </SecondaryBodyText>
              {/* <ExternalLink
              href='https://docs.lyra.finance/overview/how-does-lyra-work/market-maker-vaults'
              rel='noreferrer'
              target='_blank'
            >
              Learn more&nbsp;
              <img src={ ExternalLinkIcon } alt='external-link-icon' />
            </ExternalLink> */}
            </InnerCard>
          </OuterCard>
          <OuterCard>
            <InnerCard>
              <IconDiv>
                <img src={ProductInfoIcon2} alt="product-info-icon-2" />
              </IconDiv>
              <ThemeBodyText>Risks</ThemeBodyText>
              <SecondaryBodyText>
                {`Interacting with tools developed by Strands can lead to the loss of all assets that form part of a transaction due to risks including but not limited to: Strands Smart Contract Risk, Lyra Smart Contract Risk, Lyra AMM Liquidity Provision Risk, Synthetix Collateral Risk, and Lyra Settlement Risk.`}
              </SecondaryBodyText>
              {/* <ExternalLink
              href='https://docs.lyra.finance/overview/risks'
              rel='noreferrer'
              target='_blank'
            >
              Learn more&nbsp;
              <img src={ ExternalLinkIcon } alt='external-link-icon' />
            </ExternalLink> */}
            </InnerCard>
          </OuterCard>
          <OuterCard>
            <InnerCard>
              <IconDiv>
                <img src={ProductInfoIcon3} alt="product-info-icon-3" />
              </IconDiv>
              <ThemeBodyText>Rewards</ThemeBodyText>
              <SecondaryBodyText>
                {/** @todo Needs to be written by a lawyer */}
                {`Users of tools developed by Strands can potentially earn token-based rewards for their activity. These rewards can be, but are not limited to, STRANDS or other third-party partner tokens.`}
              </SecondaryBodyText>
              {/* <ExternalLink
              href='https://docs.lyra.finance/overview/how-does-lyra-work/market-maker-vaults'
              rel='noreferrer'
              target='_blank'
            >
              Learn more&nbsp;
              <img src={ ExternalLinkIcon } alt='external-link-icon' />
            </ExternalLink> */}
            </InnerCard>
          </OuterCard>
        </Grid>
      </div>
    </>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  z-index: 1;

  box-sizing: border-box;
  gap: 24px;

  padding: 0px 0px;
  width: 100%;

  margin-bottom: 48px;

  @media only screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    padding-bottom: 100px;
  }
`;

export const OuterCard = styled.div`
  border-radius: 28px;
  box-shadow: ${cards.boxShadows.lightShadow};

  display: flex;
  position: relative;
  flex-direction: column;

  border-width: 1px;
  border-style: solid;
  border-color: rgb(23, 24, 37, 0);

  box-sizing: border-box;
  text-decoration: none;
`;

export const InnerCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;

  border-radius: 28px;

  border-bottom: 0px solid transparent;
  border-right: 0px solid transparent;

  backdrop-filter: ${cards.blur};
  box-shadow: 1px 1px 100px rgba(112, 119, 128, 0.2);

  box-sizing: border-box;
  margin: 0px;

  border-bottom-width: 3px;
  border-bottom-style: solid;
`;

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0px 0px 16px;

  box-sizing: border-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;

  width: 30px;
  height: 30px;
`;

const ThemeBodyText = styled.h3`
  box-sizing: border-box;
  margin: 0px 0px 16px;

  font-size: 19px;
  color: #ffffff;
  font-weight: 600;

  line-height: 34px;
  letter-spacing: 0px;
`;

const SecondaryBodyText = styled.p`
  box-sizing: border-box;
  margin: 0px 0px 32px;
  font-size: ${fonts.sizes.biggieSmalls};
  min-width: 0px;
  color: #ffffff;
`;

const ExternalLink = styled.a`
  display: flex;

  box-sizing: border-box;
  margin: auto 0px 0px;

  max-width: 94px;

  color: #fdaccd;
  text-decoration: none;
  transition: color 0.1s ease-out 0s;

  font-size: ${fonts.sizes.biggieSmalls};
  font-style: normal;
  font-weight: 400;

  line-height: 23px;
  letter-spacing: 0px;
`;

export default ProductInfo;
