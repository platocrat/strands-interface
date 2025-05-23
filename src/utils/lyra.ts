// Externals
import { ethers } from "ethers";
import Lyra from "@lyrafinance/lyra-js";
// Locals
import {
  LYRA_OPTIMISM_SUBGRAPH_URL,
  LYRA_ARBITRUM_SUBGRAPH_URL,
} from "./subgraph";

export const opLyra = new Lyra({
  provider: new ethers.providers.AlchemyProvider(
    "optimism",
    process.env.REACT_APP_ALCHEMY_OPTIMISM_KEY
  ),
  subgraphUri: LYRA_OPTIMISM_SUBGRAPH_URL,
});

export const arbiLyra = new Lyra({
  provider: new ethers.providers.AlchemyProvider(
    "arbitrum",
    process.env.REACT_APP_ALCHEMY_ARBITRUM_KEY
  ),
  subgraphUri: LYRA_ARBITRUM_SUBGRAPH_URL,
});
