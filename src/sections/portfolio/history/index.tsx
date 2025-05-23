// Externals
import { FC } from "react";
// Locals
import PortfolioHistoryTable from "./table";
import { CardSection } from "../../strategies/table";
import { PortfolioHistorySectionProps } from "../../../utils/props";

const PortfolioHistorySection: FC<PortfolioHistorySectionProps> = ({
  positions,
}) => {
  return (
    <>
      <CardSection style={{ marginBottom: "48px" }}>
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
                className="table-scrollbar"
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
                  {/** @todo Turn into separate component */}
                  <div className="portfolio-history-table-top-section">
                    <div
                      style={{
                        height: " 36px",
                        display: "flex",
                        alignItems: "center",
                        MozBoxAlign: "center",
                        alignSelf: "baseline",
                        borderRadius: "99999px",
                      }}
                    >
                      <button
                        className="anchor-button"
                        style={{ width: "95px" }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily: `"Inter var", sans-serif`,
                              fontWeight: "500",
                              lineHeight: "23px",
                              fontSize: "15px",
                              letterSpacing: "0px",
                              textAlign: "center",
                              color: "inherit",
                            }}
                          >
                            {`Positions`}
                          </p>
                        </div>
                      </button>
                      {/* Trade button */}
                      {/* <button className='css-1f7l2ze'>
                        <div className='css-10e1o0u'>
                          <p className='css-1ows78g'>Trade</p>
                        </div>
                      </button> */}
                    </div>
                    {/* Download icon */}
                    {/* <div className='css-183zfck'>
                      <a
                        target='_self'
                        download='lyra_trade_history.csv'
                        href='blob:https://app.lyra.finance/e6ad38fd-ae7b-4480-9f24-2b85b73ab37c'
                      >
                        <button className='css-1om7ir1'>
                          <div className='css-veopmm'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='16px' height='16px'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            >
                              <path
                                d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
                              />
                              <polyline points='7 10 12 15 17 10' />
                              <line x1='12' y1='15' x2='12' y2='3' />
                            </svg>
                          </div>
                        </button>
                      </a>
                    </div> */}
                  </div>

                  <PortfolioHistoryTable positions={positions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardSection>
    </>
  );
};

export default PortfolioHistorySection;
