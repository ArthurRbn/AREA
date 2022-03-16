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

function DynamicTime(props: IParameterProps) {
  const classes = useStyles();
  const [hours, setHours] = useState(props.element.value !== undefined ? +(props.element.value.split(":")[0]) : null);
  const [minutes, setMinutes] = useState(props.element.value !== undefined ? +(props.element.value.split(":")[1]) : null);
  const [error, setError] = useState(false);

  const formatTime = (value: string ,type: string) => {
    if (type === "hours" && 0 <= +value && +value < 24) {
      setHours(+value);
      return `${value}:${minutes}`;
    } else if (type === "minutes" && 0 <= +value && +value < 60) {
      setMinutes(+value);
      return `${hours}:${value}`;
    }
    setHours(0);
    setMinutes(0);
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
    return "00:00";
  }

  return (
    <div key={props.index} className={classes.Input}>
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        fullWidth={true}
        color={error ? "secondary" : "primary"}
        className={classes.Field}
        placeholder={props.element.name}
        label={props.element.placeholder + "(hours)" + (props.element.isOptional !== true ? " *" : "")}
        variant="standard"
        value={hours}
        onChange={(e) => {
          props.editParams(props.element, formatTime(e.target.value, "hours"));
        }}
      />
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        fullWidth={true}
        color={error ? "secondary" : "primary"}
        className={classes.Field}
        placeholder={props.element.name}
        label={props.element.placeholder + "(minutes)" + (props.element.isOptional !== true ? " *" : "")}
        variant="standard"
        value={minutes}
        onChange={(e) => {
          props.editParams(props.element, formatTime(e.target.value, "minutes"));
        }}
      />
    </div>
  );
}

export default DynamicTime;
