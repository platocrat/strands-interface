export const ETHEREUM_API_URL =
  "https://ethereum-api.xyz/eth-prices?fiat=USD,EUR,GBP,JPY";

export const getETHPriceInUSD = async () => {
  const response = await fetch(ETHEREUM_API_URL);
  const json: any = response.json();
  return json;
};
