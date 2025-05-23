// Externals
import { FC, memo, useContext, useMemo } from "react";
// Locals
import AskPrice from "./AskPrice";
import BidAskSpinner from "../../../../Suspense/BidAskSpinner";
// Contexts
import { ocqmsContext } from "../../../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../../../contexts/OneClickContext";
import { BidAskMenuContext } from "../../../../../contexts/BidAskMenuContext";
// Types
import { ocType } from "../../../../../utils/types";
// Props
import { BidAskButtonProps } from "../../../../../utils/props";
// CSS
import { buttons } from "../../../../../theme/styles";

const AskButton: FC<BidAskButtonProps> = ({ isArbi, handleBidAsk }) => {
  const { showBidAsk, showSpinner, showAskCheckmark } =
    useContext(BidAskMenuContext);
  const { ocQuickMenuState } = useContext(ocqmsContext);
  const { arbitrumOC, optimismOC } = useContext(OneClickContext);

  const oneClick = useMemo((): ocType => {
    return (isArbi as boolean) ? arbitrumOC : optimismOC;
  }, [isArbi, arbitrumOC, optimismOC]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <button
          disabled={oneClick.noStrikeFound ? true : true}
          onClick={(e: any) => handleBidAsk(e, false)}
          style={{
            boxShadow: buttons.boxShadows.smPink,
            cursor: oneClick.noStrikeFound ? "not-allowed" : "",
          }}
          className={
            showAskCheckmark && ocQuickMenuState.isSubmittingTrade
              ? "combo-ask-price-button-selected"
              : `combo-ask-price-button-${isArbi ? "arbi" : "op"}`
          }
        >
          {showSpinner(isArbi) && <BidAskSpinner isBid={false} />}
          {showBidAsk(isArbi) && <AskPrice isArbi={isArbi} />}
        </button>
      </div>
    </>
  );
};

export default memo(AskButton);
