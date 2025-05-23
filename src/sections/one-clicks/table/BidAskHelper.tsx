import { FC } from "react";
import { fonts } from "../../../theme/styles";

const BidAskHelper: FC = () => {
  return (
    <div
      style={{
        top: "30px",
        gap: "125px",
        // left: '250px',
        display: "flex",
        position: "relative",
        color: fonts.colors.solid.white,
        fontSize: fonts.sizes.biggieSmalls,
      }}
    >
      <div>{`Bid`}</div>
      <div>{`Ask`}</div>
    </div>
  );
};

export default BidAskHelper;
