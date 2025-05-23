// Externals
import { FC } from "react";
// Locals
import { LyraOpenPosition, Web3UserType } from "../../../../utils/types";
import OpenPositionsTable from "../../../portfolio/open-positions/table";

export type VaultTradesOpenPositionsTableProps = {
  isVault: boolean;
  vaultName: string;
  openPositions: LyraOpenPosition[];
  web3User: Web3UserType;
};

const VaultTradesOpenPositionsTable: FC<VaultTradesOpenPositionsTableProps> = ({
  web3User,
  isVault,
  vaultName,
  openPositions,
}) => {
  return (
    <>
      <OpenPositionsTable
        web3User={web3User}
        isVault={isVault}
        vaultName={vaultName}
        openPositions={openPositions}
      />
    </>
  );
};

export default VaultTradesOpenPositionsTable;
