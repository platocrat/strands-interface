// Externals
import { FC } from "react";
// Locals
// CSS
import { slhwl, bsbc } from "../../../theme/componentStyles";
import { fonts, containers, cards } from "../../../theme/styles";
// Images
import StrandsLogoPink from "../../../assets/svg/strands-logos/strands-white-logo.svg";

export type PageLockMessageProps = {
  isMobile: boolean;
  isDesktop: boolean;
  isConnectedToOptimism?: boolean;
};

const PageLockMessage: FC<PageLockMessageProps> = ({
  isMobile,
  isDesktop,
  isConnectedToOptimism,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          top: "100px",
          position: "relative",
          zIndex: "11",
        }}
      >
        <img
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "270px",
            marginBottom: "40px",
            top: isMobile ? "" : "25px",
            left: isMobile ? "" : "25px",
          }}
          width={isMobile ? "32%" : isDesktop ? "52%" : slhwl}
          height={isMobile ? "32%" : isDesktop ? "52%" : slhwl}
          alt="strands logo pink"
          src={StrandsLogoPink}
        />
        <p
          style={{
            display: "flex",
            flexDirection: "row",
            color: fonts.colors.solid.white,
            boxShadow: containers.boxShadows.softPink,
            border: containers.borders.mdPink,
            padding: "30px",
            width: "400px",
            textAlign: "center",
            fontSize: "20px",
            filter: fonts.filters["drop-shadow"].transparent.hardDarkPink,
            borderRadius: bsbc.borderRadius,
            backgroundColor: cards.backgroundColor,
            backdropFilter: "blur(5.6px)",
          }}
        >
          {"Your address does not hold a StrandsFirst100"}
          <br />
          {` NFT!`}
        </p>
      </div>
    </>
  );
};

export default PageLockMessage;
