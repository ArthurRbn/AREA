import React, { useState } from "react";
import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import myFetch from "../api/api";
import { IAuthResponse, IFormProps } from "../Interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f9f9f9",
      fontFamily: "Roboto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(2),
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "300px",
      },
      "& .MuiButtonBase-root": {
        margin: theme.spacing(2),
      },
    },
  })
);

function RegisterForm(props: IFormProps) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    props.setError("");

    try {
      const data = {
        email: email,
        username: username,
        password: password,
      };
      const res: IAuthResponse = await myFetch<IAuthResponse>(
        "/auth/register",
        "POST",
        JSON.stringify(data)
      );
      props.handleClose();
      props.setError(res.error!);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="Username"
        variant="filled"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Email"
        variant="filled"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="filled"
        type={"password"}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <Button variant="contained" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Signup
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
