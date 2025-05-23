// Externals
import { FC, useContext } from "react";
// Locals
import EthLogo from "../../assets/png/token-logos/eth-logo.png";
import BtcLogo from "../../assets/png/token-logos/btc-logo.png";
import LinkLogo from "../../assets/png/token-logos/link-logo.png";
import SolLogo from "../../assets/png/token-logos/sol-logo.png";
import SusdLogo from "../../assets/png/token-logos/susd-logo.png";
import { ReactComponent as UsdcSVG } from "../../assets/svg/token-logos/usdc.svg";
import { ReactComponent as StrandsLogoSVG } from "../../assets/svg/strands-logos/strands-white-logo.svg";
// Contexts
import { UnderlierContext } from "../../contexts/UnderlierContext";

type AssetImgTernaryProps = {
  style?: any;
  isHome?: boolean;
  _assetSymbol?: string;
};

const AssetImgTernary: FC<AssetImgTernaryProps> = ({
  style,
  isHome,
  _assetSymbol,
}) => {
  const { assetSymbol } = useContext(UnderlierContext);

  function getAssetLogo(): string | undefined {
    switch (_assetSymbol ?? assetSymbol) {
      case "ETH":
      case "sETH":
      case "wETH":
        return EthLogo;
      case "BTC":
      case "sBTC":
      case "wBTC":
        return BtcLogo;
      case "SOL":
        return SolLogo;
      case "LINK":
        return LinkLogo;
      case "sUSD":
        return SusdLogo;
      case "USDC":
        return SusdLogo;
    }
  }

  return (
    <>
      {isHome ? (
        <>
          <StrandsLogoSVG
            style={{
              ...style,
              borderRadius: "32px",
              objectFit: "contain",
              position: "relative",
              bottom: "4.5px",
              width: "84px",
              height: "84px",
              minWidth: "84px",
              minHeight: "84px",
              marginTop: "-24px",
              marginBottom: "-14px",
            }}
          />
        </>
      ) : (
        <>
          {_assetSymbol === "USDC" ? (
            <>
              <UsdcSVG
                style={{
                  ...style,
                  borderRadius: "32px",
                  objectFit: "contain",
                  position: "relative",
                  bottom: "4.5px",
                  width: "84px",
                  height: "84px",
                  minWidth: "84px",
                  minHeight: "84px",
                  marginTop: "-24px",
                  marginBottom: "-14px",
                }}
              />
            </>
          ) : (
            <>
              <img
                alt={`${assetSymbol}-logo`}
                src={getAssetLogo()}
                style={{
                  ...style,
                  borderRadius: "32px",
                  objectFit: "contain",
                  width: "32px",
                  height: "32px",
                  minWidth: "32px",
                  minHeight: "32px",
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AssetImgTernary;
