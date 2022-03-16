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

function DynamicNumber(props: IParameterProps) {
  const classes = useStyles();
  const [number, setNumber] = useState(props.element.value !== undefined ? props.element.value : null);

  return (
    <div key={props.index} className={classes.Input}>
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        fullWidth={true}
        className={classes.Field}
        placeholder={props.element.name + (props.element.isOptional !== true ? " *" : "")}
        label={props.element.placeholder}
        variant="standard"
        value={number}
        onChange={(e) => {
          props.editParams(props.element, e.target.value);
          setNumber(e.target.value);
        }}
      />
    </div>
  );
}

export default DynamicNumber;
