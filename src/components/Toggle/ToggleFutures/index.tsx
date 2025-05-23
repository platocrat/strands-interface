// Externals
import { FC } from "react";
// Locals
import { fonts } from "../../../theme/styles";

type ToggleFuturesProps = {
  isFutures: boolean;
  setIsFutures: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggleFutures: FC<ToggleFuturesProps> = ({ isFutures, setIsFutures }) => {
  function handleIsFutures() {
    setIsFutures(!isFutures);
  }

  return (
    <>
      <div className="toggle-futures-section">
        <button
          className="toggle-futures-button"
          onClick={(e: any): void => handleIsFutures()}
        >
          <p style={{ fontSize: fonts.sizes.small }}>
            {isFutures ? `Prices?` : `Futures?`}
          </p>
        </button>
      </div>
    </>
  );
};

export default ToggleFutures;
