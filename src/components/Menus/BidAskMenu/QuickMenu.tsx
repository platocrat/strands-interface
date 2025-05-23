// Externals
import { FC, memo, useContext, useRef } from "react";
// Locals
import CustomInput from "../../CustomInput";
// Contexts
import { ocqmsContext } from "../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../contexts/OneClickContext";
import { BidAskMenuContext } from "../../../contexts/BidAskMenuContext";
// Constants
import { ocStrategyConfigs } from "../../../utils/constants";
// Props
import { QuickMenuProps } from "../../../utils/props";
// CSS
import {
  bidAskQuickMenuTitleStyle,
  bidAskQuickMenuInputStyle,
} from "../../../theme/componentStyles";
import { fonts } from "../../../theme/styles";
import { cl } from "../../../utils/misc";
import useOnClickOutside from "../../../hooks/useOnclickOutside";

const QuickMenu: FC<QuickMenuProps> = ({
  oih,
  osh,
  isBid,
  trader,
  web3User,
  children,
}) => {
  // React contexts
  const {
    collaterals,
    isSimpleView,
    showAskCheckmark,
    showBidCheckmark,
    handleShowBidAskQuickMenu,
  } = useContext(BidAskMenuContext);
  const { oneClickIndex } = useContext(OneClickContext);
  const { ocQuickMenuState } = useContext(ocqmsContext);

  // Refs

  // Regular constants
  const strategiesLength = Object.keys(ocStrategyConfigs).length;
  const last = strategiesLength - 1;
  const secondToLast = strategiesLength - 2;
  const thirdToLast = strategiesLength - 3;
  const isLast = oneClickIndex === last;
  const isSecondToLast = oneClickIndex === secondToLast;
  const isThirdToLast = oneClickIndex === thirdToLast;

  // function useClickOutside(ref: any): void {
  //   useEffect(() => {
  //     function handleClickOutside(e: any): void {
  //       cl(`ref.current: `, ref.current)
  //       cl(`!ref.current.contains(e.target): `, !ref.current.contains(e.target))

  //       if (ref.current && !ref.current.contains(e.target)) {
  //         setOCQuickMenuState({
  //           ...ocQuickMenuState,
  //           isBid: isBid,
  //           isSubmittingTrade: false,
  //           oneClickIndex: oneClickIndex,
  //           isOpenOCQuickMenu: false,
  //         })
  //       }
  //     }

  //     document.addEventListener('mousedown', handleClickOutside)

  //     return () => {
  //       document.removeEventListener('mousedown', handleClickOutside)
  //     }
  //   }, [ref])
  // }

  async function handleOnSubmit(e: any): Promise<void> {
    if (trader.needSUSD) {
      e.preventDefault();
      return osh.handleSocketPlugin(e);
    } else {
      if (trader.needGreaterAllowance) {
        e.preventDefault();
        osh.handleApprove(e);
      } else {
        if (trader.isApprovedForAll) {
          e.preventDefault();
          osh.handleTrade(e, isBid);
          handleShowBidAskQuickMenu(isBid, false);
        } else {
          osh.handleSetApprovalForAll(e);
        }
      }
    }
  }

  return (
    <>
      {/* QuickMenu */}
      <form
        autoComplete="off"
        onSubmit={(e: any): any => handleOnSubmit(e)}
        style={{
          fontSize: fonts.sizes.small,
          marginTop: isBid
            ? ocQuickMenuState.isOpenOCQuickMenu &&
              showBidCheckmark &&
              !ocQuickMenuState.isSubmittingTrade
              ? isThirdToLast
                ? collaterals.filter(
                    (collateral: number): boolean => collateral !== 0
                  ).length === 1
                  ? isSimpleView
                    ? "-422px"
                    : "-422px"
                  : isSimpleView
                  ? "-384px"
                  : "-472px"
                : isSecondToLast
                ? collaterals.filter(
                    (collateral: number): boolean => collateral !== 0
                  ).length === 1
                  ? isSimpleView
                    ? "-322px"
                    : "-382px"
                  : isSimpleView
                  ? "-384px"
                  : "-474px"
                : isLast
                ? isSimpleView
                  ? "-383px"
                  : "-591px"
                : "34px"
              : ""
            : ocQuickMenuState.isOpenOCQuickMenu &&
              showAskCheckmark &&
              !ocQuickMenuState.isSubmittingTrade
            ? isThirdToLast
              ? isSimpleView
                ? "-237px"
                : "-356px"
              : isSecondToLast
              ? isSimpleView
                ? "-236px"
                : "-354px"
              : isLast
              ? isSimpleView
                ? "-383px"
                : "-591px"
              : "34px"
            : "",
        }}
        className={
          isBid
            ? ocQuickMenuState.isOpenOCQuickMenu &&
              showBidCheckmark &&
              !ocQuickMenuState.isSubmittingTrade
              ? "baml-in bid-ask-menu-list"
              : "baml-out bid-ask-menu-list"
            : ocQuickMenuState.isOpenOCQuickMenu &&
              showAskCheckmark &&
              !ocQuickMenuState.isSubmittingTrade
            ? "baml-in bid-ask-menu-list"
            : "baml-out bid-ask-menu-list"
        }
      >
        {/* Title */}
        <div style={{ ...bidAskQuickMenuTitleStyle }}>
          {isBid ? <>{`Sell`}</> : <>{`Buy`}</>}
        </div>

        {/* Input section */}
        <div className="bid-ask-menu-input-section">
          <div
            style={{
              position: "relative",
              top: "5.5px",
              fontSize: "13px",
            }}
          >
            {`Contracts`}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "right",
            }}
          >
            <CustomInput
              type={"number"}
              defaultValue={1}
              placeholder={"1"}
              id={"quick-menu-input"}
              style={{ ...bidAskQuickMenuInputStyle }}
              onChange={oih.debouncedOnSizeChange}
            />
          </div>
        </div>
        <>{children}</>
      </form>
    </>
  );
};

export default memo(QuickMenu);
