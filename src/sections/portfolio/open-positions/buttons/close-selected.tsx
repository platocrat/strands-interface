// Externals
import { FC } from "react";
// Locals
import TxTernaries from "../../../../components/TxTernaries";
// Props
import { CloseSelectedButtonProps } from "../../../../utils/props";
// Enums
import { CloseSelectedButton__Enum } from "../../../../utils/enums";
// CSS
import { fonts } from "../../../../theme/styles";
// Image
import { ReactComponent as XIconPinkSVG } from "../../../../assets/svg/x-icon-pink.svg";
import { ReactComponent as XIconGreenSVG } from "../../../../assets/svg/x-icon-green.svg";
import { ARBITRUM_MAINNET_CHAIN_ID } from "../../../../utils/constants";

const xIconStyle = {
  width: "20px",
  height: "20px",
  marginLeft: "3px",
  marginRight: "-4px",
};

const CloseSelectedButton: FC<CloseSelectedButtonProps> = ({
  web3User,
  suspense,
  positionIds,
  isCloseSelectedOn,
  handleCloseSelectedPositions,
}) => {
  const ETH =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + "ETH";

  function getCloseSelectedButtonState(
    switch_: CloseSelectedButton__Enum
  ): any {
    if (suspense.pendingTxConfirmation || suspense.pendingUserAction) {
      switch (switch_) {
        case CloseSelectedButton__Enum.DISABLED:
          return true;
        case CloseSelectedButton__Enum.BOX_SHADOW:
          return "none";
        case CloseSelectedButton__Enum.BORDER_COLOR:
          return fonts.colors.solid.darkPink;
        case CloseSelectedButton__Enum.CURSOR:
          return "not-allowed";
        case CloseSelectedButton__Enum.COLOR:
          return "";
        case CloseSelectedButton__Enum.X_ICON:
          return <XIconPinkSVG style={xIconStyle} />;
      }
    } else {
      if (
        positionIds.length > 1 &&
        isCloseSelectedOn &&
        positionIds[0].id.toNumber() === 0 &&
        positionIds[0].underlier === ETH
      ) {
        switch (switch_) {
          case CloseSelectedButton__Enum.DISABLED:
            return false;
          case CloseSelectedButton__Enum.BOX_SHADOW:
            return `0px 0px 10px ${fonts.colors.solid.green}`;
          case CloseSelectedButton__Enum.BORDER_COLOR:
            return fonts.colors.solid.green;
          case CloseSelectedButton__Enum.CURSOR:
            return "";
          case CloseSelectedButton__Enum.COLOR:
            return fonts.colors.solid.green;
          case CloseSelectedButton__Enum.X_ICON:
            return <XIconGreenSVG style={xIconStyle} />;
        }
      } else if (
        positionIds.length === 1 &&
        isCloseSelectedOn &&
        positionIds[0].id.toNumber() === 0 &&
        positionIds[0].underlier === ETH
      ) {
        switch (switch_) {
          case CloseSelectedButton__Enum.DISABLED:
            return true;
          case CloseSelectedButton__Enum.BOX_SHADOW:
            return "none";
          case CloseSelectedButton__Enum.BORDER_COLOR:
            return fonts.colors.solid.darkPink;
          case CloseSelectedButton__Enum.CURSOR:
            return "not-allowed";
          case CloseSelectedButton__Enum.COLOR:
            return fonts.colors.solid.darkPink;
          case CloseSelectedButton__Enum.X_ICON:
            return null;
        }
      } else {
        switch (switch_) {
          case CloseSelectedButton__Enum.DISABLED:
            return false;
          case CloseSelectedButton__Enum.BOX_SHADOW:
            return "";
          case CloseSelectedButton__Enum.BORDER_COLOR:
            return "";
          case CloseSelectedButton__Enum.CURSOR:
            return "";
          case CloseSelectedButton__Enum.COLOR:
            return "";
          case CloseSelectedButton__Enum.X_ICON:
            return <XIconPinkSVG style={xIconStyle} />;
        }
      }
    }
  }

  return (
    <>
      <button
        disabled={getCloseSelectedButtonState(0)}
        style={{
          marginRight: "14px",
          boxShadow: getCloseSelectedButtonState(1),
          borderColor: getCloseSelectedButtonState(2),
          cursor: getCloseSelectedButtonState(3),
          color: getCloseSelectedButtonState(4),
        }}
        className="position-history-button"
        onClick={(e: any) => handleCloseSelectedPositions(e)}
      >
        <TxTernaries
          style={{ margin: "0px 21.46px", padding: "8px" }}
          conditional1={suspense.pendingUserAction}
          conditional2={suspense.pendingTxConfirmation}
        >
          {`Close Selected`}
          {getCloseSelectedButtonState(5)}
        </TxTernaries>
      </button>
    </>
  );
};

export default CloseSelectedButton;
