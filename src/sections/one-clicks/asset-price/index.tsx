// Externals
import { FC } from "react";
// Locals
import AssetPriceSpinner from "../../../components/Suspense/AssetPriceSpinner";
// CSS
import { numberWithCommas } from "../../../utils/misc";
// Props
import { AssetPriceProps } from "../../../utils/props";

const AssetPrice: FC<AssetPriceProps> = ({
  currentAssetPrice,
  assetPriceIsLoading,
}) => {
  return (
    <>
      <div className="asset-price-wrapper">
        {assetPriceIsLoading ? (
          <AssetPriceSpinner />
        ) : (
          `$${numberWithCommas(currentAssetPrice)}`
        )}
      </div>
    </>
  );
};

export default AssetPrice;
