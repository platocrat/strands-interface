export type VaultTradesHeaderButtonsProps = {
  buttonHandlers: {
    viewAllPositions: any;
    viewOpenPositions: any;
  };
};

const VaultTradesHeaderButtons = ({ buttonHandlers }) => {
  return (
    <>
      <div
        style={{
          left: "26px",
          top: "-23.5px",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          margin: "0px 0px 0px auto",
        }}
      >
        <div className="portfolio-history-table-top-section">
          {/* Open Positions button */}
          <div
            style={{
              right: "12.5px",
              height: " 36px",
              display: "flex",
              position: "relative",
              alignItems: "center",
              MozBoxAlign: "center",
              alignSelf: "baseline",
              borderRadius: "99999px",
            }}
          >
            <button
              onClick={buttonHandlers.viewOpenPositions}
              className="anchor-button"
              style={{ width: "100%" }}
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
                  {`Open Positions`}
                </p>
              </div>
            </button>
          </div>

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
              onClick={buttonHandlers.viewAllPositions}
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
                  {`History`}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VaultTradesHeaderButtons;
