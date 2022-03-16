import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from "@material-ui/core";
import "./ListServices.css";
import GithubLogo from "../../assets/GithubLogo.png";
import TrelloLogo from "../../assets/TrelloLogo.png";
import TwitterLogo from "../../assets/TwitterLogo.png";
import RedditLogo from "../../assets/RedditLogo.png";
import TodoistLogo from "../../assets/TodoistLogo.png";
import DiscordLogo from "../../assets/DiscordLogo.png";
import myFetch from "../../api/api";
import {
  IGithubEnv,
  IProfileData,
  IProfileProps,
  IStatusResponse,
  IRedirectOAuth,
  ITwitterOAuth,
  IDiscordOAuth,
} from "../../Interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Title: {
      margin: "30px auto",
    },
    Card: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      width: "600px",
      height: "110px",
      marginBottom: "20px",
    },
    CardContent: {
      flex: "1 0 auto",
    },
    CardMedia: {
      width: "50%",
      padding: "20px",
      objectFit: "contain",
    },
  })
);

function ListServices(props: IProfileProps) {
  const classes = useStyles();
  const [error, setError] = useState<boolean>(false);

  const githubOAuth = async () => {
    if (props.infos.githubLinked) {
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/services/github/unlink",
        "GET"
      );
      if (res.status) {
        const newInfos: IProfileData = {
          ...props.infos,
          githubLinked: false,
        };
        props.setInfos(newInfos);
        myFetch<IStatusResponse>(`/instances/delete/github`, "DELETE");
      } else {
        if (res.error === "Impossible to revoke.") {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 5000);
        }
        console.log("ERROR: ", res.error);
      }
    } else {
      localStorage.setItem("method", "linking");
      const res: IGithubEnv = await myFetch<IGithubEnv>(
        "/services/github/env",
        "GET"
      );
      const url: string = `https://github.com/login/oauth/authorize?client_id=${res.clientId}&state=${res.state}&scope=${res.scope}`;
      window.location.replace(url);
    }
  };

  const trelloOAuth = async () => {
    if (props.infos.trelloLinked) {
      await myFetch<IStatusResponse>(`/instances/delete/trello`, "DELETE");
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/services/trello/unlink",
        "GET"
      );
      if (res.status) {
        const newInfos: IProfileData = {
          ...props.infos,
          trelloLinked: false,
        };
        props.setInfos(newInfos);
      } else {
        console.log("ERROR: ", res.error);
      }
    } else {
      const res: IRedirectOAuth = await myFetch<IRedirectOAuth>(
        "/services/trello/connect",
        "POST",
        JSON.stringify({ callback: "http://localhost:8081/trello/link" })
      );
      if (res.status) {
        window.location.replace(res.redirectUrl!);
      } else {
        console.log("ERROR: ", res.error);
      }
    }
  };

  const twitterOAuth = async () => {
    if (props.infos.twitterLinked) {
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/services/twitter/unlink",
        "GET"
      );
      myFetch<IStatusResponse>(`/instances/delete/github`, "DELETE");
      if (res.status) {
        const newInfos: IProfileData = {
          ...props.infos,
          twitterLinked: false,
        };
        props.setInfos(newInfos);
      } else {
        console.log("ERROR: ", res.error);
      }
    } else {
      const res: ITwitterOAuth = await myFetch<ITwitterOAuth>(
        "/services/twitter/connect",
        "GET",
      );
      if (res.status) {
        window.location.replace(res.url!);
      } else {
        console.log("ERROR: ", res.error);
      }
    }
  };

  const redditOAuth = async () => {
    if (props.infos.redditLinked) {
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/services/reddit/unlink",
        "GET"
      );
      myFetch<IStatusResponse>(`/instances/delete/github`, "DELETE");
      if (res.status) {
        const newInfos: IProfileData = {
          ...props.infos,
          redditLinked: false,
        };
        props.setInfos(newInfos);
      } else {
        console.log("ERROR: ", res.error);
      }
    } else {
      const res: any = await myFetch<any>("/services/reddit/connect", "GET");
      window.location.replace(res["url"]);
    }
  };

  const todoistOAuth = async () => {
    if (props.infos.todoistLinked) {
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/services/todoist/unlink",
        "GET"
      );
      myFetch<IStatusResponse>(`/instances/delete/github`, "DELETE");
      if (res.status) {
        const newInfos: IProfileData = {
          ...props.infos,
          todoistLinked: false,
        };
        props.setInfos(newInfos);
      } else {
        console.log("ERROR: ", res.error);
      }
    } else {
      const res: any = await myFetch<any>("/services/todoist/connect", "GET");
      window.location.replace(res["url"]);
    }
  };

  const discordOAuth = async () => {
    if (props.infos.discordLinked) {
      const res: IStatusResponse = await myFetch<IStatusResponse>(
        "/services/discord/unlink",
        "GET"
      );
      myFetch<IStatusResponse>(`/instances/delete/github`, "DELETE");
      if (res.status) {
        const newInfos: IProfileData = {
          ...props.infos,
          discordLinked: false,
        };
        props.setInfos(newInfos);
      } else {
        console.log("ERROR: ", res.error);
      }
    } else {
      const res: IDiscordOAuth = await myFetch<IDiscordOAuth>(
        "/services/discord/env",
        "GET"
      );
      if (res.status) {
        window.location.replace(
          `https://discord.com/api/oauth2/authorize?client_id=${res.clientId}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fdiscord%2Flink&response_type=code&scope=${res.scope}`
        );
      }
    }
  };

  return (
    <div>
      <Typography variant="h3" className={classes.Title}>
        My services
      </Typography>
      {error ? (
        <Typography variant="h5" className={classes.Title}>
          You can't unlink the service used to create your account.
        </Typography>
      ) : null}
      <div className="ListContainer">
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
              onClick={githubOAuth}
            >
              {props.infos.githubLinked ? "Revoke access" : "Link account"}
            </Button>
          </Box>
        </Card>

        <Card className={classes.Card}>
          <CardMedia
            component={"img"}
            className={classes.CardMedia}
            src={TrelloLogo}
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
              onClick={trelloOAuth}
            >
              {props.infos.trelloLinked ? "Revoke access" : "Link account"}
            </Button>
          </Box>
        </Card>

        <Card className={classes.Card}>
          <CardMedia
            component={"img"}
            className={classes.CardMedia}
            src={TwitterLogo}
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
              onClick={twitterOAuth}
            >
              {props.infos.twitterLinked ? "Revoke access" : "Link account"}
            </Button>
          </Box>
        </Card>

        <Card className={classes.Card}>
          <CardMedia
            component={"img"}
            className={classes.CardMedia}
            src={RedditLogo}
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
              onClick={redditOAuth}
            >
              {props.infos.redditLinked ? "Revoke access" : "Link account"}
            </Button>
          </Box>
        </Card>

        <Card className={classes.Card}>
          <CardMedia
            component={"img"}
            className={classes.CardMedia}
            src={TodoistLogo}
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
              onClick={todoistOAuth}
            >
              {props.infos.todoistLinked ? "Revoke access" : "Link account"}
            </Button>
          </Box>
        </Card>

        <Card className={classes.Card}>
          <CardMedia
            component={"img"}
            className={classes.CardMedia}
            src={DiscordLogo}
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
              onClick={discordOAuth}
            >
              {props.infos.discordLinked ? "Revoke access" : "Link account"}
            </Button>
          </Box>
        </Card>
      </div>
    </div>
  );
}

export default ListServices;
