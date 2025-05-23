import { memo, useContext, useMemo } from "react";
import { OneClickContext } from "../../../../../contexts/OneClickContext";
// Locals
// Utils
import { numberWithCommas } from "../../../../../utils/misc";
import { ocType } from "../../../../../utils/types";

const BidPrice = ({ isArbi }) => {
  const { arbitrumOCs, optimismOCs, ocIndex } = useContext(OneClickContext);

  const oneClick = useMemo((): ocType => {
    return (isArbi as boolean) ? arbitrumOCs[ocIndex] : optimismOCs[ocIndex];
  }, [arbitrumOCs, optimismOCs, ocIndex, isArbi]);
  return (
    <>
      <div className="combo-price">
        {!oneClick.noStrikeFound &&
        numberWithCommas(oneClick.bidPrice) !== `0.00`
          ? numberWithCommas(oneClick.bidPrice)
          : "-"}
      </div>
    </>
  );
};

export default memo(BidPrice);
