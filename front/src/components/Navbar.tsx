import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {clearToken, isAuthenticated} from "../api/auth";

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
    Logout: {
      marginLeft: "auto",
      padding: "1px 0",
    },
    LogoutButton: {
      maxHeight: "40px",
      color: "black",
      backgroundColor: "orange",
    },
  })
);

function Navbar() {
  const classes = useStyles();

  return (
    <AppBar>
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          AREA
        </Typography>
        <div className={classes.navlinks}>
          <Link to="/" className={classes.link}>
            Home
          </Link>
          <Link to="/profile" className={classes.link}>
            Profile
          </Link>
          <Link to="/auth" className={classes.link}>
            Authenticate
          </Link>
        </div>
        { isAuthenticated() ?
          <div className={classes.Logout}>
            <Button
              variant="contained"
              size={"small"}
              className={classes.LogoutButton}
              onClick={() => {
                clearToken();
                window.location.replace("/auth");
              }}
            >
              <p>Logout</p>
            </Button>
          </div>
          : null
        }

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
