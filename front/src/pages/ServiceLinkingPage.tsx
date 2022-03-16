import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  makeStyles,
  Theme,
  createStyles,
  Typography,
} from "@material-ui/core";
import Navbar from "../components/Navbar";
import myFetch from "../api/api";
import {IAuthResponse, IStatusResponse} from "../Interfaces";
import {setToken} from "../api/auth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Container: {
      height: "100%",
      width: "100%",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  })
);

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getServiceName() {
  if (window.location.toString().indexOf("twitter") !== -1) {
    return "twitter";
  } else if (window.location.toString().indexOf("trello") !== -1) {
    return "trello";
  } else if (window.location.toString().indexOf("github") !== -1) {
    return "github";
  } else if (window.location.toString().indexOf("todoist") !== -1) {
    return "todoist";
  } else if (window.location.toString().indexOf("reddit") !== -1) {
    return "reddit";
  } else if (window.location.toString().indexOf("discord") !== -1) {
    return "discord";
  } else {
    return undefined;
  }
}

function getData(service: string) {
  const params = new URLSearchParams(window.location.search);

  if (service === "twitter") {
    return {
      code: params.get("code"),
      state: params.get("state"),
    };
  } else if (service === "trello") {
    return {
      oauthToken: params.get("oauth_token"),
      oauthVerifier: params.get("oauth_verifier"),
    };
  } else if (service === "github") {
    return {
      code: params.get("code"),
      state: params.get("state"),
    };
  } else if (service === "reddit" || service === "todoist") {
    return {
      token: params.get("code"),
    };
  } else if (service === "discord") {
    return {
      code: params.get("code"),
      guildId: params.get("guild_id"),
      permissions: parseInt(params.get("permissions")!),
    };
  }
}

async function githubAuthentication(setStatus: React.Dispatch<React.SetStateAction<string>>) {
  const service = "github";
  const data = getData(service);
  const url = `/services/github/${localStorage.getItem("method")}`;
  const res: IAuthResponse = await myFetch<IAuthResponse>(
    url,
    "POST",
    JSON.stringify(data)
  );
  if (res.status) {
    setToken(res.token!);
    localStorage.removeItem("method");
    window.location.replace("/");
  } else {
    console.log("ERROR: ", res.error);
    setStatus(res.error!);
    setTimeout(function () {
      window.location.replace("/auth");
    }, 3000);
    window.location.replace("/");
  }
}

function ServiceLinkingPage() {
  const classes = useStyles();
  const [status, setStatus] = useState("");

  async function validateOAuth() {
    if (window.location.toString().indexOf("github") !== -1 && localStorage.getItem("method") !== "linking") {
      await githubAuthentication(setStatus);
      return;
    }
    try {
      localStorage.removeItem("method");
      const service: string | undefined = getServiceName();
      if (service === undefined) {
        return;
      }
      const data = getData(service);
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        `/services/${service}/link`,
        "POST",
        JSON.stringify(data)
      );
      if (res.status) {
        setStatus(`${capitalizeFirstLetter(service)} account successfully linked, redirection in 3s.`);
        setTimeout(function () {
          window.location.replace("/profile");
        }, 3000);
      } else {
        console.log("ERROR: ", res.error);
        setStatus(res.error!);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    validateOAuth();
  }, []);

  return (
    <CssBaseline>
      <Navbar />
      <div className="App">
        <div className={classes.Container}>
          <h1>Account Linking</h1>
          {status.length ? (
            <Typography variant="h5" gutterBottom={false}>
              {status}
            </Typography>
          ) : null}
        </div>
      </div>
    </CssBaseline>
  );
}

export default ServiceLinkingPage;
