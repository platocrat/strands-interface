// Externals
import { useNetwork } from "wagmi";
import { FC, memo, useContext, useMemo } from "react";
// Locals
import BidPrice from "./BidPrice";
import BidAskSpinner from "../../../../Suspense/BidAskSpinner";
// Contexts
import { ocqmsContext } from "../../../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../../../contexts/OneClickContext";
import { BidAskMenuContext } from "../../../../../contexts/BidAskMenuContext";
// Constants
import { ARBITRUM_MAINNET_CHAIN_ID } from "../../../../../utils/constants";
// Types
import { ocType } from "../../../../../utils/types";
// Props
import { BidAskButtonProps } from "../../../../../utils/props";
// CSS
import { buttons } from "../../../../../theme/styles";

const BidButton: FC<BidAskButtonProps> = ({ isArbi, handleBidAsk }) => {
  const { showBidAsk, showSpinner, showBidCheckmark } =
    useContext(BidAskMenuContext);
  const { ocQuickMenuState } = useContext(ocqmsContext);
  const { arbitrumOCs, optimismOCs, ocIndex } = useContext(OneClickContext);

  const oneClick = useMemo((): ocType => {
    return isArbi ? arbitrumOCs[ocIndex] : optimismOCs[ocIndex];
  }, [arbitrumOCs, optimismOCs, ocIndex, isArbi]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <button
          onClick={(e: any) => handleBidAsk(e, undefined, isArbi)}
          disabled={oneClick.noStrikeFound ? true : true}
          style={{
            boxShadow: buttons.boxShadows.smPink,
            cursor: oneClick.noStrikeFound ? "not-allowed" : "",
          }}
          className={
            showBidCheckmark && ocQuickMenuState.isSubmittingTrade
              ? "combo-bid-price-button-selected"
              : `combo-bid-price-button-${isArbi ? "arbi" : "op"}`
          }
        >
          {showSpinner(isArbi) && <BidAskSpinner isBid={true} />}
          {showBidAsk(isArbi) && <BidPrice isArbi={isArbi} />}
        </button>
      </div>
    </>
  );
};

export default memo(BidButton);
