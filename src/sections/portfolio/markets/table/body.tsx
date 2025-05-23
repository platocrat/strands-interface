// Externals
import React, { FC } from "react";
// Locals
import MarketsTableRow from "./row";
// Types
import { MarketsTableBodyProps } from "../../../../utils/props";

const MarketsTableBody: FC<MarketsTableBodyProps> = ({ markets }) => {
  return (
    <>
      {/* Market body */}
      <tbody>
        {/* Rows of markets */}
        {markets.map((market: any, i: number) => (
          <React.Fragment key={`${i}-${market.name}`}>
            <MarketsTableRow market={market} />
          </React.Fragment>
        ))}
      </tbody>
    </>
  );
};

export default MarketsTableBody;
