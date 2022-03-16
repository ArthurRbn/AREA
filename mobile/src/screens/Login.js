import React, { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import {
  Button,
  IconButton,
  Colors,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { decode } from 'base-64';
import request from '../api/request';
import { token, username as usernameStorage, exp } from '../utils/storage';

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const registerSuccess =
    (route.params && route.params.registerSuccess) || false;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    setIsLoading(true);

    try {
      const result = await request('/auth/login', 'POST', {
        username,
        password,
      });

      if (!result.status) {
        setError(`An error occured: ${result.error}.`);
        setIsLoading(false);
      } else {
        await token.set(result.token);

        const payload = JSON.parse(decode(result.token.split('.')[1]));
        await usernameStorage.set(payload.username);
        await exp.set(payload.exp.toString());

        navigateToHome();
      }
    } catch (err) {
      console.error(err);
      setError('An error occured. Please try again.');
      setIsLoading(false);
    }
  };

  const openServerSettings = () => navigation.navigate('Server settings');
  const navigateToRegister = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Register',
          },
        ],
      }),
    );
  };
  const navigateToHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
          },
        ],
      }),
    );
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const expTime = parseInt((await exp.get()) || 0, 10);
      const currentTime = new Date().getTime() / 1000;

      if (expTime > currentTime) {
        navigateToHome();
      }
    })();
  }, [navigateToHome]);

  const loginWithGithub = async () => {
    const res = await request('/services/github/env', 'GET');

    const { clientId, scope, state } = res;

    Linking.openURL(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&scope=${scope}`,
    );
  };

  useEffect(() => {
    const linkingBind = Linking.addEventListener('url', async data => {
      const url = new URL(data.url);

      const prefix = '/validate/';
      if (url.pathname.startsWith(prefix)) {
        const emailToken = url.pathname.substring(prefix.length);
        const result = await request(`/auth/verifyEmail/${emailToken}`);

        await token.set(result.token);

        const payload = JSON.parse(decode(result.token.split('.')[1]));
        await usernameStorage.set(payload.username);
        await exp.set(payload.exp.toString());

        navigateToHome();
      } else if (url.pathname === '/github/link') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        const res = await request('/services/github/login', 'POST', {
          code,
          state,
        });

        if (!res.status) {
          setError(`An error occured: ${res.error || 'unknown error'}.`);
        } else {
          await token.set(res.token);

          const payload = JSON.parse(decode(res.token.split('.')[1]));
          await usernameStorage.set(payload.username);
          await exp.set(payload.exp.toString());

          navigateToHome();
        }
      }
    });

    return () => {
      linkingBind.remove();
    };
  });

  return (
    <View>
      <View style={styles.settingsContainer}>
        <IconButton
          icon="cog"
          color={Colors.grey600}
          size={20}
          onPress={openServerSettings}
        />
      </View>
      {registerSuccess && (
        <Text style={styles.registerText}>
          You are now registered. Please validate your email address before
          logging in.
        </Text>
      )}
      <TextInput
        style={styles.input}
        label="Username"
        left={<TextInput.Icon name="account" color={Colors.grey700} />}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Password"
        left={<TextInput.Icon name="lock" color={Colors.grey700} />}
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.buttonContainer}>
        {isLoading && <ActivityIndicator animating={true} size={'large'} />}
        <Button
          style={styles.button}
          disabled={isLoading}
          icon="send"
          mode="contained"
          onPress={login}>
          Log in
        </Button>
      </View>
      <Button icon="github" onPress={loginWithGithub}>
        Login with GitHub
      </Button>
      <Button onPress={navigateToRegister}>Need an account?</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  button: {
    marginVertical: 12,
    width: 200,
    padding: 2,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e53935',
    marginHorizontal: 6,
    marginVertical: 2,
  },
  registerText: {
    marginHorizontal: 6,
    marginVertical: 2,
  },
});

export default Login;
