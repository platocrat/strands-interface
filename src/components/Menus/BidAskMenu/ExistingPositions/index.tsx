// Externals
import React, { FC, memo, useCallback, useContext } from "react";
// Locals
// Contexts
import { OneClickContext } from "../../../../contexts/OneClickContext";
// CSS
import { fonts } from "../../../../theme/styles";
import { cl, nFormatter } from "../../../../utils/misc";
// Types
import { ExistingPositionType__Display } from "../../../../utils/types";

export type ExistingPositionsProps = {
  filteredExistingPositions: ExistingPositionType__Display[];
};

const ExistingPositions: FC<ExistingPositionsProps> = ({
  filteredExistingPositions,
}) => {
  const { oneClick } = useContext(OneClickContext);
  /**
   * @todo Most of the time, when `oneClick.askPrice` and `oneClick.bidPrice`
   * updates, the values will be default
   */
  const textColor = useCallback(
    (eP: ExistingPositionType__Display) => {
      let _ = "";
      eP.isLong ? (_ = fonts.colors.solid.green) : (_ = fonts.colors.solid.red);
      return _;
    },
    [oneClick.bidPrice, oneClick.askPrice]
  );
  const existingPositionText = useCallback(
    (eP: ExistingPositionType__Display): string => {
      const isLong = eP.isLong ? "Long" : "Short";
      const isCall = eP.isCall ? "Call" : "Put";
      const positionDetails = `${
        eP.amount
      } ${isLong} ${isCall} with $${nFormatter(eP.collateral, 2)} collateral`;
      return positionDetails;
    },
    [oneClick.bidPrice, oneClick.askPrice]
  );

  return (
    <>
      {filteredExistingPositions.length < 1 ? null : (
        <>
          <div style={{ marginTop: "8px" }}>
            <div>{`Existing Positions:`}</div>
            <div>
              {filteredExistingPositions.map(
                (
                  eP: {
                    amount: number;
                    isCall: boolean;
                    isLong: boolean;
                    collateral: number;
                  },
                  i: number
                ) => (
                  <React.Fragment key={`existing-positions-${i}`}>
                    <div style={{ color: textColor(eP) }}>
                      {existingPositionText(eP)}
                    </div>
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(ExistingPositions);
