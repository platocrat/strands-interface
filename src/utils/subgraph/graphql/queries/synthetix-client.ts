import { gql } from "@apollo/client";

export const candlesQuery = gql`
  query candles(
    $period: Int = 300
    $first: Int = 1000
    $skip: Int = 0
    $orderBy: String = "id"
    $orderDirection: String = "desc"
    $block: Block_height #
    $where: Candle_filter!
  ) {
    candles(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      block: $block
      where: $where
    ) {
      id
      synth
      close
      open
      high
      low
      timestamp
      period
    }
  }
`;
