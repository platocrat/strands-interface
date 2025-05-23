// Externals
import { FC } from "react";
import styled from "@emotion/styled";
// Locals
import { HeaderSectionProps } from "../../../utils/props";

const HeaderSection: FC<HeaderSectionProps> = ({ isDeposit, setIsDeposit }) => {
  return (
    <>
      <SHeaderSection>
        <HeaderWrapper>
          <TitleWrapper
            onClick={() => setIsDeposit(true)}
            style={{
              margin: isDeposit ? "0px 6px 0px 0px" : "",
              backgroundColor: isDeposit ? "#111416" : "transparent",
            }}
          >
            <DWTitle>{`Deposit`}</DWTitle>
          </TitleWrapper>
          <TitleWrapper
            onClick={() => setIsDeposit(false)}
            style={{
              margin: isDeposit ? "" : "0px 0px 0px 6px",
              backgroundColor: isDeposit ? "transparent" : "#111416",
            }}
          >
            <DWTitle>{`Withdraw`}</DWTitle>
          </TitleWrapper>
        </HeaderWrapper>
      </SHeaderSection>
    </>
  );
};

const DWTitle = styled.div`
  font-family: InterVariable, sans-serif;
  font-weight: 400;
  line-height: 21px;
  font-size: 14px;

  color: #ffffff;
`;

const TitleWrapper = styled.button`
  border-radius: 99999px;
  cursor: pointer;

  height: 100%;
  width: 100%;

  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;

  :hover {
    opacity: 0.7;
  }
`;

const HeaderWrapper = styled.div`
  border-radius: 99999px;

  -webkit-box-align: center;
  align-items: center;
  padding: 6px;
  background-color: #1f242999;
  height: 36px;
  width: 250px;
  display: flex;
`;

const SHeaderSection = styled.div`
  margin: 24px 24px 0px;

  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
`;

export default HeaderSection;
