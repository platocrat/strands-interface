export const getLasts = `
query GetLasts($first: Int, $orderBy: BigInt, $orderDirection: String) {
  deposits(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
    round
    walletDepositAmount
    vaultTotalPending
    blockTimestamp
  }
  initiateWithdraws(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
    shares
    round
    walletWithdrawalShares
    blockTimestamp
  }
  withdraws(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
    amount
    shares
    blockTimestamp
  }
  approvals(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
    owner
    spender
    value
    blockTimestamp
  }
  roundStarteds(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
    roundId
    lockAmount
    newPricePerShare
    roundEnds
    blockTimestamp
  }
  roundCloseds(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
    roundId
    lockAmount
    blockTimestamp
  }
}`;

/**
 * @dev Query last `Deposit` event of an account.
 */
export const getLastsByAccount = `
query GetLastsByAccount(
  $first: Int, 
  $orderBy: BigInt, 
  $orderDirection: String,
  $account: String
) {
  deposits(
    first: $first,
    orderBy: $orderBy, 
    orderDirection: $orderDirection, 
    where: { account: $account }
  ) {
    account
    amount
    round
    walletDepositAmount
    vaultTotalPending
    blockTimestamp
  }
  initiateWithdraws(
    first: $first,
    orderBy: $orderBy, 
    orderDirection: $orderDirection, 
    where: { account: $account }
  ) {
    account
    shares
    round
    walletWithdrawalShares
    blockTimestamp
  }
  withdraws(
    first: $first,
    orderBy: $orderBy, 
    orderDirection: $orderDirection, 
    where: { account: $account }
  ) {
    account
    amount
    shares
    blockTimestamp
  }
}`;

/**
 * @dev Query first 1000 `Deposit` events.
 */
export const getDeposits = `
query GetDeposits {
  deposits(first: 1000) {
    account
  }
}`;

export const getTVL = `
query GetTVL {
  $first: Int, 
  $orderBy: BigInt, 
  $orderDirection: String,
  $account: String
) {
  deposits(
    first: $first,
    orderBy: $orderBy, 
    orderDirection: $orderDirection, 
    where: { account: $account }
  ) {
    account
    amount
    round
    walletDepositAmount
    vaultTotalPending
    blockTimestamp
  }
  withdraws(
    first: $first,
    orderBy: $orderBy, 
    orderDirection: $orderDirection, 
    where: { account: $account }
  ) {
    account
    amount
    shares
    blockTimestamp
  }
}`;
