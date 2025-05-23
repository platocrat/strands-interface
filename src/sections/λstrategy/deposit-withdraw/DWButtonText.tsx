// Externals
import { FC, useMemo } from "react";
// Locals
import { DWButtonTextProps } from "../../../utils/props";
import { getVaultButtonState } from "../../../utils/misc";

const DWButtonText: FC<DWButtonTextProps> = ({
  amount,
  shares,
  web3User,
  vaultName,
  statesAndBalances,
}) => {
  const buttonText = useMemo((): string => {
    return getVaultButtonState(
      web3User,
      statesAndBalances,
      amount,
      shares,
      0,
      vaultName
    );
  }, [
    amount,
    shares,
    web3User.chainId,
    web3User.provider,
    web3User.account.address,
    statesAndBalances.isDeposit,
    statesAndBalances.hasPendingWithdrawal,
    statesAndBalances.canCompleteWithdrawal,
  ]);
  const textColor = useMemo((): string => {
    return getVaultButtonState(web3User, statesAndBalances, amount, shares, 1);
  }, [
    shares,
    amount,
    web3User.chainId,
    web3User.provider,
    statesAndBalances.isDeposit,
    web3User.account.address,
    statesAndBalances.hasPendingWithdrawal,
    statesAndBalances.canCompleteWithdrawal,
  ]);

  return (
    <>
      <div style={{ color: textColor }}>{buttonText}</div>
    </>
  );
};

export default DWButtonText;
