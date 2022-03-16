import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Linking, ScrollView } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Headline,
  ActivityIndicator,
} from 'react-native-paper';
import request from '../api/request';

const Profile = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [originalUsername, setOriginalUsername] = useState();
  const [username, setUsername] = useState({ changes: false, val: '' });
  const [email, setEmail] = useState({ changes: false, val: '' });
  const [password, setPassword] = useState({ changes: false, val: '' });
  const [passwordConf, setPasswordConf] = useState('');
  const [twitterLinked, setTwitterLinked] = useState(false);
  const [githubLinked, setGithubLinked] = useState(false);
  const [trelloLinked, setTrelloLinked] = useState(false);
  const [discordLinked, setDiscordLinked] = useState(false);
  const [redditLinked, setRedditLinked] = useState(false);
  const [todoistLinked, setTodoistLinked] = useState(false);

  const anyChanges = username.changes || email.changes || password.changes;

  const updateProfile = async () => {
    const res = await request('/profile', 'PATCH', {
      email: email.changes ? email.val : undefined,
      username: username.changes ? username.val : undefined,
      password: password.changes ? password.val : undefined,
    });

    if (res.status) {
      setEmail({ changes: false, val: email.val });
      setUsername({ changes: false, val: username.val });
      setPassword({ changes: false, val: '' });
      setPasswordConf('');
      setError(null);
    } else {
      setError(res.error);
    }
  };

  const linkTwitter = async () => {
    if (twitterLinked) {
      const res = await request('/services/twitter/unlink');
      if (res.status) {
        setTwitterLinked(false);
      }
      return;
    }

    const res = await request('/services/twitter/connect');
    Linking.openURL(res.url);
  };

  const linkGithub = async () => {
    if (githubLinked) {
      const res = await request('/services/github/unlink');
      if (res.status) {
        setGithubLinked(false);
      }
      return;
    }

    const res = await request('/services/github/env', 'GET');

    const { clientId, scope, state } = res;

    Linking.openURL(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&scope=${scope}`,
    );
  };

  const linkTrello = async () => {
    if (trelloLinked) {
      const res = await request('/services/trello/unlink');
      if (res.status) {
        setTrelloLinked(false);
      }
      return;
    }

    const res = await request('/services/trello/connect', 'POST', {
      callback: 'http://localhost:8081/trello/link',
    });

    Linking.openURL(res.redirectUrl);
  };

  const linkDiscord = async () => {
    if (discordLinked) {
      const res = await request('/services/discord/unlink');
      if (res.status) {
        setDiscordLinked(false);
      }
      return;
    }

    const res = await request('/services/discord/env', 'GET');
    const { clientId, scope } = res;

    Linking.openURL(
      `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fdiscord%2Flink&response_type=code&scope=${scope}`,
    );
  };

  const linkReddit = async () => {
    if (redditLinked) {
      const res = await request('/services/reddit/unlink');
      if (res.status) {
        setRedditLinked(false);
      }
      return;
    }

    const res = await request('/services/reddit/connect', 'GET');
    const { url } = res;

    Linking.openURL(url);
  };

  const linkTodoist = async () => {
    if (todoistLinked) {
      const res = await request('/services/todoist/unlink');
      if (res.status) {
        setTodoistLinked(false);
      }
      return;
    }

    const res = await request('/services/todoist/connect', 'GET');
    const { url } = res;

    Linking.openURL(url);
  };

  useEffect(() => {
    const linkingBind = Linking.addEventListener('url', async data => {
      const url = new URL(data.url);

      if (url.pathname === '/twitter/link') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        const res = await request('/services/twitter/link', 'POST', {
          code,
          state,
        });

        if (res.status) {
          setTwitterLinked(!twitterLinked);
        }
      } else if (url.pathname === '/github/link') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        const res = await request('/services/github/link', 'POST', {
          code,
          state,
        });

        if (res.status) {
          setGithubLinked(!githubLinked);
        }
      } else if (url.pathname === '/trello/link') {
        const oauthToken = url.searchParams.get('oauth_token');
        const oauthVerifier = url.searchParams.get('oauth_verifier');

        const res = await request('/services/trello/link', 'POST', {
          oauthToken,
          oauthVerifier,
        });

        if (res.status) {
          setTrelloLinked(!trelloLinked);
        }
      } else if (url.pathname === '/discord/link') {
        const code = url.searchParams.get('code');
        const guildId = url.searchParams.get('guild_id');
        const permissions = parseInt(url.searchParams.get('permissions'), 10);

        const res = await request('/services/discord/link', 'POST', {
          code,
          guildId,
          permissions,
        });

        if (res.status) {
          setDiscordLinked(!discordLinked);
        }
      } else if (url.pathname === '/reddit/link') {
        const token = url.searchParams.get('code');
        const res = await request('/services/reddit/link', 'POST', {
          token,
        });
        if (res) {
          setRedditLinked(!redditLinked);
        }
      } else if (url.pathname === '/todoist/link') {
        const token = url.searchParams.get('code');
        const res = await request('/services/todoist/link', 'POST', {
          token,
        });
        if (res) {
          setTodoistLinked(!todoistLinked);
        }
      }
    });

    return () => {
      linkingBind.remove();
    };
  });

  useEffect(() => {
    (async () => {
      setIsFetching(true);

      const profile = await request('/profile');
      setTwitterLinked(profile.twitterLinked);
      setGithubLinked(profile.githubLinked);
      setTrelloLinked(profile.trelloLinked);
      setDiscordLinked(profile.discordLinked);
      setRedditLinked(profile.redditLinked);
      setTodoistLinked(profile.todoistLinked);
      setOriginalUsername(profile.username);
      setUsername({ changes: false, val: profile.username });
      setEmail({ changes: false, val: profile.email });

      setIsFetching(false);
    })();
  }, []);

  if (isFetching) {
    return (
      <ActivityIndicator
        style={styles.container}
        animating={true}
        size={'large'}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Headline>Hi {originalUsername}!</Headline>
      <Text>Edit your profile</Text>
      <TextInput
        style={styles.textInput}
        label="Email address"
        value={email.val}
        keyboardType="email-address"
        onChangeText={val => {
          setEmail({
            changes: true,
            val,
          });
        }}
      />
      <TextInput
        style={styles.textInput}
        label="Username"
        value={username.val}
        onChangeText={val => {
          setUsername({
            changes: true,
            val,
          });
        }}
      />
      <TextInput
        style={styles.textInput}
        label="Password"
        value={password.val}
        secureTextEntry
        onChangeText={val => {
          setPassword({
            changes: true,
            val,
          });
        }}
      />
      <TextInput
        style={styles.textInput}
        secureTextEntry
        label="Confirm password"
        value={passwordConf}
        onChangeText={setPasswordConf}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button disabled={!anyChanges} onPress={updateProfile}>
        Confirm changes
      </Button>
      <View style={styles.buttonContainer}>
        <Text>Link your accounts</Text>
        <Button style={styles.button} icon="twitter" onPress={linkTwitter}>
          {twitterLinked ? 'Unlink Twitter' : 'Link Twitter'}
        </Button>
        <Button style={styles.button} icon="github" onPress={linkGithub}>
          {githubLinked ? 'Unlink GitHub' : 'Link GitHub'}
        </Button>
        <Button style={styles.button} icon="trello" onPress={linkTrello}>
          {trelloLinked ? 'Unlink Trello' : 'Link Trello'}
        </Button>
        <Button style={styles.button} icon="discord" onPress={linkDiscord}>
          {discordLinked ? 'Unlink Discord' : 'Link Discord'}
        </Button>
        <Button style={styles.button} icon="reddit" onPress={linkReddit}>
          {redditLinked ? 'Unlink Reddit' : 'Link Reddit'}
        </Button>
        <Button style={styles.button} icon="view-list" onPress={linkTodoist}>
          {todoistLinked ? 'Unlink Todoist' : 'Link Todoist'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  textInput: {
    marginVertical: 2,
  },
  errorText: {
    marginHorizontal: 6,
    marginVertical: 2,
  },
  buttonContainer: {
    marginTop: 6,
  },
  button: {
    margin: 2,
  },
});

export default Profile;
