// Externals
import React, { FC } from "react";
import { useNetwork } from "wagmi";
import styled from "@emotion/styled";
// Locals
import TableHead from "../TableHead";
import Strategy from "../../../sections/strategies/strategy";

// Misc utils
import { cl, getCA, strategyVaultReactKey } from "../../../utils/misc";
// Props
import { StrategyTableProps } from "../../../utils/props";
// Types
import { VaultObjectType } from "../../../utils/types";

export type StrandsInstrumentsType = {
  tvl: number;
  name: string;
  path: string;
  users: number;
  isActive: boolean;
  thirtyDayVolume: number;
};

const firstHeaderName = "Strategy";

const StrategyTable: FC<StrategyTableProps> = ({
  isHome,
  isAssetPriceLoading,
  vaultCtcs,
  TVL,
  CUB,
}) => {
  const { chain } = useNetwork();

  let strandsInstruments: StrandsInstrumentsType[] = [
    {
      name: "",
      isActive: false,
      path: "",
      tvl: 0,
      users: 0,
      thirtyDayVolume: 0,
    },
  ];

  if (isHome) {
    /**
     * @todo Fetch some of these values from subgraph or by using contract calls
     */
    strandsInstruments = [
      {
        name: "Volatility Trading",
        path: "/vaults/Ethereum-sETH",
        tvl: TVL as number,
        users: CUB as number,
        isActive: true,
        thirtyDayVolume: 0,
      },
      {
        name: "Delta One",
        path: "",
        tvl: 0,
        users: 0,
        isActive: false,
        thirtyDayVolume: 0,
      },
      // {
      //   name: 'RWA',
      //   path: '',
      //   tvl: 0,
      //   users: 0,
      //   isActive: false,
      //   thirtyDayVolume: 0
      // },
      // {
      //   name: 'Funds',
      //   path: '',
      //   tvl: 0,
      //   users: 0,
      //   isActive: false,
      //   thirtyDayVolume: 0
      // },
    ];
  }

  return (
    <>
      <STable role="table" style={{ marginBottom: "14px" }}>
        <TableHead isHome={isHome} firstHeaderName={firstHeaderName} />
        <Stbody>
          <>
            {vaultCtcs ? (
              <>
                {vaultCtcs.map((sObj: VaultObjectType, sObjIndex: number) => (
                  <React.Fragment
                    key={strategyVaultReactKey(sObjIndex, chain, sObj)}
                  >
                    <Strategy
                      isActive={sObj.isActive}
                      vaultAddress={getCA(chain, sObj)}
                      vaultNameKey={sObj.vaultName.key}
                      vaultNameTitle={sObj.vaultName.title}
                    />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <>
                {isHome ? (
                  <>
                    {strandsInstruments.map((instrument, i: number) => (
                      <React.Fragment
                        key={`${i}-${instrument.name}-${instrument.isActive}`}
                      >
                        <Strategy
                          isHome={isHome}
                          instrument={instrument}
                          _assetName={instrument.name}
                          isActive={instrument.isActive}
                          instrumentPath={instrument.path}
                          vaultNameTitle={instrument.name}
                          isAssetPriceLoading={isAssetPriceLoading}
                        />
                      </React.Fragment>
                    ))}
                  </>
                ) : null}
              </>
            )}
          </>
        </Stbody>
      </STable>
    </>
  );
};

export const Stbody = styled.tbody`
  background-color: transparent;
  border-bottom-color: #000000;
`;

export const STable = styled.table`
  position: relative;
  width: 100%;
  height: 100%;

  border-collapse: collapse @media screen and (max-width: 900px) {
    display: none;
  }
`;

export default StrategyTable;
