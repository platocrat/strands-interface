import React, { LegacyRef } from "react";
import styled from "@emotion/styled";
import { fonts } from "../../../theme/styles";

type CustomInputProps = {
  placeholder?: string;
  step?: number;
  min?: number | string;
  ref?: LegacyRef<HTMLInputElement> | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  id?: string;
  defaultValue?: any;
  dataTestId?: string;
  value?: string | number;
};

const INVALID_CHARS = ["-", "+", "e"];

const CustomInput: React.FC<CustomInputProps> = ({
  ref,
  placeholder,
  onChange,
  step,
  style,
  className,
  min,
  value,
  disabled,
  id,
  defaultValue,
  dataTestId,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e, e.target.value.replace(/,/g, ".").replace(/[e+-]/gi, ""));
  };

  return (
    <>
      <SCustomInput
        id={id}
        min={min}
        ref={ref}
        type="number"
        step={step}
        style={style}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        data-testid={dataTestId}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onKeyDown={(e) => {
          if (INVALID_CHARS.includes(e.key)) {
            e.preventDefault();
          }
        }}
      />
    </>
  );
};

const SCustomInput = styled.input`
  display: block;
  width: 100%;
  appearance: none;
  border: 1px solid transparent;
  background-color: transparent;
  font-family: InterVariable, sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 23px;
  font-size: 15px;

  color: ${fonts.colors.solid.white};
  padding: 0px 12px;
  text-align: right;
  flex: 1 1 0%;
  min-height: 35px;
  height: 100%;
  outline: none;
`;

export default CustomInput;
