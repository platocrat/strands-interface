// Externals
import { FC } from "react";
// Locals
import TxTernaries from "../../../../components/TxTernaries";
// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  INIT_ZERO,
} from "../../../../utils/constants";
// Enums
import { CancelCloseSelectedButton__Enum } from "../../../../utils/enums";
// Props
import { CancelCloseSelectedButtonProps } from "../../../../utils/props";
// CSS
import { fonts } from "../../../../theme/styles";
import { toBN } from "../../../../utils/misc";

const CancelCloseSelectedButton: FC<CancelCloseSelectedButtonProps> = ({
  web3User,
  suspense,
  setPositionIds,
  setIsCloseSelectedOn,
}) => {
  const ETH =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + "ETH";

  function getCancelCloseSelectedButtonState(
    switch_: CancelCloseSelectedButton__Enum
  ): any {
    if (suspense.pendingTxConfirmation || suspense.pendingUserAction) {
      switch (switch_) {
        case CancelCloseSelectedButton__Enum.DISABLED:
          return true;
        case CancelCloseSelectedButton__Enum.BOX_SHADOW:
          return "none";
        case CancelCloseSelectedButton__Enum.BORDER_COLOR:
          return fonts.colors.solid.darkPink;
        case CancelCloseSelectedButton__Enum.CURSOR:
          return "not-allowed";
        case CancelCloseSelectedButton__Enum.COLOR:
          return "";
      }
    } else {
      switch (switch_) {
        case CancelCloseSelectedButton__Enum.DISABLED:
          return false;
        case CancelCloseSelectedButton__Enum.BOX_SHADOW:
          return `0px 0px 10px ${fonts.colors.solid.red}`;
        case CancelCloseSelectedButton__Enum.BORDER_COLOR:
          return fonts.colors.solid.red;
        case CancelCloseSelectedButton__Enum.CURSOR:
          return "";
        case CancelCloseSelectedButton__Enum.COLOR:
          return fonts.colors.solid.red;
      }
    }
  }

  return (
    <>
      <button
        disabled={getCancelCloseSelectedButtonState(0)}
        style={{
          marginRight: "14px",
          boxShadow: getCancelCloseSelectedButtonState(1),
          borderColor: getCancelCloseSelectedButtonState(2),
          cursor: getCancelCloseSelectedButtonState(3),
          color: getCancelCloseSelectedButtonState(4),
        }}
        className="position-history-button"
        onClick={(e: any) => {
          setIsCloseSelectedOn(false);
          setPositionIds([{ id: toBN("0"), underlier: ETH }]);
        }}
      >
        <TxTernaries
          style={{ margin: "0px 21.46px", padding: "8px" }}
          conditional1={suspense.pendingUserAction}
          conditional2={suspense.pendingTxConfirmation}
        >
          {`Cancel`}
          {/* <XIconSVG
            style={ {
              width: '20px',
              height: '20px',
              marginLeft: '3px',
              marginBottom: '2px',
            } }
          /> */}
        </TxTernaries>
      </button>
    </>
  );
};

export default CancelCloseSelectedButton;
