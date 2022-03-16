import React, {useCallback, useEffect, useState} from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import {
  IDropdownListItem,
  IParameter,
  IParameterProps,
} from "../../../Interfaces";
import Select, { SingleValue } from "react-select";
import myFetch from "../../../api/api";

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

function DynamicOptions(props: IParameterProps) {
  const classes = useStyles();
  const [options, setOptions] = useState<IDropdownListItem[] | undefined>(undefined);
  const [value, setValue] = useState<IDropdownListItem | undefined>(undefined);

  const initialize = useCallback(async () => {
    const res: IParameter[] = await myFetch<IParameter[]>(
      props.element.route!,
      "GET"
    );
    const opt: IDropdownListItem[] = Array.from(res, (x: IParameter) => {
      return {
        name: props.element.name,
        label: x.name,
        value: x.value,
        type: x.type,
      };
    });
    setOptions(opt);
    setValue(getValue(opt, props.element.value));
  }, [props.element.name, props.element.route, props.element.value]);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
            { name: choice.name, type: choice.type },
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

export default DynamicOptions;
