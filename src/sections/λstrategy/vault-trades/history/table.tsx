// Externals
import { FC } from "react";
// Locals
import { PortfolioHistoryTableProps } from "../../../../utils/props";
import PortfolioHistoryTable from "../../../portfolio/history/table";

const VaultTradesHistoryTable: FC<PortfolioHistoryTableProps> = ({
  isVault,
  positions,
}) => {
  return (
    <>
      <div
        style={{
          width: "100%",
          flexGrow: "1",
          MozBoxFlex: "1",
          display: "flex",
        }}
      >
        <div
          style={{
            flexGrow: "1",
            MozBoxFlex: "1",
            display: "flex",
            paddingRight: "0px",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              gap: "24px",
              flexGrow: "1",
              MozBoxFlex: "1",
              display: "grid",
              MozBoxPack: "start",
              placeContent: "start",
              paddingBottom: "40px",
              gridTemplateColumns: "1fr",
            }}
          >
            <div
              style={{
                display: "flex",
                overflow: "hidden",
                textDecoration: "none",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "0px",
                  flexDirection: "column",
                }}
              >
                <PortfolioHistoryTable
                  isVault={isVault}
                  positions={positions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VaultTradesHistoryTable;
