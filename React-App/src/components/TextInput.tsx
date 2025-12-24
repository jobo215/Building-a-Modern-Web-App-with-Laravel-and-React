import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

type TextInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput = (props: TextInputProps) => {
  return (
    <>
      <TextField
        label={props.label}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        fullWidth
      />
    </>
  );
};
