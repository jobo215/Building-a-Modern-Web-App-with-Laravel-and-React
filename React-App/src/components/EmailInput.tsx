import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

type EmailInputProps = {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const EmailInput = (props: EmailInputProps) => {
  return (
    <>
      <TextField
        label={props.label ?? "Email"}
        name="email"
        type="email"
        value={props.value}
        onChange={props.onChange}
        fullWidth
      />
    </>
  );
};
