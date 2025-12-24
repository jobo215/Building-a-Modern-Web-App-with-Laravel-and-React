import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

type PasswordInputProps = {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

export const PasswordInput = (props: PasswordInputProps) => {
  return (
    <>
      <TextField
        label={props.label ?? "Password"}
        name={props.name ?? "password"}
        type="password"
        value={props.value}
        onChange={props.onChange}
        fullWidth
      />
    </>
  );
};
