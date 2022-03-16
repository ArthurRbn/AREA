import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import ServiceChoice from "./ServiceChoice";
import {
  Button,
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import {
  IAction, IInstance,
  IInstanceConfig,
  IModalInstanceProps, IParameter, IProfileData,
  IServiceListItem,
  IStatusResponse
} from "../../Interfaces";
import myFetch from "../../api/api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Container: {
      height: "100%",
      width: "100%",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    ModalButtons: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-evenly",
    },
  })
);

function checkMissingParams(instance: IInstance, required: IInstance) {
  if (instance.action?.serviceName === undefined || instance.reaction?.serviceName === undefined) {
    return false;
  }
  if (required.action?.params?.every((param: IParameter) => {
    const ref = instance.action?.params?.find(x => x.name === param.name);
    return !(ref === undefined && param.isOptional === undefined);
  }) === false) {
    return false;
  }
  return required.reaction?.params?.every((param: IParameter) => {
    const ref = instance.reaction?.params?.find(x => x.name === param.name);
    return !(ref === undefined && param.isOptional === undefined);
  });
}

function isServiceEnabled(name: string, profileData: IProfileData) {
  if (name === "discord" && profileData.discordLinked) {
    return false;
  } else if (name === "github" && profileData.githubLinked) {
    return false;
  } else if (name === "trello" && profileData.trelloLinked) {
    return false;
  } else if (name === "todoist" && profileData.todoistLinked) {
    return false;
  } else if (name === "reddit" && profileData.redditLinked) {
    return false;
  } else if (name === "twitter" && profileData.twitterLinked) {
    return false;
  } else if (name === "mail") {
    return false;
  }
  return true;
}

function ModalInstance(props: IModalInstanceProps) {
  const classes = useStyles();
  const [actionServices, setActionServices] = useState<IServiceListItem[]>([]);
  const [reactionServices, setReactionServices] = useState<IServiceListItem[]>([]);
  const [newInstance, setNewInstance] = useState<IInstance>({action: undefined, reaction: undefined,});
  const [requiredParams, setRequiredParams] = useState<IInstance>({action: undefined, reaction: undefined,});
  const [error, setError] = useState<string>("");

  const initialize = async () => {
    const profileData: IProfileData = await myFetch<IProfileData>("/profile", "GET");
    const actions: IAction[] = await myFetch<IAction[]>("/actions", "GET");
    const actionList = Array.from(actions, (x: IAction) => {
      return {
        value: x.name,
        label: x.displayName,
        description: x.description,
        widgets: x.widgets,
        isDisabled: isServiceEnabled(x.name, profileData),
      };
    });
    setActionServices(actionList);

    const reactions: IAction[] = await myFetch<IAction[]>("/reactions", "GET");
    const reactionList = Array.from(reactions, (x: IAction) => {
      return {
        value: x.name,
        label: x.displayName,
        description: x.description,
        widgets: x.widgets,
        isDisabled: isServiceEnabled(x.name, profileData),
      };
    });
    setReactionServices(reactionList);
  };

  useEffect(() => {
    initialize();
  }, []);

  const createInstance = async () => {
    if (checkMissingParams(newInstance, requiredParams)) {
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/instances",
        "POST",
        JSON.stringify(newInstance)
      );
      if (res.status) {
        props.refreshInstances();
      } else {
        props.emitError(res.error!);
      }
      setNewInstance({ action: undefined, reaction: undefined });
      props.handleClose();
    } else {
      setError("Missing parameters");
      setTimeout(() => { setError(""); }, 5000);
    }
  };

  const editInstance = (type: string, config: IInstanceConfig) => {
    if (type === "action") {
      const modifiedInstance: IInstance = {
        action: config,
        reaction: {
          ...newInstance!.reaction!,
        }
      };
      setNewInstance(modifiedInstance);
    } else if (type === "reaction") {
      const modifiedInstance: IInstance = {
        ...newInstance!,
        reaction: config,
      };
      setNewInstance(modifiedInstance);
    }
  };

  const setRequired = (type: string, config: IInstanceConfig) => {
    if (type === "action") {
      setRequiredParams({
        ...requiredParams,
        action: config,
      })
    } else {
      setRequiredParams({
        ...requiredParams,
        reaction: config,
      })
    }
  }

  return (
    <Dialog
      id={"dialogBody"}
      style={{ overflow: "visible" }}
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogContent style={{ overflow: "visible" }}>
        <div className={classes.Container}>
          <Typography variant="h6">Action</Typography>
          <ServiceChoice
            editInstance={editInstance}
            type={"action"}
            servicesList={actionServices}
            setRequired={setRequired}
          />

          <Typography variant="h6">Reaction</Typography>
          <ServiceChoice
            editInstance={editInstance}
            type={"reaction"}
            servicesList={reactionServices}
            setRequired={setRequired}
          />

          <Typography variant="h6" color={"secondary"} gutterBottom={true}>
            { error }
          </Typography>

          <div className={classes.ModalButtons}>
            <Button variant="text" onClick={props.handleClose}>
              Cancel
            </Button>
            <Button
              variant="text"
              color="primary"
              size={"medium"}
              onClick={() => {
                createInstance();
              }}
            >
              Create instance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalInstance;
