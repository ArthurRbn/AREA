import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { exp, token, username } from '../utils/storage';

const shouldShowMenu = route => {
  switch (route.name) {
    case 'Home':
      return true;
    default:
      return false;
  }
};

const CustomNavigationBar = ({ navigation, back, route }) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const showProfile = () => {
    navigation.navigate('Profile');
    closeMenu();
  };

  const logOut = async () => {
    await token.set('');
    await username.set('');
    await exp.set('');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      }),
    );
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name.toUpperCase()} />
      {shouldShowMenu(route) ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }>
          <Menu.Item onPress={showProfile} title="Profile" />
          <Menu.Item onPress={logOut} title="Log out" />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
};

export default CustomNavigationBar;
