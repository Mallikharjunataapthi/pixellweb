import React, { FC } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Label } from "./ui/label";

const animatedComponents = makeAnimated();

interface SelectmultipleProps {
  id: string;
  tagsOption: string[];
  selectLabel: string;
  defaultValue?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  errorMessage?: string;
}

const Selectmultiple: FC<SelectmultipleProps> = ({
  id,
  defaultValue,
  tagsOption,
  selectLabel,
  errorMessage,
  register,
  setValue,
  ...props
}) => {
  !tagsOption ? setValue(id, null) : "";
  return (
    <>
      <Label htmlFor={id} className="font-bold text-xs">
        {selectLabel}
      </Label>
      <Select
        defaultValue={defaultValue} // Use dynamic data here
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={tagsOption}
        id={id}
        {...props}
        {...register(id, { required: "This field is required." })}
        onChange={(selectedOptions) => setValue(id, selectedOptions)}
      />
      {errorMessage && (
        <p className="font-medium text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </>
  );
};

export default Selectmultiple;
