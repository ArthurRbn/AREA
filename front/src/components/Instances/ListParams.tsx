import React from "react";
import { Typography } from "@material-ui/core";
import { IListParamsProps, IParameter } from "../../Interfaces";
import DynamicBoolean from "./DynamicParameters/DynamicBoolean";
import DynamicString from "./DynamicParameters/DynamicString";
import DynamicNumber from "./DynamicParameters/DynamicNumber";
import DynamicTime from "./DynamicParameters/DynamicTime";
import DynamicDropdown from "./DynamicParameters/DynamicDropdown";
import DynamicOptions from "./DynamicParameters/DynamicOptions";

function ListParams(props: IListParamsProps) {
  return (
    <div>
      <Typography variant="body1" style={{ textAlign: "center" }}>Event parameters</Typography>
      {props.event.parameters.map((element: IParameter, index: number) => {
        if (element.type === "boolean") {
          return (
            <DynamicBoolean
              key={index}
              index={index}
              element={element}
              editParams={props.editParams}
            />
          );
        } else if (element.type === "string") {
          return (
            <DynamicString
              key={index}
              index={index}
              element={element}
              editParams={props.editParams}
            />
          );
        } else if (element.type === "number") {
          return (
            <DynamicNumber
              key={index}
              index={index}
              element={element}
              editParams={props.editParams}
            />
          );
        } else if (element.type === "time") {
          return (
            <DynamicTime
              key={index}
              index={index}
              element={element}
              editParams={props.editParams}
            />
          );
        } else if (element.type === "dropdown") {
          return (
            <DynamicDropdown
              key={index}
              index={index}
              element={element}
              editParams={props.editParams}
            />
          );
        } else if (element.type === "get") {
          return (
            <DynamicOptions
              key={index}
              index={index}
              element={element}
              editParams={props.editParams}
            />
          );
        }
        return (
          <DynamicBoolean
            key={index}
            index={index}
            element={element}
            editParams={props.editParams}
          />
        );
      })}
    </div>
  );
}

export default ListParams;