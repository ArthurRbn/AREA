import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { serverUrl as serverUrlStorage } from '../utils/storage';

const ServerSettingsModal = () => {
  const [hasChanges, setHasChanges] = useState(false);
  const [serverUrl, setServerUrl] = useState();

  const updateSettings = async () => {
    await serverUrlStorage.set(serverUrl);
    setHasChanges(false);
  };

  useEffect(() => {
    (async () => {
      setServerUrl(await serverUrlStorage.get());
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        label="Server address"
        value={serverUrl}
        onChangeText={val => {
          setServerUrl(val);
          setHasChanges(true);
        }}
      />
      <Button disabled={!hasChanges} onPress={updateSettings}>
        Confirm changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 16,
  },
});

export default ServerSettingsModal;
