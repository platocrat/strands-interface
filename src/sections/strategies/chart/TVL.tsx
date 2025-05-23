// Externals
import styled from "@emotion/styled";
import { useState, useLayoutEffect } from "react";
// Locals
import RechartsContainer from "../../../components/RechartsContainer";
// CSS
import { cards, fonts } from "../../../theme/styles";

const TVL = () => {
  // General useStates
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // For `isMobile`
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  // Regular functions
  function handleMobile(e: any) {
    setIsMobile(e.matches ? true : false);
  }

  // For mobile support
  useLayoutEffect(() => {
    handleMobile(mediaQuery); // required to set `isMobile` on initial render
    mediaQuery.addEventListener("change", handleMobile);
  }, [isMobile]);

  return (
    <>
      <TVLSection>
        <TVLContent>
          <TVLHeaderContent>
            <div>
              <div className="section-title">{`TVL`}</div>
              <TVLDollarValue>{`$0.00`}</TVLDollarValue>
              <TVLPercentageValue>{`+TBA %`}</TVLPercentageValue>
            </div>

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
          </TVLHeaderContent>

          <ChartPosition>
            <RechartsContainer
              yPos={isMobile ? 115 : 50}
              chartTopMargin="-35px"
              mobileChartHeight={120}
              chartHeight={isMobile ? 100 : 80}
              height={305}
            />
          </ChartPosition>
        </TVLContent>
      </TVLSection>
    </>
  );
};

const ChartPosition = styled.div`
  @media only screen and (max-width: 900px) {
    position: relative;
    bottom: 42.5px;
  }

  @media only screen and (max-width: 639px) {
    position: relative;
    bottom: -32px;
  }
`;

export const TVLDateRangeWrapper = styled.div`
  display: flex;
  justify-content: center;

  padding-left: 16px;
  padding-right: 16px;
  margin: 0px 6px 0px 0px;

  height: 100%;
  width: 100%;

  border-radius: 99999px;

  cursor: pointer;

  background-color: transparent;

  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;

  :hover {
    background-color: black;
  }
`;

export const TVLDateRangeValue = styled.p`
  font-family: InterVariable, sans-serif;
  font-weight: 400;
  font-size: 14px;

  line-height: 21px;
  letter-spacing: 0px;

  color: ${fonts.colors.solid.white};
`;

export const TVLDateRanges = styled.div`
  @media only screen and (min-width: 900px) {
    display: flex;

    height: 36px;
    width: auto;

    padding: 6px;
    margin: 0px 0px 0px auto;

    border-radius: 99999px;

    -webkit-box-align: center;
    align-items: center;

    background-color: #1f242999;
  }

  @media only screen and (max-width: 900px) {
    position: relative;

    top: 280px;
    right: 25px;
    z-index: 2;

    display: flex;

    height: 42px;
    width: auto;

    margin-right: auto;
    margin-left: auto;

    padding: 6px;

    border-radius: 99999px;

    -webkit-box-align: center;
    align-items: center;

    background-color: #1f242999;
  }
`;

export const TinyValue = styled.p`
  font-family: InterVariable, sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #05c99b;

  line-height: 20px;
`;

const TVLPercentageValue = styled.p`
  font-family: InterVariable, sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #05c99b;

  line-height: 20px;
`;

const TVLDollarValue = styled.h3`
  font-family: Sohne, sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: #fff2fb;

  line-height: 34px;
`;

const TVLHeaderContent = styled.div`
  display: flex;
`;

const TVLContent = styled.div`
  display: flex;
  flex-direction: column;

  padding: 24px;

  height: 100%;

  border-bottom: 0px solid transparent;
  border-right: 0px solid transparent;

  border-bottom-width: 3px;
  border-bottom-style: solid;
`;

export const TVLSection = styled.div`
  // @todo Make sure that 40rem is accurate and that it does NOT need to be
  // included as default css
  @media screen and (min-width: 40em) {
    height: 380px;
  }

  backdrop-filter: ${cards.blur};
  box-shadow: ${cards.boxShadows.lightShadow};

  display: flex;
  position: relative;
  flex-direction: column;

  height: 300px;

  border-radius: 28px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;

  background-color: ${cards.backgroundColor};

  margin: 3px 0px;

  text-decoration: none;

  @media only screen and (max-width: 900px) {
    height: 362.5px;
  }
`;

export default TVL;
