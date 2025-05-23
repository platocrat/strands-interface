// Externals
import { Fragment, useContext } from "react";
import styled from "@emotion/styled";
// Locals
import { StyledLink } from "../../sections/strategies/strategy";
import CustomConnectButton from "../Connect/CustomConnectButton";
// Contexts
import { UnderlierContext } from "../../contexts/UnderlierContext";
// CSS
import { slhwa } from "../../theme/componentStyles";
// Images
import StrandsLogoPink from "../../assets/svg/strands-logos/strands-pink-logo.svg";

const headers = (
  assetName: string,
  assetSymbol: string
): { navName: string; toLink: string }[] => {
  return [
    { navName: "Vaults", toLink: `/vaults/${assetName}-${assetSymbol}` },
    { navName: "1Clicks", toLink: `/one-clicks/${assetName}-${assetSymbol}` },
    { navName: "Portfolio", toLink: `/portfolio` },
  ];
};

const Header = () => {
  const { assetName, assetSymbol } = useContext(UnderlierContext);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "1420px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SHeader>
            {/* Strands logo */}
            <div style={{ display: "flex" }}>
              <div style={{ display: "flex" }}>
                <StyledLink to={`/home`} style={{ display: "flex" }}>
                  <img
                    alt="strands-logo"
                    className="strands-logo"
                    width={slhwa}
                    height={slhwa}
                    // alt='strands logo pink'
                    src={StrandsLogoPink}
                  />
                </StyledLink>
              </div>
            </div>

            <HeaderLinks>
              <>
                {headers(assetName ?? "Ethereum", assetSymbol ?? "sETH").map(
                  (header: { navName: string; toLink: string }, i: number) => (
                    <Fragment key={`nav-header-${i}-${header.navName}`}>
                      <StyledLink to={header.toLink}>
                        <div
                          style={{
                            borderRadius: "3rem",
                            backdropFilter: "blur(100px)",
                            backgroundColor: "rgba(0, 0, 0, 0.125)",
                          }}
                        >
                          <button
                            className="anchor-button"
                            style={{
                              width: "95px",
                              height: "38.5px",
                              fontWeight: "600",
                            }}
                          >
                            {header.navName}
                          </button>
                        </div>
                      </StyledLink>
                    </Fragment>
                  )
                )}
              </>
            </HeaderLinks>
            <ConnectButtonSection>
              <CustomConnectButton isApp={true} />
            </ConnectButtonSection>
          </SHeader>
        </div>
      </div>
    </>
  );
};

const ConnectButtonSection = styled.div`
  display: flex;
  align-items: right;
  justify-content: right;

  @media only screen and (max-width: 901px) {
    display: none;
  }
`;

const HeaderLinks = styled.div`
  @media only screen and (max-width: 901px) {
    display: none;
  }

  display: flex;
  justify-content: center;
  gap: 10%;
`;

const SHeader = styled.div`
  display: grid;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  grid-template-columns: 1fr 1fr 1fr;

  padding: 15px 10px 10px 10px;

  backdrop-filter: blur(0.5px);

  width: 100%;

  margin-bottom: 25px;
`;

export default Header;
