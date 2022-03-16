import React, { useState } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  TextField,
} from "@material-ui/core";
import { IParameterProps } from "../../../Interfaces";

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
  })
);

function DynamicString(props: IParameterProps) {
  const classes = useStyles();
  const [str, setStr] = useState(props.element.value !== undefined ? props.element.value : "");

  return (
    <div key={props.index} className={classes.Input}>
      <TextField
        className={classes.Field}
        fullWidth={true}
        placeholder={props.element.name}
        label={props.element.placeholder + (props.element.isOptional !== true ? " *" : "")}
        variant="standard"
        value={str}
        onChange={(e) => {
          props.editParams(props.element, e.target.value);
          setStr(e.target.value);
        }}
      />
    </div>
  );
}

export default DynamicString;
