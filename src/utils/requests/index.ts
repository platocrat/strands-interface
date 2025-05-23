// Locals
// Requests
import { getHistoricalCoingeckoPrice } from "./assetPrices/getHistoricalCoingeckoPrice";
import { getCoingeckoSimplePrice } from "./assetPrices/getCoingeckoPrice";
import { getLyraPrice } from "./assetPrices/getLyraPrice";
// Misc
import { getFormattedDate } from "../misc";

export async function getAndSetAssetPrice(
  chainId,
  assetName,
  setCurrentAssetPrice: React.Dispatch<React.SetStateAction<number>>
) {
  const currentAssetPrice_ = await getAssetPrice(
    chainId,
    assetName,
    setCurrentAssetPrice
  );

  if (setCurrentAssetPrice) {
    setCurrentAssetPrice(currentAssetPrice_);
  } else {
    return currentAssetPrice_;
  }
}

export async function getAssetPrice(
  chainId,
  assetName,
  setCurrentAssetPrice: React.Dispatch<React.SetStateAction<number>>
) {
  const currentAssetPrice_ = await getLyraPrice(chainId, assetName);

  return currentAssetPrice_;
}

export const getHistoricalAssetPrice = {
  weather: async (
    setCurrentAssetPrice: React.Dispatch<React.SetStateAction<number>>
  ) => {
    // do something...
    // ...return something
  },
  synthetixAsset: async (assetName: string): Promise<number> => {
    const today = new Date();

    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formattedYesterdayDate = getFormattedDate(yesterday);
    const json = await getHistoricalCoingeckoPrice(
      assetName,
      formattedYesterdayDate
    );
    const yesterdaysPrice = json.market_data.current_price.usd as number;

    return yesterdaysPrice;
  },
};
