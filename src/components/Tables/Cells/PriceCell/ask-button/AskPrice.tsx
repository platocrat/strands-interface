import { memo, useContext, useMemo } from "react";
import { OneClickContext } from "../../../../../contexts/OneClickContext";
// Utils
import { numberWithCommas } from "../../../../../utils/misc";
import { ocType } from "../../../../../utils/types";

const AskPrice = ({ isArbi }) => {
  const { arbitrumOCs, optimismOCs, ocIndex } = useContext(OneClickContext);

  const oneClick = useMemo((): ocType => {
    return (isArbi as boolean) ? arbitrumOCs[ocIndex] : optimismOCs[ocIndex];
  }, [arbitrumOCs, optimismOCs, ocIndex, isArbi]);
  return (
    <>
      <div className="combo-price">
        {!oneClick.noStrikeFound
          ? numberWithCommas(oneClick.askPrice) === `0.00`
            ? "-"
            : numberWithCommas(oneClick.askPrice)
          : "-"}
      </div>
    </>
  );
};

export default memo(AskPrice);
