import { apolloClient } from "../../../utils/subgraph";
import { spotPriceSnapshots } from "../../../utils/subgraph/graphql/queries/lyra";
import { getApolloClient } from "../../../utils/subgraph/graphql/clients";
import { utils } from "ethers";
import { getMarketAddress } from "../../../contract-apis/utils";

export async function getLyraPrice(chainId, assetName) {
  let assetSymbol;
  //ToDo: 1) use chainId to get spot for different chains
  //     2) probably should use map where people can look up chainId:[assetName:assetSymbol] and get the market address
  if (assetName == "bitcoin") {
    assetSymbol = "sBTC";
  } else {
    assetSymbol = "sETH";
  }
  const marketAddress = getMarketAddress(chainId, assetSymbol);

  const ret = await apolloClient(getApolloClient.lyra, spotPriceSnapshots, {
    first: 1000,
    orderBy: "timestamp",
    orderDirection: "desc",
    market: typeof marketAddress === "string" ? marketAddress : undefined,
  });

  return Number(utils.formatEther(ret["spotPriceSnapshots"][0]["spotPrice"]));
}
