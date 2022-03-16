import React, { useState } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
} from "@material-ui/core";
import { IParameter, IParameterProps } from "../../../Interfaces";

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
  })
);

function getBoolValue(param: IParameter) {
  if (param.value === "true") {
    return true;
  } else if (param.value === "false") {
    return false;
  } else {
    return false;
  }
}

function DynamicBoolean(props: IParameterProps) {
  const classes = useStyles();
  const [checked, setChecked] = useState(getBoolValue(props.element));

  return (
    <div key={props.index} className={classes.Input}>
      <Typography variant="body1">{props.element.name} {props.element.isOptional !== true ? " *" : ""}</Typography>
      <Checkbox
        checked={checked}
        onChange={() => {
          props.editParams(props.element, !checked);
          setChecked(!checked);
        }}
      />
    </div>
  );
}

export default DynamicBoolean;
