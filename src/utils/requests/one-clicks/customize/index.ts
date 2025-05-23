// Locals
// Utils
import { apolloClient } from "../../../../utils/subgraph";
import { liveBoards } from "../../../../utils/subgraph/graphql/queries/lyra";
import { lyraClient } from "../../../../utils/subgraph/graphql/clients";

export async function getAllBoardsFor(chainId: number) {
  const boards = await apolloClient(lyraClient(chainId), liveBoards, {});

  return await boards.boards.map((item, __boardData) => {
    return {
      expiryTimestamp: item.expiryTimestamp,
      id: Number(item.boardId),
      timeToExpiry: (item.expiryTimestamp * 1000 - new Date().getTime()) / 1000,
      __boardData: {
        ...item,
      },
      strikes() {
        return item.strikes.map((__strike) => {
          return {
            id: Number(__strike.strikeId),
            strikePrice: "0x" + Number(__strike.strikePrice).toString(16),
            __strikeData: __strike,
            call() {
              return {
                delta:
                  "0x" +
                  Number(
                    __strike.callOption.latestOptionPriceAndGreeks.delta
                  ).toString(16),
              };
            },
            put() {
              return {
                delta:
                  "-0x" +
                  (
                    10 ** 18 -
                    Number(__strike.callOption.latestOptionPriceAndGreeks.delta)
                  ).toString(16),
              };
            },
          };
        });
      },
      market() {
        return item.market.address;
      },
    };
  });
}
