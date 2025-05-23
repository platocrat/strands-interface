import { CSSProperties, FC, ReactNode } from "react";
import TxTernary from "./TxTernary";

type TxTernariesProps = {
  conditional1: any;
  conditional2: any;
  children: ReactNode;
  style?: CSSProperties | undefined;
};

const TxTernaries: FC<TxTernariesProps> = ({
  style,
  children,
  conditional1,
  conditional2,
}) => {
  return (
    <>
      <TxTernary style={style} conditional={conditional1}>
        <TxTernary style={style} conditional={conditional2}>
          <>{children}</>
        </TxTernary>
      </TxTernary>
    </>
  );
};

export default TxTernaries;
