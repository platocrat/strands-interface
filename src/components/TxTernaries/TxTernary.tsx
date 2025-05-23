import { CSSProperties, FC, ReactNode } from "react";
import Spinner from "../Suspense/Spinner";

type TxTernaryProps = {
  conditional: boolean;
  children?: ReactNode;
  style?: CSSProperties | undefined;
};

const TxTernary: FC<TxTernaryProps> = ({ style, children, conditional }) => {
  return conditional ? (
    <div>
      <Spinner style={style ?? { height: "30px", width: "30px" }} />
    </div>
  ) : (
    <>{children}</>
  );
};

export default TxTernary;
