// Externals
import { FC } from "react";

type StrikeCellProps = {
  strikePrice?: string;
};

const StrikeCell: FC<StrikeCellProps> = ({ strikePrice }) => {
  return (
    <div>
      <div className="table-cell-value">{strikePrice ?? `-4.71`}</div>
    </div>
  );
};

export default StrikeCell;
