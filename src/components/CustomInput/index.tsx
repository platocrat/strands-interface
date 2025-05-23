// Externals
import { FC } from "react";
import styled from "@emotion/styled";
// Locals
import { CustomInputProps } from "../../utils/props";

const INVALID_CHARS_WITH_E = ["-", "+", "e"];
const INVALID_CHARS = ["-", "+"];

const CustomInput: FC<CustomInputProps> = ({
  id,
  min,
  type,
  canE,
  step,
  right,
  style,
  value,
  disabled,
  onChange,
  className,
  dataTestId,
  placeholder,
  defaultValue,
}) => {
  return (
    <>
      <CustomInputContainer id={id} style={style} className={className}>
        <input
          id={id}
          min={min}
          value={value}
          disabled={disabled}
          step={step ?? 0.00001}
          type={type ?? "number"}
          data-testid={dataTestId}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={"home-page-input"}
          onChange={(e: any) => onChange(e)}
          onKeyDown={(e: any): void => {
            if (canE) {
              if (INVALID_CHARS.includes(e.key)) {
                e.preventDefault();
              }
            } else {
              if (INVALID_CHARS_WITH_E.includes(e.key)) {
                e.preventDefault();
              }
            }
          }}
        />
        {typeof right === "string" ? (
          <>
            <span style={{ opacity: "0.5" }}>{right}</span>
          </>
        ) : (
          right
        )}
      </CustomInputContainer>
    </>
  );
};

const CustomInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 38px;

  background-color: rgb(197, 200, 227, 0.4);
  box-shadow: 0px 1px 1px 1px rgba(0, 0, 255, 0.2);
  border: 1px solid gray;

  border-radius: 8px;
  padding: 0 10px;

  input {
    display: flex;
    flex: 1;
    margin-right: 4px;

    font-size: ${(props) =>
      props.id === "quick-menu-input" ? "12.5px" : "18px"};
    line-height: 22px;
    background-color: transparent;
    border: none;

    width: 100%;

    &:focus {
      outline: none;
    }

    ::placeholder {
      color: rgba(197, 200, 227, 0.8);
    }
  }

  span {
    font-size: 16px;
  }
`;

export default CustomInput;
