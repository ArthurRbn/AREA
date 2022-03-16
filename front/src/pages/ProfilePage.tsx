import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  makeStyles,
  Theme,
  createStyles,
  Typography,
} from "@material-ui/core";
import Navbar from "../components/Navbar";
import ListServices from "../components/ListServices/ListServices";
import AccountSettings from "../components/AccountSettings";
import myFetch from "../api/api";
import { IProfileData } from "../Interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Container: {
      height: "100%",
      width: "50%",
      margin: "100px auto auto auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    Separator: {
      height: "1px",
      border: "1px solid #3f51b5ff",
      width: "100%",
      margin: "10px 0",
    },
  })
);

const init_values: IProfileData = {
  username: "",
  email: "",
  twitterLinked: false,
  githubLinked: false,
  trelloLinked: false,
  redditLinked: false,
  todoistLinked: false,
  discordLinked: false,
};

function ProfilePage() {
  const classes = useStyles();
  const [infos, setInfos] = useState<IProfileData>(init_values);

  async function getInfos() {
    try {
      myFetch<IProfileData>("/profile", "GET").then(function (
        response: IProfileData
      ) {
        setInfos(response);
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getInfos();
  }, []);

  return (
    <CssBaseline>
      <Navbar />
      <div className="App">
        <div className={classes.Container}>
          <Typography variant="h2">Profile</Typography>
          <div className={classes.Separator} />
          <div>
            <AccountSettings infos={infos} setInfos={setInfos} />
          </div>
          <div className={classes.Separator} />
          <ListServices infos={infos} setInfos={setInfos} />
        </div>
      </div>
    </CssBaseline>
  );
}

export default ProfilePage;
