// Externals
import styled from "@emotion/styled";
import { FC } from "react";
// Locals
import TxTernaries from "../../../components/TxTernaries";
import {
  DWButton,
  NetworkButton,
  ButtonContainer,
} from "../../../sections/λstrategy/deposit-withdraw";
import DWButtonText from "../../../sections/λstrategy/deposit-withdraw/DWButtonText";
// Props
import { MobileDepositWithdrawProps } from "../../../utils/props";

const MobileDepositWithdraw: FC<MobileDepositWithdrawProps> = ({
  vault,
  suspense,
  web3User,
  vaultName,
  handleSwitchNetwork,
}) => {
  return (
    <>
      <Position>
        <ButtonContainer>
          <>
            { vault.buttonStates.isCorrectChainId ? (
              <>
                <DWButton
                  type="submit"
                  disabled={ vault.buttonStates.isButtonDisabled }
                  className={ `${vault.buttonStates.isPinkButton}` }
                  style={ { cursor: vault.buttonStates.cursorPointer } }
                >
                  <TxTernaries
                    conditional1={ suspense.pendingUserAction }
                    conditional2={ suspense.pendingTxConfirmation }
                  >
                    <DWButtonText
                      amount={ vault.dw.amount }
                      web3User={ web3User }
                      shares={ vault.dw.shares }
                      vaultName={ vaultName as string }
                      statesAndBalances={ {
                        isDeposit: vault.buttonStates.isDeposit,
                        isValidAmount: vault.buttonStates.isValidAmount,
                        needMoreDepositAsset:
                          vault.buttonStates.needMoreDepositAsset,
                        hasPendingWithdrawal:
                          vault.buttonStates.hasPendingWithdrawal,
                        needGreaterAllowance:
                          vault.buttonStates.needGreaterAllowance,
                        canCompleteWithdrawal:
                          vault.buttonStates.canCompleteWithdrawal,
                      } }
                    />
                  </TxTernaries>
                </DWButton>
              </>
            ) : (
              <NetworkButton onClick={ (e: any) => handleSwitchNetwork(e) }>
                { `Switch to Optimism` }
              </NetworkButton>
            ) }

            {/** @todo Need to pass error messages to Toast components */ }
          </>
        </ButtonContainer>
      </Position>
    </>
  );
};

const Position = styled.div`
  @media screen and (min-width: 901px) {
    display: none;
  }
`;

export default MobileDepositWithdraw;
