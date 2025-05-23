import {
  SGVA__OPTIMISM_MAINNET,
  LGSSVA__OPTIMISM_MAINNET,
  DSSSLVA__OPTIMISM_GOERLI,
  DSSSLVA__OPTIMISM_MAINNET,
} from "./constants";
import { StrandsEVMContractsObjectType } from "./types";

// -------------------------------- Contracts ----------------------------------
export const evmContracts: StrandsEVMContractsObjectType = {
  vaults: {
    coveredCall: {
      vaultName: {
        title: "Covered Call",
        key: "coveredCall",
      },
      address: {
        optimism: {
          testnet: DSSSLVA__OPTIMISM_GOERLI,
          mainnet: DSSSLVA__OPTIMISM_MAINNET,
        },
        arbitrum: {
          testnet: "DSSSLVA__ARBITRUM_GOERLI",
          mainnet: "DSSSLVA__ARBITRUM_MAINNET",
        },
      },
      isActive: true,
    },
    longGamma: {
      vaultName: {
        title: "Long Gamma",
        key: "longGamma",
      },
      address: {
        optimism: {
          testnet: "",
          mainnet: LGSSVA__OPTIMISM_MAINNET,
        },
        arbitrum: {
          testnet: "LGSSVA__ARBITRUM_GOERLI",
          mainnet: "LGSSVA__ARBITRUM_MAINNET",
        },
      },
      isActive: true,
    },
    shortGamma: {
      vaultName: {
        title: "Short Gamma",
        key: "shortGamma",
      },
      address: {
        optimism: {
          testnet: "SGVA__OPTIMISM_GOERLI",
          mainnet: SGVA__OPTIMISM_MAINNET,
        },
        arbitrum: {
          testnet: "SGVA__ARBITRUM_GOERLI",
          mainnet: "SGVA__ARBITRUM_MAINNET",
        },
      },
      isActive: true,
    },
    redacted0: {
      vaultName: {
        title: "<REDACTED>",
        key: "redacted0",
      },
      address: {
        optimism: {
          testnet: "SGVA__OPTIMISM_GOERLI",
          mainnet: SGVA__OPTIMISM_MAINNET,
        },
        arbitrum: {
          testnet: "SGVA__ARBITRUM_GOERLI",
          mainnet: "SGVA__ARBITRUM_MAINNET",
        },
      },

      isActive: false,
    },
  },
  keepers: {},
};

export const evmOCNames = {
  synthetic: {
    title: "Synthetic",
    key: "synthetic",
  },
  callSpread: {
    title: "Call Spread",
    key: "callSpread",
  },
  putSpread: {
    title: "Put Spread",
    key: "putSpread",
  },
  straddle: {
    title: "Straddle",
    key: "straddle",
  },
  strangle: {
    title: "Strangle",
    key: "strangle",
  },
  roll: {
    title: "Roll",
    key: "roll",
  },
};

/**
 * @dev Solana vault and keeper contract addresses.
 */
const solanaCtcs = {
  vaults: {
    coveredCall: {
      vaultName: "Covered Call",
      addresses: [
        // Index 0 for delta short strategies
        {
          programID: "",
        },
        // Index 1 for delta long strategies
        {
          programID: "",
        },
      ],
    },
    keepers: {},
  },
};

/**
 * @dev Global contract metadata
 */
export const globalMetadata = {
  chains: {
    ethereum: {
      contracts: evmContracts,
    },
    solana: {
      contracts: solanaCtcs,
    },
  },
};
