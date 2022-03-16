import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { setToken } from "../api/auth";
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

function LoginForm(props: IFormProps) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    props.setError("");

    const data = {
      username: username,
      password: password,
    };

    try {
      const res: IAuthResponse = await myFetch<IAuthResponse>(
        "/auth/login",
        "POST",
        JSON.stringify(data)
      );
      if (!res.status) {
        props.setError(res.error!);
        props.handleClose();
      } else {
        setToken(res.token!);
        navigate("/");
        props.handleClose();
      }
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

export default LoginForm;
