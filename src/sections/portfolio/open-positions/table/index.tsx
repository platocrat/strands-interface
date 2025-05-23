// Externals
import React, { CSSProperties, FC } from "react";
// Locals
import OpenPositionsTableBody from "./body";
// CSS
import { OpenPositionTableProps } from "../../../../utils/props";

const headerStyle: CSSProperties = {
  width: "150px",
  display: "flex",
  flex: "150 0 auto",
  MozBoxPack: "start",
  alignItems: "center",
  MozBoxAlign: "center",
  justifyContent: "flex-start",
};

const openPositionHeaders = [
  "Position",
  "Equity",
  "Average Cost",
  "Current Price",
  "Profit / Loss",
];

const OpenPositionsTable: FC<OpenPositionTableProps> = ({
  isVault,
  web3User,
  positionIds,
  vaultName,
  openPositions,
  setPositionIds,
  isCloseSelectedOn,
}) => {
  return (
    <>
      <div className="portfolio-markets-table-section">
        <div className="table-scrollbar" style={{ overflow: "auto hidden" }}>
          <table className="portfolio-markets-table">
            <thead style={{ display: "flex", padding: "16px 0px" }}>
              <div style={{ display: "flex", flex: "1 0 auto" }}>
                {openPositionHeaders.map(
                  (openPositionHeader: string, i: number) => (
                    <React.Fragment>
                      {i === 0 ? (
                        <>
                          <div style={{ width: "220px", flex: "220 0 auto" }}>
                            <p
                              style={{ marginLeft: "26px" }}
                              className="table-column-header"
                            >
                              {`${openPositionHeader}`}
                            </p>
                          </div>
                        </>
                      ) : i === 1 ? (
                        <>
                          <div style={{ ...headerStyle }}>
                            <p
                              className="table-column-header"
                              style={{ marginLeft: "7px" }}
                            >
                              {`${openPositionHeader}`}
                            </p>
                          </div>
                        </>
                      ) : i === 3 ? (
                        <>
                          <div style={{ ...headerStyle }}>
                            <p
                              className="table-column-header"
                              style={{ marginLeft: "-5px" }}
                            >
                              {`${openPositionHeader}`}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ ...headerStyle }}>
                            <p className="table-column-header">
                              {`${openPositionHeader}`}
                            </p>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            </thead>

            <OpenPositionsTableBody
              web3User={web3User}
              isVault={isVault}
              positionIds={positionIds}
              vaultName={vaultName}
              openPositions={openPositions}
              setPositionIds={setPositionIds}
              isCloseSelectedOn={isCloseSelectedOn}
            />
          </table>
        </div>
      </div>
    </>
  );
};

export default OpenPositionsTable;
