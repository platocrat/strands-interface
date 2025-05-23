// Exterrals
import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
// Locals
import {
  DepositEvent,
  WithdrawEvent,
  RoundClosedEvent,
  RoundStartedEvent,
  GeneralVaultEventType,
  InitiateWithdrawEvent,
  VaultEventsByAccountType,
} from "../types";

// Subgraph (http) URIs
export const LYRA_SUBGRAPH_URL =
  "https://api.lyra.finance/subgraph/optimism/v1/api";
export const KWENTA_RATES_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/kwenta/optimism-latest-rates";
export const STRANDS_1CLICKS_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/strands-finance/strands-1clicks";
export const STRANDS_DSS_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/strands-finance/strands-dss-vault";
export const STRANDS_LGS_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/strands-finance/strands-lgs-vault";
export const STRANDS_SGS_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/strands-finance/strands-sgs-vault";

/**
 * @dev `f`etch `a`ll `e`vents for a `S`ingle `E`vent from `s`ingle `q`uery
 */
export async function apolloClient(
  _apolloClient: ApolloClient<NormalizedCacheObject>,
  _query: any,
  _variables?: any
) {
  const response = await _apolloClient.query({
    query: gql(_query),
    variables: _variables,
  });

  let eventData = response?.data;
  if (eventData !== undefined) return eventData;
}

export function getPendingDeposits(
  generalEd: GeneralVaultEventType,
  edByAccount: VaultEventsByAccountType,
  currentRound: number
): number {
  let pendingDeposits = 0,
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[],
    d: DepositEvent | DepositEvent[] = edByAccount.deposits as DepositEvent[];

  lrs = generalEd.roundStarteds as RoundStartedEvent[];

  if (d.length === 0) return pendingDeposits / 1e18;
  d = d[d.length - 1];

  if (lrs.length === 0) {
    const walletDepositAmount = d.walletDepositAmount;
    pendingDeposits = parseFloat(walletDepositAmount) / 1e18;
    return pendingDeposits;
  }

  lrs = lrs[lrs.length - 1] as RoundStartedEvent;

  if (currentRound !== parseFloat(d.round)) return 0;

  pendingDeposits = parseFloat(d.walletDepositAmount) / 1e18;
  return pendingDeposits;
}

export function getCurrentVaultShares(
  edByAccount: VaultEventsByAccountType,
  shares: number,
  pendingWithdrawals: number
): number {
  const currentVaultShares = pendingWithdrawals + shares;
  return currentVaultShares;
}

export function getPendingWithdrawals(
  edByAccount: VaultEventsByAccountType,
  roundStatus: string
): number {
  let pendingWithdrawals = 0,
    w: WithdrawEvent | WithdrawEvent[],
    // `i`nitiate `w`ithdraw event
    iw: InitiateWithdrawEvent | InitiateWithdrawEvent[];

  w = edByAccount.withdraws as WithdrawEvent[];
  iw = edByAccount.initiateWithdraws as InitiateWithdrawEvent[];

  let walletWithdrawalShares = 0,
    wBlockTimestamp = 0;

  w.length > 0
    ? (wBlockTimestamp = parseFloat(w[0].blockTimestamp))
    : (wBlockTimestamp = 0);

  if (iw.length > 0 && parseFloat(iw[0].blockTimestamp) > wBlockTimestamp) {
    walletWithdrawalShares = parseFloat(iw[0].walletWithdrawalShares) / 1e18;
  }

  pendingWithdrawals = walletWithdrawalShares;
  return pendingWithdrawals;
}

export function getRoundStatus(generalEd: GeneralVaultEventType): string {
  let roundStatus = "NEW",
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[],
    // `l`ast `r`ound `c`losed
    lrc: RoundClosedEvent | RoundClosedEvent[];

  lrc = generalEd.roundCloseds as RoundClosedEvent[];
  lrs = generalEd.roundStarteds as RoundStartedEvent[];
  // If not a single round has begun, return 0 for `currentVaultShares`
  if (lrs.length === 0) return roundStatus;
  if (lrc.length === 0 && lrs.length !== 0) {
    roundStatus = "IN PROGRESS";
    return roundStatus;
  }

  lrc = lrc[0] as RoundClosedEvent;
  lrs = lrs[0] as RoundStartedEvent;

  const lastRoundClosed = lrc.roundId;
  const lastRoundStarted = lrs.roundId;
  const isRoundInProgress = lastRoundStarted > lastRoundClosed;

  roundStatus = isRoundInProgress ? "IN PROGRESS" : "CLOSED";
  return roundStatus;
}

export function getTotalPendingDeposits(
  generalEd: GeneralVaultEventType,
  roundStatus: string,
  currentRound: number
): number {
  let totalPendingDeposits = 0,
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[],
    d: DepositEvent | DepositEvent[] = generalEd.deposits as DepositEvent[];

  lrs = generalEd.roundStarteds as RoundStartedEvent[];

  if (d.length === 0) return totalPendingDeposits;
  d = d[d.length - 1];

  // If not a single round has begun, return 0 for `currentVaultShares`
  if (lrs.length === 0) {
    const vaultTotalPending = d.vaultTotalPending;
    totalPendingDeposits = parseFloat(vaultTotalPending) / 1e18;
    return totalPendingDeposits;
  }

  lrs = lrs[lrs.length - 1] as RoundStartedEvent;

  if (currentRound === parseFloat(d.round)) {
    totalPendingDeposits = parseFloat(d.vaultTotalPending) / 1e18;
    return totalPendingDeposits;
  } else {
    return 0;
  }
}

/**
 * @dev Processes the given vault event data to get the current TVL, where
 * "current" is defined by the current round's status, which is given by
 * argument `currentRoundStatus`.
 * @param generalEd Relevent data, queried from the relevant subgraph, that will
 * be processed.
 * @param currentRoundStatus The current round status
 * @returns currentTotalValueLocked
 */
export function getCurrentTotalValueLocked(
  generalEd: GeneralVaultEventType,
  currentRoundStatus: string
): number {
  let currentTotalValueLocked = 0,
    lrc: RoundClosedEvent | RoundClosedEvent[],
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[];

  if (currentRoundStatus === "IN PROGRESS") {
    lrs = generalEd.roundStarteds as RoundStartedEvent[];

    if (lrs.length === 0) {
      return currentTotalValueLocked;
    } else {
      lrs = lrs[lrs.length - 1] as RoundStartedEvent;

      currentTotalValueLocked = parseFloat(lrs.lockAmount) / 1e18;
      return currentTotalValueLocked;
    }
  } else if (currentRoundStatus === "CLOSED") {
    lrc = generalEd.roundCloseds as RoundClosedEvent[];
    lrc = lrc[lrc.length - 1] as RoundClosedEvent;

    currentTotalValueLocked = parseFloat(lrc.lockAmount) / 1e18;
    return currentTotalValueLocked;
  } else {
    return 0;
  }
}

export function getPricePerShare(generalEd: GeneralVaultEventType): number {
  let pricePerShare = 0,
    lrs: RoundStartedEvent | RoundStartedEvent[];
  lrs = generalEd.roundStarteds as RoundStartedEvent[];
  lrs = lrs[lrs.length - 1] as RoundStartedEvent;
  pricePerShare = parseFloat(lrs.newPricePerShare) / 1e18;
  return pricePerShare;
}

export function getUniqueUserCount(depositsEd: GeneralVaultEventType): number {
  let depositAccounts = depositsEd.deposits.map(
    (d: DepositEvent): string => d.account
  );
  let uniqueAccounts = [...new Set(depositAccounts as string[])];
  return uniqueAccounts.length;
}

export function get30DayVolume(generalEd: GeneralVaultEventType): number {
  let thirtyDayVolume = 0,
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[],
    // `l`ast `r`ound `c`losed
    lrc: RoundClosedEvent | RoundClosedEvent[];

  // lrc = generalEd.roundCloseds as RoundClosedEvent[]
  // lrs = generalEd.roundStarteds as RoundStartedEvent[]
  // // If not a single round has begun, return 0 for `currentVaultShares`
  // if (lrs.length === 0) return thirtyDayVolume

  // lrc = lrc[lrc.length - 1] as RoundClosedEvent
  // lrs = lrs[lrs.length - 1] as RoundStartedEvent

  // const lastRoundClosedTimestamp = parseFloat(lrc.blockTimestamp)
  // const lastRoundStartedTimestamp = parseFloat(lrs.blockTimestamp)

  return thirtyDayVolume;
}

export function getRoundEnds(generalEd: GeneralVaultEventType): string {
  let roundEnds = "",
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[];

  lrs = generalEd.roundStarteds as RoundStartedEvent[];
  // If not a single round has begun, return 0 for `currentVaultShares`
  if (lrs.length === 0) return roundEnds;
  lrs = lrs[lrs.length - 1] as RoundStartedEvent;

  roundEnds = new Date(parseFloat(lrs.roundEnds) * 1000).toDateString();

  return roundEnds;
}

export function getCurrentRound(
  generalEd: GeneralVaultEventType,
  roundStatus: string
): number {
  let currentRound = 0,
    // `l`ast `r`ound `s`tarted
    lrs: RoundStartedEvent | RoundStartedEvent[],
    // `l`ast `r`ound `c`losed
    lrc: RoundClosedEvent | RoundClosedEvent[];

  lrs = generalEd.roundStarteds as RoundStartedEvent[];
  lrc = generalEd.roundCloseds as RoundClosedEvent[];
  // If not a single round has begun, return 0 for `currentVaultShares`
  if (lrs.length === 0) return currentRound;
  lrs = lrs[lrs.length - 1] as RoundStartedEvent;

  if (roundStatus === "IN PROGRESS") {
    currentRound = lrs.roundId;
    return currentRound;
  } else {
    if (lrc.length === 0 && lrs.roundId) {
      currentRound = lrs.roundId;
      return currentRound;
    }

    lrc = lrc[lrc.length - 1] as RoundClosedEvent;

    currentRound = lrc.roundId;
    return currentRound;
  }
}
