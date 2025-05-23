// Externals
import { BigNumber } from "ethers";
import styled from "@emotion/styled";
import Wei, { wei } from "@synthetixio/wei";
import { useParams } from "react-router-dom";
import { useLayoutEffect, useMemo, useState } from "react";
import { useAccount, useNetwork, useProvider, useSwitchNetwork } from "wagmi";
// Locals
import Nav from "../../components/Nav";
import Header from "../../components/Header";
import PageLock from "../../components/PageLock";
import MyBalances from "../../components/MyBalances";
import ProductInfo from "../../components/ProductInfo";
import MobileDepositWithdraw from "./mobile-deposit-withdraw";
// Sections
import TVL from "../../sections/λstrategy/tvl";
import Stats from "../../sections/λstrategy/stats";
import PageHeader from "../../sections/λstrategy/page-header";
import VaultTrades from "../../sections/λstrategy/vault-trades";
import DepositWithdraw from "../../sections/λstrategy/deposit-withdraw";
// APIs
import {
  vaultState,
  vaultParams,
  shareBalances,
  depositReceipts,
  shares,
} from "../../contract-apis/apis/strandsLyraVault";
import { Vault } from "../../contract-apis/types/StrandsLyraVault";
// Requests
import {
  apolloClient,
  getRoundStatus,
  get30DayVolume,
  getCurrentRound,
  getPendingDeposits,
  getCurrentVaultShares,
  getPendingWithdrawals,
  getTotalPendingDeposits,
  getCurrentTotalValueLocked,
  getPricePerShare,
} from "../../utils/subgraph";
import { getAndSetAssetPrice } from "../../utils/requests";
// Subgraph queries
import {
  getLasts,
  getLastsByAccount,
} from "../../utils/subgraph/graphql/queries/vaults";
// APIs
import { roundEnds } from "../../contract-apis/apis/strandsLyraVault";
// Subgraph utils
import { getApolloClient } from "../../utils/subgraph/graphql/clients";
// Utils
import {
  bnToNumber,
  getVaultButtonState,
  web3UserIsUndefined,
  fixedDecimals,
  toBN,
  cl,
} from "../../utils/misc";
// Constants
import {
  INIT_ZERO,
  initVaultState,
  initVaultParams,
  initShareBalances,
  initDepositReceipts,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../utils/constants";
// Types
import {
  Web3UserType,
  VaultStateType,
  ShareBalancesType,
  DepositReceiptsStructType,
} from "../../utils/types";
// CSS
import { definitelyCentered } from "../../theme/componentStyles";

const λStrategy = () => {
  // Web3 user vars
  const account = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  let web3User_: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  const { switchNetwork } = useSwitchNetwork();

  // Page params
  const { assetName, assetSymbol, vaultName, vaultAddress } = useParams();
  // Number
  const [withdrawalRound_, setWithdrawalRound] = useState<number>(0);
  // Wei
  const [allowance_, setAllowance] = useState<BigNumber>(toBN(0));
  // const [approvedAllowance, setApprovedAllowance] = useState<Wei>(wei(0))
  // BigNumbers
  const [quoteBalance, setQuoteBalance] = useState<BigNumber>(INIT_ZERO);
  // booleans
  const [pendingTxConfirmation, setPendingTxConfirmation] =
    useState<boolean>(false);
  const [isDeposit, setIsDeposit] = useState<boolean>(true);
  // const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false)
  const [isCorrectChainId, setIsCorrectChainId] = useState<boolean>(false);
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false);
  // String
  const [txHash, setTxHash] = useState<string>("");
  const [revertMsg, setRevertMsg] = useState<string>("");
  const [roundStatus, setRoundStatus] = useState<string>("");
  const [roundEnds_, setRoundEnds] = useState<string>(
    new Date().toDateString()
  );
  // Number
  const [totalPending, setTotalPending] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [lockedAmount, setLockedAmount] = useState<number>(0);
  const [thirtyDayVolume, set30DayVolume] = useState<number>(0);
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(0);
  const [pendingDeposits, setPendingDeposits] = useState<number>(0);
  const [totalValueLocked, setTotalValueLocked] = useState<number>(0);
  const [currentVaultShares, setCurrentVaultShares] = useState<number>(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<number>(0);
  const [totalPendingDeposits, setTotalPendingDeposits] = useState<number>(0);
  const [pricePerShare, setPricePerShare] = useState<number>(0);
  // boolean
  const [txConfirmed, setTxConfirmed] = useState<boolean>(false);
  const [edIsLoading, setEdIsLoading] = useState<boolean>(false);
  const [chartDataLoaded, setChartDataLoaded] = useState<boolean>(false);
  const [isRoundInProgress, setIsRoundInProgress] = useState<boolean>(false);
  // BigNumber
  const [accountVaultBalance_, setAccountVaultBalance] =
    useState<BigNumber>(INIT_ZERO);
  const [shares_, setShares] = useState<BigNumber>(INIT_ZERO);
  const [amount, setAmount] = useState<BigNumber | number>(INIT_ZERO);
  /**
   * @dev - A.K.A. queued shares to be withdrawn,
   */
  const [withdrawalShares_, setWithdrawalShares] =
    useState<BigNumber>(INIT_ZERO);
  // Custom
  const [vaultParams_, setVaultParams] =
    useState<Vault.VaultParamsStruct>(initVaultParams);
  const [shareBalances_, setShareBalances] =
    useState<ShareBalancesType>(initShareBalances);
  const [depositReceipts_, setDepositReceipts] =
    useState<DepositReceiptsStructType>(initDepositReceipts);
  const [web3User, setWeb3User] = useState<Web3UserType>(web3User_);
  const [vaultState_, setVaultState] = useState<VaultStateType>(initVaultState);

  //---------------------------- Constant booleans -----------------------------
  const networkName = chain?.id === OPTIMISM_MAINNET_CHAIN_ID
    ? 'optimism'
    : 'arbitrum'
  //---------------------------- Memoized Constant booleans --------------------
  const canCompleteWithdrawal = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      return withdrawalShares_.gt(0) && withdrawalRound_ < currentRound;
    } else {
      return false;
    }
  }, [
    amount,
    txConfirmed,
    currentRound,
    account.address,
    withdrawalRound_,
    account.connector,
    withdrawalShares_,
    provider.network.name,
    provider.network.chainId,
  ]);
  const hasPendingWithdrawal = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      return (
        withdrawalRound_ <= currentRound &&
        accountVaultBalance_.eq(0) &&
        parseFloat(withdrawalShares_.toString()) / 1e18 > 0.0000001
      );
    } else {
      return false;
    }
  }, [
    shares_,
    txConfirmed,
    currentRound,
    account.address,
    withdrawalRound_,
    web3User_.chainId,
    withdrawalShares_,
    account.connector,
    provider.network.name,
    provider.network.chainId,
  ]);
  const isValidAmount = useMemo((): boolean => {
    return BigNumber.isBigNumber(amount)
      ? parseFloat(amount.toString()) / 1e18 > 0
      : amount > 0;
  }, [
    amount,
    account.address,
    provider.network.name,
    provider.network.chainId,
  ]);
  const needGreaterAllowance = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      return allowance_.lte(amount);
    } else {
      return false;
    }
  }, [
    amount,
    allowance_,
    account.address,
    provider.network.name,
    provider.network.chainId,
  ]);
  const needMoreDepositAsset = useMemo((): boolean => {
    return BigNumber.isBigNumber(amount)
      ? quoteBalance.lt(amount)
      : bnToNumber(quoteBalance) < amount;
  }, [
    amount,
    txConfirmed,
    quoteBalance,
    account.address,
    provider.network.name,
    provider.network.chainId,
  ]);
  const isPinkButton = useMemo(() => {
    if (pendingTxConfirmation || pendingUserAction) {
      return false;
    } else {
      return getVaultButtonState(
        web3User,
        {
          needMoreDepositAsset: needMoreDepositAsset,
          isDeposit: isDeposit,
          isValidAmount: isValidAmount,
          needGreaterAllowance: needGreaterAllowance,
          hasPendingWithdrawal: hasPendingWithdrawal,
          canCompleteWithdrawal: canCompleteWithdrawal,
        },
        amount,
        shares_,
        4
      );
    }
  }, [
    amount,
    shares_,
    isDeposit,
    txConfirmed,
    account.address,
    pendingUserAction,
    account.connector,
    hasPendingWithdrawal,
    pendingTxConfirmation,
    canCompleteWithdrawal,
    provider.network.name,
    provider.network.chainId,
  ]);
  const cursorPointer = useMemo((): string => {
    if (pendingTxConfirmation || pendingUserAction) {
      return "not-allowed";
    } else {
      return getVaultButtonState(
        web3User,
        {
          needMoreDepositAsset: needMoreDepositAsset,
          isDeposit: isDeposit,
          isValidAmount: isValidAmount,
          needGreaterAllowance: needGreaterAllowance,
          hasPendingWithdrawal: hasPendingWithdrawal,
          canCompleteWithdrawal: canCompleteWithdrawal,
        },
        amount,
        shares_,
        3
      );
    }
  }, [
    amount,
    shares_,
    isDeposit,
    txConfirmed,
    account.address,
    pendingUserAction,
    account.connector,
    hasPendingWithdrawal,
    pendingTxConfirmation,
    canCompleteWithdrawal,
    provider.network.name,
    provider.network.chainId,
  ]);
  const isButtonDisabled = useMemo((): boolean => {
    if (pendingTxConfirmation || pendingUserAction) {
      return true;
    } else {
      return getVaultButtonState(
        web3User,
        {
          needMoreDepositAsset: needMoreDepositAsset,
          isDeposit: isDeposit,
          isValidAmount: isValidAmount,
          needGreaterAllowance: needGreaterAllowance,
          hasPendingWithdrawal: hasPendingWithdrawal,
          canCompleteWithdrawal: canCompleteWithdrawal,
        },
        amount,
        shares_,
        2
      );
    }
  }, [
    shares_,
    amount,
    isDeposit,
    txConfirmed,
    account.address,
    account.connector,
    pendingUserAction,
    hasPendingWithdrawal,
    canCompleteWithdrawal,
    provider.network.name,
    pendingTxConfirmation,
    provider.network.chainId,
  ]);

  // ---------------------- Regular functions -----------------------------
  function handleSwitchNetwork(e: any): void {
    if (!isCorrectChainId) switchNetwork?.(OPTIMISM_MAINNET_CHAIN_ID);
  }

  // ---------------------- Async getter functions -----------------------------
  async function getVaultState() {
    const _vaultState = await vaultState(web3User, vaultName as string);
    if (_vaultState !== undefined) {
      setVaultState(_vaultState as VaultStateType);
      setTotalPending(
        bnToNumber(
          _vaultState.totalPending as BigNumber,
          fixedDecimals(_vaultState.totalPending)
        )
      );
      setLockedAmount(
        parseFloat(bnToNumber(_vaultState.lockedAmount).toFixed(4))
      );
      setCurrentRound(parseFloat(_vaultState.round.toString()));
    }
  }

  async function getVaultParams() {
    const _vaultParams = await vaultParams(web3User, vaultName as string);
    if (_vaultParams !== undefined)
      setVaultParams(_vaultParams as Vault.VaultParamsStruct);
  }

  async function getShareBalances() {
    const _shareBalances = await shareBalances(web3User, vaultName as string);
    if (_shareBalances !== undefined)
      setShareBalances(_shareBalances as ShareBalancesType);
  }

  async function getDepositReceipts() {
    const _depositReceipts = await depositReceipts(
      web3User,
      vaultName as string
    );
    if (_depositReceipts !== undefined)
      setDepositReceipts(_depositReceipts as DepositReceiptsStructType);
  }

  async function getRoundEnds() {
    if (vaultName !== undefined) {
      const _roundEnds = await roundEnds(web3User, vaultName);

      if (BigNumber.isBigNumber(_roundEnds)) {
        setRoundEnds(new Date(_roundEnds.toNumber() * 1000).toDateString());
      }
    }
  }

  async function getShares(): Promise<BigNumber | undefined> {
    if (!web3UserIsUndefined(web3User)) {
      const _shares = (await shares(
        web3User,
        vaultName as string
      )) as BigNumber;

      if (_shares !== undefined) {
        setShares(_shares);
        return _shares;
      } else {
        return undefined;
      }
    }
  }

  /**
   * @dev Fetch vault event data and set values for them to use on display
   */
  async function getVaultEd() {
    if (vaultName !== undefined) {
      setEdIsLoading(true);

      const generalEd = await apolloClient(
        getApolloClient[networkName].vaults[vaultName],
        getLasts,
        {
          first: 1,
          orderBy: "blockTimestamp",
          orderDirection: "desc",
        }
      );
      const edByAccount = await apolloClient(
        getApolloClient[networkName].vaults[vaultName],
        getLastsByAccount,
        {
          first: 1,
          orderBy: "blockTimestamp",
          orderDirection: "desc",
          account: web3User.account.address as string,
        }
      );

      let _shares: number | BigNumber | undefined = await getShares();
      _shares = parseFloat((_shares as BigNumber).toString()) / 1e18;

      // Not an empty array nor a default object
      const _roundStatus = getRoundStatus(generalEd);

      setRoundStatus(_roundStatus);
      set30DayVolume(get30DayVolume(generalEd));
      setCurrentRound(getCurrentRound(generalEd, _roundStatus));
      setTotalValueLocked(getCurrentTotalValueLocked(generalEd, _roundStatus));
      setPricePerShare(getPricePerShare(generalEd));
      setPendingWithdrawals(getPendingWithdrawals(edByAccount, _roundStatus));
      setPendingDeposits(
        getPendingDeposits(
          generalEd,
          edByAccount,
          getCurrentRound(generalEd, _roundStatus)
        )
      );
      setTotalPendingDeposits(
        getTotalPendingDeposits(
          generalEd,
          _roundStatus,
          getCurrentRound(generalEd, _roundStatus)
        )
      );
      setCurrentVaultShares(
        getCurrentVaultShares(
          edByAccount,
          _shares,
          getPendingWithdrawals(edByAccount, _roundStatus)
        )
      );

      setEdIsLoading(false);
    }
  }

  // ------------------------- useLayoutEffect hooks ---------------------------
  /**
   * @dev Updates only when `web3User_.account.connector` changes
   */
  useLayoutEffect(() => {
    setWeb3User(web3User_);
  }, [
    account.status,
    account.address,
    account.connector,
    account.isConnected,
    account.isConnecting,
    provider.network.name,
    provider.network.chainId,
  ]);

  /**
   * @dev Updates only when `txConfirmed`, `chartDataLoaded`, `web3User` change
   */
  useLayoutEffect(() => {
    if (
      !web3UserIsUndefined(web3User) &&
      (txConfirmed || pendingTxConfirmation)
    ) {
      const requests = [
        getShares(),
        getRoundEnds(),
        getVaultState(),
        getVaultParams(),
        getShareBalances(),
        getDepositReceipts(),
      ];

      Promise.all(requests).then((response: any) => { });
    }
  }, [
    txConfirmed,
    chartDataLoaded,
    account.address,
    account.connector,
    account.isConnected,
    pendingTxConfirmation,
    provider.network.name,
    provider.network.chainId,
  ]);

  /**
   * @dev Updates on initial page load
   */
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      const requests = [
        // getVaultState(),
        //getVaultParams(),
        // getShareBalances(),
        getVaultEd(),
        getRoundEnds(),
        // getDepositReceipts(),
      ];

      Promise.all([requests]).then((response: any) => { });
    }
  }, []);

  /**
   * @dev Updates only when `assetName`, `txConfirmed`, `vaultName`, and
   * `web3User` change
   */
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      setChartDataLoaded(false);

      getAndSetAssetPrice(
        provider.network.chainId,
        (assetName as string).toLocaleLowerCase(),
        setUnderlyingPrice
      ).then((response) => {
        setChartDataLoaded(true);
      });
    } else {
      setChartDataLoaded(true);
    }
  }, [
    assetName,
    txConfirmed,
    vaultName,
    account.address,
    account.connector,
    provider.network.name,
    provider.network.chainId,
  ]);

  return (
    <>
      <PageLock mobileNav={ <Nav /> } header={ <Header /> }>
        <div style={ { ...definitelyCentered } }>
          <PageWrapper>
            <PageHeader vaultName={ vaultName as string } />

            <MainContent>
              <LeftColumnWrapper>
                <LeftColumn>
                  <TVL
                    web3User={ web3User }
                    chartDataLoaded={ chartDataLoaded }
                    assetSymbol={ assetSymbol as string }
                    vaultName={ vaultName as string }
                    suspense={ {
                      txConfirmed: txConfirmed,
                      edIsLoading: edIsLoading,
                      chartDataLoaded: chartDataLoaded,
                    } }
                    vault={ {
                      totalPending: totalPending,
                      lockedAmount: lockedAmount,
                    } }
                    eventData={ {
                      totalValueLocked: totalValueLocked,
                      totalPendingDeposits: totalPendingDeposits,
                    } }
                  >
                    <MobileDepositWithdraw
                      web3User={ web3User }
                      vaultName={ vaultName as string }
                      handleSwitchNetwork={ handleSwitchNetwork }
                      suspense={ {
                        pendingUserAction: pendingTxConfirmation,
                        pendingTxConfirmation: pendingTxConfirmation,
                      } }
                      vault={ {
                        buttonStates: {
                          isDeposit: isDeposit,
                          isPinkButton: isPinkButton,
                          cursorPointer: cursorPointer,
                          isValidAmount: isValidAmount,
                          isButtonDisabled: isButtonDisabled,
                          isCorrectChainId: isCorrectChainId,
                          isRoundInProgress: isRoundInProgress,
                          hasPendingWithdrawal: hasPendingWithdrawal,
                          needGreaterAllowance: needGreaterAllowance,
                          setIsRoundInProgress: setIsRoundInProgress,
                          needMoreDepositAsset: needMoreDepositAsset,
                          canCompleteWithdrawal: canCompleteWithdrawal,
                        },
                        dw: {
                          amount: amount,
                          shares: shares_,
                          setAmount: setAmount,
                          vaultState: vaultState_,
                          currentRound: currentRound,
                          shareBalances: shareBalances_,
                          depositReceipts: depositReceipts_,
                          withdrawalShares: withdrawalShares_,
                          setWithdrawalShares: setWithdrawalShares,
                          accountVaultBalance: accountVaultBalance_,
                          setAccountVaultBalance: setAccountVaultBalance,
                        },
                      } }
                    />
                  </TVL>

                  <MyBalances
                    web3User={ web3User }
                    assetSymbol={ assetSymbol as string }
                    vaultName={ vaultName as string }
                    suspense={ {
                      txConfirmed: txConfirmed,
                      edIsLoading: edIsLoading,
                      chartDataLoaded: chartDataLoaded,
                    } }
                    eventData={ {
                      currentRound: currentRound,
                      pendingDeposits: pendingDeposits,
                      currentVaultShares: currentVaultShares,
                      pendingWithdrawals: pendingWithdrawals,
                    } }
                    vault={ {
                      shares: shares_,
                      shareBalances: shareBalances_,
                      underlyingPrice: underlyingPrice,
                      depositReceipts: depositReceipts_,
                      withdrawalShares: withdrawalShares_,
                      vaultName: vaultName as string,
                    } }
                  />

                  <Stats
                    web3User={ web3User }
                    assetSymbol={ assetSymbol as string }
                    vaultName={ vaultName as string }
                    eventData={ {
                      roundEnds: roundEnds_,
                      roundStatus: roundStatus,
                      thirtyDayVolume: thirtyDayVolume,
                      totalPendingDeposits: totalPendingDeposits,
                      pricePerShare: pricePerShare,
                    } }
                    suspense={ {
                      txConfirmed: txConfirmed,
                      edIsLoading: edIsLoading,
                      chartDataLoaded: chartDataLoaded,
                    } }
                    vault={ {
                      lockedAmount: lockedAmount,
                      totalPending: totalPending,
                      underlyingPrice: underlyingPrice,
                      isRoundInProgress: isRoundInProgress,
                    } }
                  />

                  <VaultTrades
                    assetSymbol={ assetSymbol as string }
                    vaultName={ vaultName as string }
                    vaultAddress={ vaultAddress as string }
                    suspense={ {
                      edIsLoading: edIsLoading,
                      chartDataLoaded: chartDataLoaded,
                    } }
                  />

                  {/* Product info cards */ }
                  <ProductInfo />
                </LeftColumn>
              </LeftColumnWrapper>

              <DepositWithdraw
                amount={ amount }
                web3User={ web3User }
                setAmount={ setAmount }
                assetSymbol={ assetSymbol as string }
                vault={ {
                  shares: shares_,
                  vaultState: vaultState_,
                  currentRound: currentRound,
                  shareBalances: shareBalances_,
                  depositReceipts: depositReceipts_,
                  withdrawalShares: withdrawalShares_,
                  isRoundInProgress: isRoundInProgress,
                  setWithdrawalShares: setWithdrawalShares,
                  accountVaultBalance: accountVaultBalance_,
                  setIsRoundInProgress: setIsRoundInProgress,
                  setAccountVaultBalance: setAccountVaultBalance,
                } }
                suspense={ {
                  txConfirmed: txConfirmed,
                  setTxConfirmed: setTxConfirmed,
                } }
                switchNetwork={ switchNetwork }
              />
            </MainContent>
          </PageWrapper>
        </div>
      </PageLock>
    </>
  );
};

export const LeftColumn = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-direction: column;
  padding-bottom: 48px;
  display: flex;
`;

export const LeftColumnWrapper = styled.div`
  @media screen and (max-width: 901px) {
    padding: 0px;
  }

  -webkit-box-flex: 1;
  flex-grow: 1;
  padding-right: 24px;
  flex-direction: column;
  display: flex;
  min-width: 500px;
`;

export const MainContent = styled.div`
  display: flex;
  width: 100%;
  -webkit-box-flex: 1;
  flex-grow: 1;
`;

export const PageWrapper = styled.div`
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  padding-top: 12px;
  padding-left: 24px;
  padding-right: 24px;
  min-height: 100%;
  width: 100%;
  max-width: 1420px;
  flex-direction: column;
  display: flex;
`;

export default λStrategy;
