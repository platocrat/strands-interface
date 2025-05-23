/**
 * @dev Query first 1000 `Trade` events.
 */
export const getTrades = `
query GetTrades(
  $first: Int, 
  $orderBy: String, 
  $orderDirection: String,
  $trader: String,
) {
  trades(
    first: $first, 
    orderBy: $orderBy, 
    orderDirection: $orderDirection,
    where: { trader: $trader }
  ) {
    board {
      expiryTimestamp
    }
    strike {
      strikePrice
    }
    isBuy
    size
    spotPrice
    position {
      positionId
    }
    option {
      isCall
    }
    timestamp
    pricePerOption
  }
}`;

export const getTargetMarket = `
query GetTargetMarket(
  $address: String
) {
    markets(
      first: 1, 
      where: { address: $address } 
    ) {
    	name
    	address
      board
  	}
}`;

export const spotPriceSnapshots = `
query spotPriceSnapshots(
  $market: String!
  ) {
    spotPriceSnapshots(
      first:1 
      orderBy:timestamp 
      orderDirection:desc
      where:{market_:{address:$market}}
    ) {
      timestamp spotPrice
    }
}`;

export const liveBoards = `
{boards(where :{isExpired:false}) {
  boardId
  expiryTimestamp
  expiryTimestampReadable
  strikes (orderBy:strikePrice,orderDirection:asc) {
      strikeId
      strikePrice
      callOption {
          isCall
          latestOptionPriceAndGreeks {
              delta
              period
              optionPrice}
                 }}
  market {address}
  }
}`;
