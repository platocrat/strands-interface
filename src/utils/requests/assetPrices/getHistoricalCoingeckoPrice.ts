const getUrl = (_assetName: string, _date: string) => {
  const urlPrefix = `https://api.coingecko.com/api/v3/coins/${_assetName}`;
  const date = `/history?date=${_date}`;
  const localization = "&localization=false";
  const url = `${urlPrefix}${date}${localization}`;

  return url;
};

export async function getHistoricalCoingeckoPrice(
  assetName: string, // in lowercase format
  date: string // in `dd-mm-yyyy` format
) {
  const url = getUrl(assetName, date);
  const response = await fetch(url);
  const json = await response.json();

  return json;
}
