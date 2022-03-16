import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CssBaseline,
  makeStyles,
  Theme,
  createStyles,
  Button,
  Typography, CardMedia, Box, Card,
} from "@material-ui/core";
import ModalAuth from "../components/ModalAuth";
import Navbar from "../components/Navbar";
import { isAuthenticated } from "../api/auth";
import GithubLogo from "../assets/GithubLogo.png";
import {IGithubEnv} from "../Interfaces";
import myFetch from "../api/api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f9f9f9",
      fontFamily: "Roboto",
    },
    navlinks: {
      marginLeft: theme.spacing(3),
      display: "flex",
    },
    logo: {
      lineHeight: "100%",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "20px",
      marginLeft: theme.spacing(2),
      "&:hover": {
        color: "gray",
      },
    },
    Container: {
      height: "100%",
      width: "100%",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    LoginForm: {
      width: "300px",
      margin: "auto auto 20px auto",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    ErrorMsg: {
      color: "red",
    },
    Card: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      width: "600px",
      height: "110px",
      marginBottom: "20px",
    },
    CardMedia: {
      width: "50%",
      padding: "20px",
      objectFit: "contain",
    },
  })
);

function AuthenticationPage() {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const openLogin = () => {
    setRequestType(true);
    setOpen(true);
  };

  const openRegister = () => {
    setRequestType(false);
    setOpen(true);
  };

  // function to handle modal close
  const handleClose = () => {
    setOpen(false);
  };

  const githubOAuth = async (type: string) => {
    localStorage.setItem("method", type);
    const res: IGithubEnv = await myFetch<IGithubEnv>(
      "/services/github/env",
      "GET"
    );
    const url: string = `https://github.com/login/oauth/authorize?client_id=${res.clientId}&state=${res.state}&scope=${res.scope}`;
    window.location.replace(url);
  }

  return (
    <CssBaseline>
      <Navbar />
      <div className="App">
        <div className={classes.Container}>
          <Typography variant="h4" gutterBottom={true}>
            Welcome to the AREA !
          </Typography>
          <div className={classes.LoginForm}>
            <Button variant="contained" color="primary" onClick={openLogin}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={openRegister}>
              Register
            </Button>
          </div>
          <Card className={classes.Card}>
            <CardMedia
              component={"img"}
              className={classes.CardMedia}
              src={GithubLogo}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "50%",
                padding: "1%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size={"medium"}
                onClick={() => {
                  githubOAuth("register");
                }}
              >
                Create an account with GitHub
              </Button>
            </Box>
          </Card>
          <Card className={classes.Card}>
            <CardMedia
              component={"img"}
              className={classes.CardMedia}
              src={GithubLogo}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "50%",
                padding: "1%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size={"medium"}
                onClick={() => {
                  githubOAuth("login");
                }}
              >
                Login with GitHub
              </Button>
            </Box>
          </Card>
          <ModalAuth
            open={open}
            handleClose={handleClose}
            isLogin={requestType}
            setError={setError}
          />
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
    </CssBaseline>
  );
}

export default AuthenticationPage;
