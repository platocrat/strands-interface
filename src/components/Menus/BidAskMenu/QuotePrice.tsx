// Externals
import { FC, memo, useContext, useMemo } from "react";
// Locals
import TxTernaries from "../../TxTernaries";
// Contexts
import { OneClickContext } from "../../../contexts/OneClickContext";
import { BidAskMenuContext } from "../../../contexts/BidAskMenuContext";
// Utils
import { cl, numberWithCommas } from "../../../utils/misc";
// Props and Types
import { QuotePriceProps } from "../../../utils/props";
import { ExistingPositionType__Display } from "../../../utils/types";
// CSS
import {
  pqtStyle,
  pqvStyle,
  definitelyCentered,
} from "../../../theme/componentStyles";
import { fonts } from "../../../theme/styles";

export function getTotalCost(
  ocQuote: number,
  collaterals: number[],
  isBid: boolean,
  strategyName: string,
  size?: number,
  ePs?: ExistingPositionType__Display[]
): number {
  if (isNaN(ocQuote) || isNaN(size as number) || size === 0) {
    return 0;
  } else {
    let totalCost = 0,
      strategyCost = 0;

    // Sum all collaterals
    strategyCost += collaterals.reduce((prev, next): number => prev + next, 0);
    // Add premium
    strategyCost += isBid ? ocQuote * -1 : ocQuote;
    // Subtract existing collateral
    strategyCost -=
      ePs !== undefined
        ? ePs.reduce((prev, next): number => prev + next.collateral, 0)
        : 0;

    totalCost = strategyCost;
    return totalCost;
  }
}

const QuotePrice: FC<QuotePriceProps> = ({
  size,
  isBid,
  trader,
  ocQuote,
  web3User,
  txSuspense,
}) => {
  const { oneClick } = useContext(OneClickContext);
  const { collaterals, existingPositions } = useContext(BidAskMenuContext);

  // Memoized constants
  const newCollateralsSum = useMemo((): number => {
    return collaterals.reduce((prev, next): number => prev + next, 0);
  }, [collaterals]);
  const oldCollateralsSum = useMemo((): number => {
    return existingPositions.reduce(
      (prev, next): number => prev + next.collateral,
      0
    );
  }, [existingPositions]);
  const finalCollateral = useMemo((): number => {
    return oldCollateralsSum + newCollateralsSum;
  }, [oldCollateralsSum, newCollateralsSum]);
  const lyraQuotePrice = useMemo((): string => {
    return isNaN(ocQuote) ? `$0.00` : `$${numberWithCommas(ocQuote)}`;
  }, [ocQuote]);
  const txTernaryText = useMemo((): string => {
    return web3User.account.address !== undefined &&
      web3User.chainId !== undefined &&
      web3User.provider !== undefined
      ? trader.needSUSD
        ? "Get sUSD"
        : trader.needGreaterAllowance
        ? `Approve sUSD`
        : trader.isApprovedForAll
        ? `Trade`
        : `Approve For All`
      : `Connect Your Wallet`;
  }, [
    trader.needSUSD,
    web3User.chainId,
    web3User.provider,
    trader.isApprovedForAll,
    web3User.account.address,
    trader.needGreaterAllowance,
  ]);
  const cursorStyle = useMemo((): string => {
    return web3User.account.address !== undefined &&
      web3User.chainId !== undefined &&
      web3User.provider !== undefined
      ? txSuspense.pendingTxConfirmation || txSuspense.pendingUserAction
        ? "not-allowed"
        : "pointer"
      : "pointer";
  }, [
    web3User.chainId,
    web3User.provider,
    web3User.account.address,
    txSuspense.pendingUserAction,
    txSuspense.pendingTxConfirmation,
  ]);
  const isTradeButtonDisabled = useMemo((): boolean => {
    return web3User.account.address !== undefined &&
      web3User.chainId !== undefined &&
      web3User.provider !== undefined
      ? txSuspense.pendingTxConfirmation || txSuspense.pendingUserAction
        ? true
        : false
      : false;
  }, [
    web3User.chainId,
    web3User.provider,
    web3User.account.address,
    txSuspense.pendingUserAction,
    txSuspense.pendingTxConfirmation,
  ]);

  return (
    <>
      {/* Grid */}
      <div
        className="bid-ask-menu-grid"
        style={{
          marginTop: "8px",
          marginBottom: finalCollateral === 0 ? "-20px" : "",
        }}
      >
        {/* Option quote price, including size and fees */}
        <div style={{ ...pqtStyle, width: "120px", marginTop: "10px" }}>
          {`Lyra's Quote Price `}
        </div>
        <div style={{ ...pqvStyle, width: "120px", marginTop: "10px" }}>
          {lyraQuotePrice}
        </div>

        {/* Tx cost */}
        <div style={{ ...pqtStyle, marginTop: "2px" }}>{`Total `}</div>
        <div style={{ ...pqvStyle, marginTop: "2px" }}>
          {`$${numberWithCommas(
            getTotalCost(
              ocQuote,
              collaterals,
              isBid,
              oneClick.strategyName,
              size,
              existingPositions
            )
          )}`}
        </div>
      </div>

      {/* Button Container */}
      <>
        <div
          style={{
            ...definitelyCentered,
            marginTop: "15px",
            marginBottom: "10px",
          }}
        >
          {/* Trade button */}
          <>
            <button
              disabled={isTradeButtonDisabled}
              type={"submit"}
              className="bid-ask-menu-button"
              style={{
                marginTop: "-24px",
                boxShadow:
                  txSuspense.pendingTxConfirmation ||
                  txSuspense.pendingUserAction
                    ? "none"
                    : "",
                borderColor:
                  txSuspense.pendingTxConfirmation ||
                  txSuspense.pendingUserAction
                    ? fonts.colors.solid.darkPink
                    : "",
                cursor: cursorStyle,
              }}
            >
              <TxTernaries
                style={{ margin: "-9px 0px", padding: "8px" }}
                conditional1={txSuspense.pendingUserAction}
                conditional2={txSuspense.pendingTxConfirmation}
              >
                {txTernaryText}
              </TxTernaries>
            </button>
          </>
        </div>
      </>

      {/** @todo Refactor error message to its own component */}
      {txSuspense.ctcCallReverted && (
        <>
          <h2
            style={{
              color: "#fc5151",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {`⛔️ ${txSuspense.revertMsg}`}
          </h2>
        </>
      )}
    </>
  );
};

export default memo(QuotePrice);
