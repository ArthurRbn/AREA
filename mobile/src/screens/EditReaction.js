import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import request from '../api/request';
import Params from './CreateInstance/Params';

const EditReaction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { instance } = route.params;
  const [params, setParams] = useState(null);

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
      const reactions = await request('/reactions');

      const defaultReaction = reactions
        .find(x => x.name === instance.reaction.serviceName)
        .widgets.find(x => x.name === instance.reaction.name);

      const defaultParams = defaultReaction.params;
      const newParams = defaultParams.map(x => {
        const oldParam = instance.reaction.params.find(y => y.name === x.name);

        if (x.type === 'get' || x.type === 'dropdown') {
          return {
            ...x,
            chosenType: oldParam.type,
            value:
              oldParam.type !== 'number'
                ? oldParam.value
                : parseInt(oldParam.value, 10),
          };
        }

        return oldParam;
      });
      setParams(newParams);
    })();
  }, [instance]);

  const update = async p => {
    const normalizedP = p.map(x => ({
      name: x.name,
      type: x.chosenType || x.type,
      value: x.value,
    }));

    await request(`/instances/${instance._id}`, 'POST', {
      reaction: normalizedP,
    });
    await navigateToHome();
  };

  if (!params) {
    return null;
  }
  return <Params params={params} confirm={update} />;
};

export default EditReaction;
