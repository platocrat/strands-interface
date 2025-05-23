import { FC, memo, useContext } from "react";
// Locals
import { QuickMenuButtonProps } from "../../../utils/props";
// Contexts
import { ocqmsContext } from "../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../contexts/OneClickContext";
import { BidAskMenuContext } from "../../../contexts/BidAskMenuContext";
// Images
import { ReactComponent as PlusPinkIconSVG } from "../../../assets/svg/plus-icon-pink.svg";
import { ReactComponent as PlusWhiteIconSVG } from "../../../assets/svg/plus-icon-white.svg";
import { ReactComponent as MinusWhiteIconSVG } from "../../../assets/svg/minus-icon-white.svg";
import { ReactComponent as MinusPinkIconSVG } from "../../../assets/svg/minus-icon-pink.svg";
import { ReactComponent as CheckIconSVG } from "../../../assets/svg/check-icon-white.svg";

const QuickMenuButton: FC<QuickMenuButtonProps> = ({ isBid }) => {
  const { oneClick } = useContext(OneClickContext);
  const { ocQuickMenuState } = useContext(ocqmsContext);
  const { handleShowBidAskQuickMenu } = useContext(BidAskMenuContext);
  const { showAskCheckmark, showBidCheckmark } = useContext(BidAskMenuContext);

  function getClassName(isBid: boolean) {
    if (isBid) {
      return showBidCheckmark &&
        (ocQuickMenuState.isSubmittingTrade ||
          ocQuickMenuState.isOpenOCQuickMenu)
        ? "combo-bid-menu-button-selected"
        : "combo-bid-menu-button";
    } else {
      return showAskCheckmark &&
        (ocQuickMenuState.isSubmittingTrade ||
          ocQuickMenuState.isOpenOCQuickMenu)
        ? "combo-ask-menu-button-selected"
        : "combo-ask-menu-button";
    }
  }

  function getIconComponent(isBid: boolean) {
    if (isBid) {
      return ocQuickMenuState.isOpenOCQuickMenu && showBidCheckmark ? (
        <MinusWhiteIconSVG />
      ) : showBidCheckmark && ocQuickMenuState.isSubmittingTrade ? (
        <CheckIconSVG />
      ) : (
        <MinusPinkIconSVG />
      );
    } else {
      return ocQuickMenuState.isOpenOCQuickMenu &&
        !ocQuickMenuState.isSubmittingTrade &&
        showAskCheckmark ? (
        <PlusWhiteIconSVG />
      ) : showAskCheckmark && ocQuickMenuState.isSubmittingTrade ? (
        <CheckIconSVG />
      ) : (
        <PlusPinkIconSVG />
      );
    }
  }

  return (
    <>
      <button
        style={{
          outline: "none",
          cursor: oneClick.noStrikeFound ? "not-allowed" : "",
        }}
        disabled={oneClick.noStrikeFound ? true : false}
        onClick={(e: any) => handleShowBidAskQuickMenu(isBid)}
        className={getClassName(isBid)}
      >
        <div className="combo-menu-button-svg-wrapper">
          {getIconComponent(isBid)}
        </div>
      </button>
    </>
  );
};

export default memo(QuickMenuButton);
