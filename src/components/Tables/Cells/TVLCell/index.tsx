// Externals
import { FC, useContext } from "react";
import { UnderlierContext } from "../../../../contexts/UnderlierContext";
import { numberWithCommas } from "../../../../utils/misc";
import Spinner from "../../../Suspense/Spinner";

type TVLCellProps = {
  isHome?: boolean;
  stratTVL?: number;
  vaultName?: string;
  isAssetPriceLoading?: boolean;
};

const TVLCell: FC<TVLCellProps> = ({
  isHome,
  stratTVL,
  vaultName,
  isAssetPriceLoading,
}) => {
  const { assetSymbol } = useContext(UnderlierContext);

  const isStablecoin = vaultName !== "coveredCall";
  const tokenName = isStablecoin ? "sUSD" : assetSymbol;

  return (
    <>
      <div className="table-cell-value">
        { isHome ? (
          <>
            { isAssetPriceLoading ? (
              <Spinner height={ "20px" } width={ "20px" } />
            ) : (
              `$${numberWithCommas(stratTVL as number, 0)}`
            ) }
          </>
        ) : (
          <>
            { `${tokenName === "sETH" || tokenName === 'ETH'
              ? stratTVL?.toFixed(2)
              : tokenName === "sUSD" || tokenName === 'USDC'
                ? `${numberWithCommas(stratTVL as number, 0)}`
                : "0"
              } ${tokenName}` }
          </>
        ) }
      </div>
    </>
  );
};

export default TVLCell;
