// Externals
import { ApolloClient, InMemoryCache } from "@apollo/client";
// Locals
import {
  LYRA_OPTIMISM_SUBGRAPH_URL,
  LYRA_ARBITRUM_SUBGRAPH_URL,
  STRANDS_OPTIMISM_LGS_SUBGRAPH_URL,
  STRANDS_OPTIMISM_SGS_SUBGRAPH_URL,
  STRANDS_OPTIMISM_DSS_SUBGRAPH_URL,
  STRANDS_ARBITRUM_LGS_SUBGRAPH_URL,
  STRANDS_ARBITRUM_SGS_SUBGRAPH_URL,
  STRANDS_ARBITRUM_DSS_SUBGRAPH_URL,
  OPTIMISM_KWENTA_RATES_SUBGRAPH_URL,
} from "..";
import { OPTIMISM_MAINNET_CHAIN_ID } from "../../constants";

/**
 * @dev `a`pollo `c`lient for `d`elta `s`hort strategy on Optimism
 */
const optimismApolloClientDS = new ApolloClient({
  uri: STRANDS_OPTIMISM_DSS_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

const arbitrumApolloClientDS = new ApolloClient({
  uri: STRANDS_ARBITRUM_DSS_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

/**
 * @dev `a`pollo `c`lient for `l`ong `g`amma strategy on Optimism
 */
const optimismApolloClientLG = new ApolloClient({
  uri: STRANDS_OPTIMISM_LGS_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

/**
 * @dev `a`pollo `c`lient `l`ong `g`amma strategy on Optimism
 */
const arbitrumApolloClientLG = new ApolloClient({
  uri: STRANDS_ARBITRUM_LGS_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

/**
 * @dev `a`pollo `c`lient for `s`hort `g`amma strategy on Optimism
 */
const optimismApolloClientSG = new ApolloClient({
  uri: STRANDS_OPTIMISM_SGS_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

/**
 * @dev `a`pollo `c`lient for `s`hort `g`amma strategy on Arbitrum
 */
const arbitrumApolloClientSG = new ApolloClient({
  uri: STRANDS_ARBITRUM_SGS_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

const opLyraClient = new ApolloClient({
  uri: LYRA_OPTIMISM_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

const arbiLyraClient = new ApolloClient({
  uri: LYRA_ARBITRUM_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

const opSynthetixClient = new ApolloClient({
  uri: OPTIMISM_KWENTA_RATES_SUBGRAPH_URL,
  cache: new InMemoryCache(),
});


export const getApolloClient = {
  optimism: {
    synthetixClient: opSynthetixClient,
    vaults: {
      longGamma: optimismApolloClientLG,
      shortGamma: optimismApolloClientSG,
      coveredCall: optimismApolloClientDS,
    },
    lyra: opLyraClient,
  },
  arbitrum: {
    vaults: {
      longGamma: arbitrumApolloClientLG,
      shortGamma: arbitrumApolloClientSG,
      coveredCall: arbitrumApolloClientDS,
    },
    lyra: arbiLyraClient,
  },
};


export const lyraClient = (chainId: number) => {
  return getApolloClient[
    chainId === OPTIMISM_MAINNET_CHAIN_ID ? 'optimism' : 'arbitrum'
  ].lyra;
}