// Externals
import { useMemo, useState, StrictMode, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { publicProvider } from "wagmi/providers/public";
import {
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import {
  WagmiConfig,
  createClient,
  configureChains,
  useProvider,
  useNetwork,
} from "wagmi";
import {
  darkTheme,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  ledgerWallet,
  rainbowWallet,
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
// Locals
import Vaults from "./pages/vaults";
import λStrategy from "./pages/λstrategy";
import Portfolio from "./pages/portfolio";
import GatedEntry from "./pages/gated-entry";
import OneClicksPage from "./pages/one-clicks";
import PortfolioHistory from "./pages/portfolio/history";
import Home from "./pages/home";
// Contexts
import { UnderlierContext } from "./contexts/UnderlierContext";
// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  assetObjs,
} from "./utils/constants";
// CSS
import { fonts } from "./theme/styles";
import "./OptimismApp.css";
import "./ArbitrumApp.css";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider, webSocketProvider } = configureChains(
  [
    optimism,
    arbitrum,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === "true"
      ? [optimismGoerli, arbitrumGoerli]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.REACT_APP_ALCHEMY_OPTIMISM_KEY as string,
    }),
    //publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [metaMaskWallet({ chains })],
  },
  {
    groupName: "Others",
    wallets: [
      walletConnectWallet({ chains: chains }),
      rainbowWallet({ chains: chains }),
      coinbaseWallet({ appName: "Strands Finance", chains: chains }),
      braveWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const CoreApp = () => {
  const { chain } = useNetwork();

  const [assetName, setAssetName] = useState<string>(assetObjs[0].assetName);
  const [assetSymbol, setAssetSymbol] = useState<string>(
    assetObjs[0].assetSymbol
  );
  const [selectedMode, setSelectedMode] = useState<number>(
    chain?.id === OPTIMISM_MAINNET_CHAIN_ID ? 1 : 3
  );

  useEffect(() => {
    if (chain?.id === OPTIMISM_MAINNET_CHAIN_ID && selectedMode !== 2) {
      setSelectedMode(1);
    }
    if (chain?.id === ARBITRUM_MAINNET_CHAIN_ID && selectedMode !== 2) {
      setSelectedMode(3);
    }
  }, [chain?.id]);
  return (
    <>
      <StrictMode>
        <BrowserRouter>
          <ChakraProvider theme={{}}>
            <WagmiConfig client={client}>
              <RainbowKitProvider
                chains={chains}
                theme={darkTheme({
                  fontStack: "system",
                  overlayBlur: "small",
                  borderRadius: "small",
                  accentColor: fonts.colors.solid.magenta,
                  accentColorForeground: fonts.colors.solid.white,
                })}
              >
                <UnderlierContext.Provider
                  value={{
                    assetName,
                    assetSymbol,
                    setAssetName,
                    setAssetSymbol,
                  }}
                >
                  <Routes>
                    {/* Landing page content */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<GatedEntry />} />
                    <Route
                      path="/vaults/:assetName-:assetSymbol"
                      element={<Vaults />}
                    />
                    <Route
                      path="/one-clicks/:assetName-:assetSymbol"
                      element={
                        <OneClicksPage
                          selectedMode={selectedMode}
                          setSelectedMode={setSelectedMode}
                        />
                      }
                    />
                    <Route
                      path="vaults/:assetName-:assetSymbol/strategies/:vaultName/:vaultAddress"
                      element={
                        // eslint-disable-next-line react/jsx-pascal-case
                        <λStrategy />
                      }
                    />
                    <Route
                      path="portfolio"
                      element={
                        <Portfolio
                          assetName={assetName}
                          assetSymbol={assetSymbol}
                        />
                      }
                    />
                    <Route
                      path="portfolio/history"
                      element={
                        <PortfolioHistory
                          assetName={assetName}
                          assetSymbol={assetSymbol}
                        />
                      }
                    />
                  </Routes>
                </UnderlierContext.Provider>
              </RainbowKitProvider>
            </WagmiConfig>
          </ChakraProvider>
        </BrowserRouter>
      </StrictMode>
    </>
  );
};

const App = () => {
  const provider = useProvider();

  const isOnOptimism = useMemo((): boolean => {
    return provider.network.chainId === OPTIMISM_MAINNET_CHAIN_ID;
  }, [provider.network.chainId]);
  const isOnArbitrum = useMemo((): boolean => {
    return provider.network.chainId === ARBITRUM_MAINNET_CHAIN_ID;
  }, [provider.network.chainId]);

  const strandsBackgroundClassName = useMemo((): string => {
    if (isOnOptimism) {
      return "strands-optimism-background";
    } else if (isOnArbitrum) {
      return "strands-arbitrum-background";
    } else {
      return "strands-optimism-background";
    }
  }, [isOnArbitrum, isOnOptimism]);

  return (
    // `BrowserRouter` is required for `NavLink` and `Link` components to work
    <>
      <html className={strandsBackgroundClassName}>
        <CoreApp />
      </html>
    </>
  );
};

export default App;
