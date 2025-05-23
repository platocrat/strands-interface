// Externals
import { FC } from "react";
// Locals
import TxTernaries from "../../../../components/TxTernaries";
// CSS
import { fonts } from "../../../../theme/styles";
import { CloseAllButtonProps } from "../../../../utils/props";
// Images
import { ReactComponent as XIconPinkSVG } from "../../../../assets/svg/x-icon-pink.svg";
import { ReactComponent as XIconDarkPinkSVG } from "../../../../assets/svg/x-icon-dark-pink.svg";

const CloseAllButton: FC<CloseAllButtonProps> = ({
  suspense,
  isCloseSelectedOn,
  handleCloseAllPositions,
}) => {
  return (
    <>
      <button
        disabled={isCloseSelectedOn}
        style={{
          marginRight: "14px",
          boxShadow:
            suspense.pendingUserAction || suspense.pendingTxConfirmation
              ? "none"
              : isCloseSelectedOn
              ? "none"
              : "",
          color: isCloseSelectedOn ? fonts.colors.solid.darkPink : "",
          borderColor:
            suspense.pendingUserAction || suspense.pendingTxConfirmation
              ? fonts.colors.solid.darkPink
              : isCloseSelectedOn
              ? fonts.colors.solid.darkPink
              : "",
          cursor:
            suspense.pendingUserAction || suspense.pendingTxConfirmation
              ? "not-allowed"
              : isCloseSelectedOn
              ? "not-allowed"
              : "",
        }}
        className={"position-history-button"}
        onClick={(e: any) => handleCloseAllPositions(e)}
      >
        <TxTernaries
          style={{ margin: "0px 21.46px", padding: "8px" }}
          conditional1={suspense.pendingUserAction}
          conditional2={suspense.pendingTxConfirmation}
        >
          {`Close All`}
          {isCloseSelectedOn ? (
            <>
              <XIconDarkPinkSVG
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "3px",
                }}
              />
            </>
          ) : (
            <>
              <XIconPinkSVG
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "3px",
                }}
              />
            </>
          )}
        </TxTernaries>
      </button>
    </>
  );
};

export default CloseAllButton;
