import { FC } from "react";
import styled from "@emotion/styled";

type ErrorMsgProps = {
  revertMsg: string;
  ctcCallReverted: boolean;
};

const ErrorMsg: FC<ErrorMsgProps> = ({ ctcCallReverted, revertMsg }) => {
  return (
    <>
      {ctcCallReverted ? (
        <>
          <StyledErrorMsg>{`⛔️ Error! ${revertMsg}`}</StyledErrorMsg>
        </>
      ) : null}
    </>
  );
};

const StyledErrorMsg = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;

  text-align: center;

  font-weight: 600;
  font-size: 13px;
  color: #ff2b00;

  margin: 10px 0px 0px 0px;
  max-width: 230px;
`;

export { ErrorMsg };
