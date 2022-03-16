import React, { useCallback, useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  Box,
  Typography,
  IconButton,
  Button,
} from "@material-ui/core";
import {
  IAction,
  IEventListItem,
  IInstance,
  IInstanceConfig,
  IInstanceEditorProps,
  IParameter,
  IWidget,
} from "../../Interfaces";
import { DeleteOutlineTwoTone, Settings } from "@material-ui/icons";
import ListParams from "./ListParams";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Card: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      width: "100%",
      height: "100%",
      padding: "15px 5px",
      overflow: "visible",
    },
    Collapsible: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      height: "0",
      transition: "all 0.5s ease",
      borderRadius: "0.25rem",
      overflow: "hidden",
    },
    CollapsibleActive: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      height: "310px",
      transition: "all 0.5s ease",
      borderRadius: "0.25rem",
    },
  })
);

// function to get missing parameters and information such as placeholder or dropdown options

async function getConfig(config: IInstanceConfig, reference: IAction[]) {
  const correspondingService = reference.find((x: IAction) => {
    return x.name === config.serviceName;
  });
  if (correspondingService) {
    const correspondingAction = correspondingService.widgets.find(
      (x: IWidget) => {
        return x.name === config.name;
      }
    );
    return {
      ...config,
      params: correspondingAction!.params.map((param: IParameter) => {
        const correspondingParam = config.params.find(
          (x) => x.name === param.name
        );
        if (correspondingParam) {
          return { ...param, value: correspondingParam.value };
        } else {
          return param;
        }
      }),
    };
  }
  return config;
}

async function getMissingInfos(oldInstance: IInstance, actions: IAction[], reactions: IAction[]): Promise<IInstance> {
  const action = await getConfig(oldInstance.action!, actions);
  const reaction = await getConfig(oldInstance.reaction!, reactions);

  return {
    ...oldInstance,
    action: action,
    reaction: reaction,
  };
}

function InstanceEditor(props: IInstanceEditorProps) {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [instance, setInstance] = useState<IInstance | undefined>(undefined);
  const [actionParams, setActionParameters] = useState<IEventListItem | undefined>(undefined);
  const [reactionParams, setReactionParameters] = useState<IEventListItem | undefined>(undefined);

  const initialize = useCallback(async () => {
    const newInstance = await getMissingInfos(props.instance, props.actions, props.reactions);
    setInstance(newInstance);
    const tmpAct: IEventListItem = {
      value: newInstance.action?.name!,
      label: newInstance.action?.displayName!,
      description: newInstance.action?.displayName!,
      parameters: newInstance.action?.params!,
    };
    setActionParameters(tmpAct);
    const tmpReact: IEventListItem = {
      value: newInstance.reaction?.name!,
      label: newInstance.reaction?.displayName!,
      description: newInstance.reaction?.displayName!,
      parameters: newInstance.reaction?.params!,
    };
    setReactionParameters(tmpReact);
  }, [props]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const toggleSettings = () => {
    setOpen(!open);
  };

  const editActionParams = (edit: IParameter, value: any) => {
    const modifiedInstance: IInstance = {
      ...instance,
      action: {
        ...instance!.action!,
        params: Array.from(instance!.action?.params!, (x: IParameter) => {
          if ((x.type === "get" || x.type === "dropdown") && x.name === edit.name) {
            return {
              name: x.name,
              type: edit.type,
              value: value,
            }
          } else {
            return {
              ...x,
              value: x.name === edit.name ? value : x.value,
            };
          }
        }),
      },
    };
    setInstance(modifiedInstance);
  };

  const editReactionParams = (edit: IParameter, value: any) => {
    const modifiedInstance: IInstance = {
      ...instance,
      reaction: {
        ...instance!.reaction!,
        params: Array.from(instance!.reaction?.params!, (x: IParameter) => {
          if ((x.type === "get" || x.type === "dropdown") && x.name === edit.name) {
            return {
              name: x.name,
              type: edit.type,
              value: value,
            }
          } else {
            return {
              ...x,
              value: x.name === edit.name ? value : x.value,
            };
          }
        }),
      },
    };
    setInstance(modifiedInstance);
  };

  return (
    <Card className={classes.Card}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          padding: "1%",
        }}
      >
        <Typography variant="h6" gutterBottom={true}>
          {instance ? (
            <div>
              When {instance.action?.displayName} on {instance.action?.serviceName}
              <br />{instance.reaction?.displayName}
            </div>
          ) : null}
        </Typography>

        <div className={open ? classes.CollapsibleActive : classes.Collapsible}>
          {actionParams ? (
            <ListParams event={actionParams} editParams={editActionParams} />
          ) : null}
          {reactionParams ? (
            <ListParams
              event={reactionParams}
              editParams={editReactionParams}
            />
          ) : null}
        </div>

        <div>
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={toggleSettings}
            >
              <Settings color="primary" />
            </IconButton>
          </label>
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => {
                if (instance) {
                  props.deleteInstance(instance);
                }
              }}
            >
              <DeleteOutlineTwoTone color="primary" />
            </IconButton>
          </label>
          {open ? (
          <Button
            variant="contained"
            color="primary"
            size={"medium"}
            onClick={() => {
              if (instance) {
                props.saveInstance(instance);
                toggleSettings();
              }
            }}
          >
            Save
          </Button>
        ) : null}
        </div>
      </Box>
    </Card>
  );
}

export default InstanceEditor;
