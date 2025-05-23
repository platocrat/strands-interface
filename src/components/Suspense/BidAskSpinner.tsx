import { FC } from "react";
import Spinner from "./Spinner";

export type BidAskSpinnerProps = {
  isBid: boolean;
};

const BidAskSpinner: FC<BidAskSpinnerProps> = ({ isBid }) => {
  return (
    <>
      <Spinner
        width="18"
        height="18"
        style={{
          position: "relative",
          left: isBid ? "-5.5px" : "5.5px",
          top: "-0.5px",
        }}
      />
    </>
  );
};

export default BidAskSpinner;
