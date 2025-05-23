const getUrl = (assetName: string) => {
  const urlPrefix = "https://api.coingecko.com/api/v3/simple/price?ids=";
  const usdCurrency = "&vs_currencies=usd";
  const url = `${urlPrefix}${assetName}${usdCurrency}`;

  return url;
};

export async function getCoingeckoSimplePrice(assetName: string) {
  const url = getUrl(assetName);
  const response = await fetch(url);
  const json = await response.json();

  return json;
}
