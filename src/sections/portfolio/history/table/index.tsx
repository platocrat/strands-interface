// Externals
import React, { FC, useEffect, useRef, useState } from "react";
// Locals
import PortfolioHistoryTableRow from "./row";
import PortfolioHistoryTableHeader from "./header";
import Spinner from "../../../../components/Suspense/Spinner";
// Types
import { LyraHistoricalPosition } from "../../../../utils/types";
// Props
import { PortfolioHistoryTableProps } from "../../../../utils/props";
// CSS
import { definitelyCentered } from "../../../../theme/componentStyles";

const ROWS_PER_BATCH = 5;
const THROTTLE_DELAY = 1_000;

const PortfolioHistoryTable: FC<PortfolioHistoryTableProps> = ({
  isVault,
  positions,
}) => {
  const [currentBatch, setCurrentBatch] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tableBodyElement = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (positions.length > 6) {
      const options = {
        root: null, // the viewport
        rootMargin: "0px",
        threshold: 1.0,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            setIsLoading(true);
            setTimeout(() => {
              setCurrentBatch(currentBatch + 1);
              setIsLoading(false);
            }, THROTTLE_DELAY);
          }
        });
      }, options);

      observer.observe(tableBodyElement.current as any);

      return () => observer.disconnect();
    }
  }, [currentBatch, positions]);

  return (
    <>
      <div>
        <div className="table-scrollbar portfolio-history-table-section">
          <table className="portfolio-history-table">
            <PortfolioHistoryTableHeader isVault={isVault} />

            {positions.length < 6 ? (
              <tbody
                ref={tableBodyElement}
                style={{
                  borderColor: "#1A212B",
                  backgroundColor: "transparent",
                }}
              >
                <>
                  {positions.map(
                    (position: LyraHistoricalPosition, i: number) => (
                      <React.Fragment
                        key={`portfolio-history-table-${position.openPrice}-${position.assetSymbol}-${i}-${isVault}`}
                      >
                        <PortfolioHistoryTableRow
                          isVault={isVault}
                          position={position}
                        />
                      </React.Fragment>
                    )
                  )}
                </>
              </tbody>
            ) : (
              <tbody
                ref={tableBodyElement}
                style={{
                  borderColor: "#1A212B",
                  backgroundColor: "transparent",
                }}
              >
                <>
                  {positions
                    .slice(0, currentBatch * ROWS_PER_BATCH)
                    .map((position: LyraHistoricalPosition, i: number) => (
                      <React.Fragment
                        key={`portfolio-history-table-${position.openPrice}-${position.assetSymbol}-${i}-${isVault}`}
                      >
                        <PortfolioHistoryTableRow
                          isVault={isVault}
                          position={position}
                        />
                      </React.Fragment>
                    ))}
                  {isLoading && (
                    <tr style={definitelyCentered}>
                      <Spinner height="50" width="50" />
                    </tr>
                  )}
                </>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default PortfolioHistoryTable;
