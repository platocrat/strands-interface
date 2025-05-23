// Externals
import { BigNumber } from "ethers";
import React, { FC, useLayoutEffect, useMemo, useState } from "react";
// Locals
import OpenPositionsTable from "./table";
import OpenPositionsButtons from "./buttons";
import { CardSection } from "../../strategies/table";
import { StyledLink } from "../../strategies/strategy";
import {
  RightArrowSVGContent,
  RightArrowSVGWrapper,
} from "../../one-clicks/one-click";
// Components
import Spinner from "../../../components/Suspense/Spinner";
import { OuterCard } from "../../../components/ProductInfo";
// APIs
import { sendTx } from "../../../contract-apis/utils";
// Requests
import { getOpenLyraPositions } from "../../../utils/requests/portfolio";
// Misc utils
import { cl, toBN, web3UserIsUndefined } from "../../../utils/misc";
// Constants
import {
  initLyraOpenPosition,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// Props
import { OpenPositionsProps } from "../../../utils/props";
// Types
import {
  MethodInfoType,
  LyraOpenPosition,
  TxSuspenseStateVarsType,
} from "../../../utils/types";
// CSS
import { fonts } from "../../../theme/styles";
import { definitelyCentered } from "../../../theme/componentStyles";
// Images
import { ReactComponent as RightArrowSVG } from "../../../assets/svg/right-arrow-short.svg";

const OpenPositions: FC<OpenPositionsProps> = ({
  modal,
  web3User,
  suspense,
  assetName,
  assetSymbol,
}) => {
  // booleans
  const [isCloseSelectedOn, setIsCloseSelectedOn] = useState<boolean>(false);
  const [openPositionsLoaded, setOpenPositionsLoaded] =
    useState<boolean>(false);
  // BigNumber
  const [positionIds, setPositionIds] = useState<
    { id: BigNumber; underlier: string }[]
  >([
    {
      id: toBN("0"),
      underlier: "sETH",
    },
  ]);
  // Custom
  const [openPositions, setOpenPositions] = useState<LyraOpenPosition[]>([
    initLyraOpenPosition,
  ]);

  const isCorrectChainId = useMemo((): boolean => {
    return web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID;
  }, [
    web3User.chainId,
    web3User.account.address,
    web3User.provider.network.name,
  ]);
  const isDefaultOpenPosition = useMemo((): boolean => {
    if (
      openPositions[0].assetSymbol === initLyraOpenPosition.assetSymbol &&
      openPositions[0].averageCost === initLyraOpenPosition.averageCost &&
      openPositions[0].currentPrice === initLyraOpenPosition.currentPrice &&
      openPositions[0].equity === initLyraOpenPosition.equity &&
      openPositions[0].expiryDate === initLyraOpenPosition.expiryDate &&
      openPositions[0].isCall === initLyraOpenPosition.isCall &&
      openPositions[0].lyraPositionUrl ===
        initLyraOpenPosition.lyraPositionUrl &&
      openPositions[0].marketName === initLyraOpenPosition.marketName &&
      openPositions[0].owner === initLyraOpenPosition.owner &&
      openPositions[0].positionId === initLyraOpenPosition.positionId &&
      openPositions[0].size === initLyraOpenPosition.size
    ) {
      return true;
    } else {
      return false;
    }
  }, [openPositions[0].positionId, openPositions[0].assetSymbol]);

  // ------------------------ Regular async function ---------------------------
  async function getOpenPositions(): Promise<void> {
    const owner = web3User.account.address as string;
    const openPositions = await getOpenLyraPositions(
      owner,
      web3User.provider.network.name
    );
    setOpenPositions(openPositions);
  }

  // --------------------------- sendTx methods --------------------------------
  async function handleCloseAllPositions(
    e: any,
    methodName = "closeAllPositions"
  ) {
    e.preventDefault();

    if (modal.isApprovedForAll) {
      suspense.setCtcCallReverted(false);

      const methodInfo: MethodInfoType = {
        ctcName: "OneClicks",
        methodName: methodName,
        isApproval: false,
      };
      const txSSVs: TxSuspenseStateVarsType = {
        setTxHash: suspense.setTxHash,
        setRevertMsg: suspense.setRevertMsg,
        setTxConfirmed: suspense.setTxConfirmed,
        setCtcCallReverted: suspense.setCtcCallReverted,
        setPendingUserAction: suspense.setPendingUserAction,
        setPendingTxConfirmation: suspense.setPendingTxConfirmation,
      };

      const limiters = [isCorrectChainId, true];
      const txArguments: any = { underliers: ["sETH", "sBTC"] };

      await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
    } else {
      modal.setOpenCloseAllModal(true);
    }
  }

  async function handleCloseSelectedPositions(
    e: any,
    methodName = "closeSelectedPositions"
  ) {
    e.preventDefault();

    if (modal.isApprovedForAll) {
      if (isCloseSelectedOn && positionIds.length > 0) {
        suspense.setCtcCallReverted(false);

        const methodInfo: MethodInfoType = {
          ctcName: "OneClicks",
          methodName: methodName,
          isApproval: false,
        };
        const txSSVs: TxSuspenseStateVarsType = {
          setTxHash: suspense.setTxHash,
          setRevertMsg: suspense.setRevertMsg,
          setTxConfirmed: suspense.setTxConfirmed,
          setCtcCallReverted: suspense.setCtcCallReverted,
          setPendingUserAction: suspense.setPendingUserAction,
          setPendingTxConfirmation: suspense.setPendingTxConfirmation,
        };
        const limiters = [isCorrectChainId, true];

        let sethPosIds: any = [],
          sbtcPosIds: any = [];
        // ssolPosIds: any = []

        // `typeof positionIds === { id: BigNumber, underlier: string }[]`
        for (let i = 0; i < positionIds.length; i++) {
          const pToClose = positionIds[i];

          if (!pToClose.id.eq(toBN("0"))) {
            if (pToClose.underlier === "sETH") sethPosIds.push(pToClose.id);
            if (pToClose.underlier === "sBTC") sbtcPosIds.push(pToClose.id);
            // if (pToClose.underlier === 'sSOL') ssolPosIds.push(pToClose.id)
          }
        }

        const toClose_ = [
          { underlier: "sETH", positionIds: sethPosIds },
          { underlier: "sBTC", positionIds: sbtcPosIds },
          // { underlier: 'sSOL', positionIds: ssolPosIds },
        ];

        const txArguments: any = { toClose: toClose_ };

        await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
      } else {
        setIsCloseSelectedOn(true);
      }
    } else {
      modal.setOpenCloseAllModal(true);
    }
  }

  // ------------------------- useLayoutEffects --------------------------------
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      setOpenPositionsLoaded(false);

      Promise.all([getOpenPositions()]).then((response: any) => {
        setOpenPositionsLoaded(true);
      });
    }
  }, [
    web3User.chainId,
    suspense.txConfirmed,
    web3User.account.address,
    web3User.account.isConnected,
    web3User.provider.network.name,
    web3User.provider.network.chainId,
  ]);

  // Reset state for `CloseSelectedButton`
  useLayoutEffect(() => {
    if (isCloseSelectedOn) {
      setPositionIds([{ id: toBN("0"), underlier: "sETH" }]);
      setIsCloseSelectedOn(false);
    }
  }, [suspense.txConfirmed]);

  return (
    <>
      {/* Stats section */}
      <CardSection style={{ margin: "24px 0px" }}>
        <OuterCard>
          <div
            style={{
              display: "flex",
              margin: "24px 24px 12px 24px",
            }}
          >
            <div className="section-title">{`Open Positions`}</div>

            <OpenPositionsButtons
              web3User={web3User}
              suspense={suspense}
              positions={{
                positionIds: positionIds,
                openPositions: openPositions,
                setPositionIds: setPositionIds,
                isCloseSelectedOn: isCloseSelectedOn,
                setIsCloseSelectedOn: setIsCloseSelectedOn,
                handleCloseAllPositions: handleCloseAllPositions,
                handleCloseSelectedPositions: handleCloseSelectedPositions,
              }}
            />
          </div>

          {openPositionsLoaded || web3UserIsUndefined(web3User) ? (
            <>
              {openPositions.length > 0 &&
              !web3UserIsUndefined(web3User) &&
              !isDefaultOpenPosition ? (
                <>
                  <OpenPositionsTable
                    positionIds={positionIds}
                    openPositions={openPositions}
                    setPositionIds={setPositionIds}
                    isCloseSelectedOn={isCloseSelectedOn}
                  />
                </>
              ) : (
                <>
                  <p
                    style={{
                      marginTop: "13px",
                      marginLeft: "27px",
                      marginBottom: "15px",
                      color: fonts.colors.transparent.white,
                    }}
                  >
                    {`You have no open positions`}
                  </p>
                </>
              )}

              <div style={{ margin: "24px" }}>
                <StyledLink
                  style={{
                    width: "auto",
                    display: "flex",
                    maxWidth: "139px",
                  }}
                  to={"/one-clicks/Ethereum-sETH"}
                >
                  <button
                    className="anchor-button"
                    style={{ maxWidth: "139px", width: "auto" }}
                  >
                    {` Start Trading`}
                    <RightArrowSVGWrapper>
                      <RightArrowSVGContent>
                        <RightArrowSVG />
                      </RightArrowSVGContent>
                    </RightArrowSVGWrapper>
                  </button>
                </StyledLink>
              </div>
            </>
          ) : (
            <>
              <div style={{ ...definitelyCentered, marginBottom: "45px" }}>
                <Spinner height={"60px"} width={"auto"} />
              </div>
            </>
          )}
        </OuterCard>
      </CardSection>
    </>
  );
};

export default OpenPositions;
