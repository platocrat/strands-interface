import styled from "@emotion/styled";
import { FC } from "react";
import { ReactComponent as HamburgerMenuSVG } from "../../assets/svg/hamburger-menu.svg";
import CustomConnectButton from "../Connect/CustomConnectButton";

const Nav: FC = () => {
  function handleOpenNav(e: any) {
    console.log("Nav has been clicked!");
  }

  return (
    <>
      <NavSection className="mobile-only">
        {/* Left side nav - hamburger button */}
        <div className="mobile-only" style={{ display: "flex" }}>
          <ButtonSection className="mobile-only">
            <SButton
              className="mobile-only"
              onClick={(e: any) => handleOpenNav(e)}
            >
              <HamburgerMenuSVG className="mobile-only" />
            </SButton>
          </ButtonSection>
        </div>
        {/* Right side nav */}
        <RightSideNav className="mobile-only">
          {/** @todo Change `href` to app page */}
          <AnchorTag className="mobile-only">
            <CustomConnectButton className="mobile-only" />
          </AnchorTag>
        </RightSideNav>
      </NavSection>
    </>
  );
};

const AnchorTag = styled.div`
  margin: 0px 12px 0px auto;

  appearance: none;
  text-align: center;
  line-height: inherit;
  text-decoration: none;

  cursor: pointer;

  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-box-align: center;
  -webkit-box-pack: center;

  :active {
    transform: scaleX(0.98) scaleY(0.98);
  }
`;

const RightSideNav = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;

  -webkit-box-flex: 1;
  -webkit-box-align: center;
`;

const SButton = styled.div`
  width: 33px;
  height: 33px;

  // color: #7a8a9f;

  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-box-align: center;
  -webkit-box-pack: center;
`;

const ButtonSection = styled.div`
  cursor: pointer;

  border-right-width: 1px;
  border-right-style: solid;
  // border-color: #f2f2f2;

  height: 100%;
  width: 72px;

  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-box-pack: center;
  -webkit-box-align: center;
`;

const NavSection = styled.div`
  @media only screen and (max-width: 901px) {
    box-sizing: border-box;

    height: 72px;

    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;

    backdrop-filter: blur(50px);

    background-color: rgba(46, 39, 46, 0.95);

    // border-color: #f2f2f2;
    border-top-width: 1px;
    border-top-style: solid;

    z-index: 101;
    display: flex;
  }
`;

export default Nav;
