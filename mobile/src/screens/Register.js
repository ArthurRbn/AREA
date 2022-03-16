import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
  Button,
  IconButton,
  Colors,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import request from '../api/request';
import { decode } from 'base-64';
import { token, username as usernameStorage, exp } from '../utils/storage';

const Register = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const register = async () => {
    setIsLoading(true);

    if (password !== passwordConf) {
      setError("Passwords don't match.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await request('/auth/register', 'POST', {
        email,
        username,
        password,
      });

      if (!result.status) {
        setError(`An error occured: ${result.error}.`);
        setIsLoading(false);
      } else {
        navigateToLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError('An error occured. Please try again.');
      setIsLoading(false);
    }
  };

  const openServerSettings = () => navigation.navigate('Server settings');
  const navigateToLogin = registerSuccess => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
            params: registerSuccess
              ? {
                  registerSuccess: true,
                }
              : {},
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

  const registerWithGithub = async () => {
    const res = await request('/services/github/env', 'GET');

    const { clientId, scope, state } = res;

    Linking.openURL(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&scope=${scope}`,
    );
  };

  useEffect(() => {
    const linkingBind = Linking.addEventListener('url', async data => {
      const url = new URL(data.url);

      if (url.pathname === '/github/link') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        const res = await request('/services/github/register', 'POST', {
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
      <TextInput
        style={styles.input}
        label="Email address"
        left={<TextInput.Icon name="email" color={Colors.grey700} />}
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
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
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Confirm password"
        left={<TextInput.Icon name="lock" color={Colors.grey700} />}
        value={passwordConf}
        onChangeText={setPasswordConf}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.buttonContainer}>
        {isLoading && <ActivityIndicator animating={true} size={'large'} />}
        <Button
          style={styles.button}
          icon="send"
          mode="contained"
          disabled={isLoading}
          onPress={register}>
          Sign me up
        </Button>
      </View>
      <Button icon="github" onPress={registerWithGithub}>
        Register with GitHub
      </Button>
      <Button onPress={() => navigateToLogin(false)}>
        Already have an account?
      </Button>
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
    marginHorizontal: 6,
    marginVertical: 2,
  },
});

export default Register;
