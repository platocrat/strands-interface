import { FC, useContext } from "react";
import { UnderlierContext } from "../../../../contexts/UnderlierContext";
import { cl, numberWithCommas } from "../../../../utils/misc";

export type UsersCellProps = {
  isHome?: boolean;
  totalUsers?: number;
};

const UsersCell: FC<UsersCellProps> = ({ isHome, totalUsers }) => {
  const { assetSymbol } = useContext(UnderlierContext);
  //cl('UserCell isHome=%s totalUsers=%s',isHome,totalUsers)

  return (
    <>
      <div className="table-cell-value">
        {isHome ? (
          <>{totalUsers}</>
        ) : (
          <>
            {assetSymbol === "ETH"
              ? numberWithCommas(totalUsers as number, 0)
              : 0}
          </>
        )}
      </div>
    </>
  );
};

export default UsersCell;
