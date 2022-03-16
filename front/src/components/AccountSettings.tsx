import React, { useEffect, useState } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  TextField,
  Button,
} from "@material-ui/core";
import {
  IAccountSettings,
  IProfileData,
  IProfileProps,
  IStatusResponse,
} from "../Interfaces";
import myFetch from "../api/api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Title: {
      margin: "30px auto",
    },
    SettingsContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: "auto",
      marginBottom: "20px",
    },
    ErrorMsg: {
      color: "red",
    },
    Input: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      justifyItems: "center",
      padding: "10px 0",
    },
    Field: {
      margin: "5px 0",
    },
    SaveButton: {
      minWidth: "100px",
      maxWidth: "200px",
    },
  })
);

async function saveUsername(
  props: IProfileProps,
  newUsername: string,
  newEmail: string,
  newPassword: string,
  confirmPassword: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  if (
    props.infos.username !== newUsername ||
    props.infos.email !== newEmail ||
    (newPassword !== "" && newPassword === confirmPassword)
  ) {
    const data: IAccountSettings = {
      username: newUsername !== props.infos.username ? newUsername : undefined,
      password:
        newPassword !== "" && newPassword === confirmPassword
          ? newPassword
          : undefined,
      email: props.infos.email !== newEmail ? newEmail : undefined,
    };
    const res: IStatusResponse = await myFetch<IStatusResponse>(
      "/profile",
      "PATCH",
      JSON.stringify(data)
    );
    if (res.status) {
      const newInfos: IProfileData = {
        ...props.infos,
        username: newUsername !== props.infos.username ? newUsername : props.infos.username,
        email: props.infos.email !== newEmail ? newEmail : props.infos.email,
      };
      props.setInfos(newInfos);
    } else {
      console.log(res.error);
      setError(res.error!);
    }
  }
}

function AccountSettings(props: IProfileProps) {
  const classes = useStyles();
  const [newUsername, setUsername] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmPass, setConfirmation] = useState("");
  const [newEmail, setEmail] = useState(props.infos.email.toString());
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername(props.infos.username);
    setEmail(props.infos.email);
  }, [props.infos.email, props.infos.username]);

  return (
    <div>
      <Typography variant="h3" className={classes.Title}>
        Account settings
      </Typography>
      <div className={classes.SettingsContainer}>
        <div className={classes.Input}>
          <TextField
            className={classes.Field}
            label="Username"
            variant="standard"
            value={newUsername}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            className={classes.Field}
            label="Email"
            variant="standard"
            value={newEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className={classes.Field}
            label="Password"
            variant="standard"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            className={classes.Field}
            label="Confirm password"
            variant="standard"
            value={confirmPass}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size={"small"}
          className={classes.SaveButton}
          onClick={async () => {
            await saveUsername(
              props,
              newUsername,
              newEmail,
              newPassword,
              confirmPass,
              setError
            );
          }}
        >
          Save
        </Button>
        {error.length ? (
          <Typography
            variant="h5"
            gutterBottom={false}
            className={classes.ErrorMsg}
          >
            {error}
          </Typography>
        ) : null}
      </div>
    </div>
  );
}

export default AccountSettings;
