import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import {
  IDropdownListItem,
  IParameter,
  IParameterProps,
} from "../../../Interfaces";
import Select, { SingleValue } from "react-select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Input: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      justifyItems: "center",
    },
    Field: {
      margin: "5px 0",
    },
    Select: {
      width: "90%",
      margin: "10px auto",
    },
  })
);

function getValue(list: IDropdownListItem[], value: any) {
  // eslint-disable-next-line eqeqeq
  return list.find((x: IDropdownListItem) => x.value == value);
}

function DynamicDropdown(props: IParameterProps) {
  const classes = useStyles();
  const options: IDropdownListItem[] = Array.from(
    props.element.options!,
    (x: IParameter) => {
      return {
        name: props.element.name,
        label: x.name,
        value: x.value,
        type: x.type,
      };
    }
  );
  const [value, setValue] = useState<IDropdownListItem | undefined>(getValue(options, props.element.value));

  return (
    <div key={props.index} className={classes.Input}>
      <Select
        placeholder={
          props.element.placeholder! +
          (props.element.isOptional !== true ? " *" : "")
        }
        className={classes.Select}
        isSearchable={true}
        value={value}
        onChange={(choice: SingleValue<IDropdownListItem>) => {
          if (choice === null) {
            return;
          }
          props.editParams(
            { name: choice.name, type: choice.type},
            choice.value
          );
          setValue(choice);
        }}
        name="color"
        options={options}
      />
    </div>
  );
}

export default DynamicDropdown;
