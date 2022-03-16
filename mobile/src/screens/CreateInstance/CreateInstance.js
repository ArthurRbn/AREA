import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import request from '../../api/request';
import ChooseItem from './ChooseItem';
import Params from './Params';

const CreateInstance = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [actions, setActions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionParams, setActionsParams] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);

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

  const chooseAction = (action, widget) => {
    setCurrentStep(currentStep + 1);
    setSelectedAction({ action, widget });
  };

  const chooseActionParams = params => {
    setCurrentStep(currentStep + 1);
    setActionsParams(params);
  };

  const chooseReaction = async (reaction, widget) => {
    setCurrentStep(currentStep + 1);
    setSelectedReaction({ reaction, widget });
  };

  const chooseReactionParams = params => {
    setCurrentStep(currentStep + 1);
    create(params);
  };

  const create = async reactionParams => {
    const normalizedActionParams = actionParams.map(x => ({
      name: x.name,
      type: x.chosenType || x.type,
      value: x.value,
    }));

    const normalizedRectionParams = reactionParams.map(x => ({
      name: x.name,
      type: x.chosenType || x.type,
      value: x.value,
    }));

    const body = {
      action: {
        name: selectedAction.widget.name,
        serviceName: selectedAction.action.name,
        displayName: selectedAction.widget.displayName,
        webhookId: '1234',
        params: normalizedActionParams,
      },
      reaction: {
        name: selectedReaction.widget.name,
        serviceName: selectedReaction.reaction.name,
        displayName: selectedReaction.widget.displayName,
        params: normalizedRectionParams,
      },
    };

    await request('/instances', 'POST', body);

    navigateToHome();
  };

  useEffect(() => {
    (async () => {
      const profile = await request('/profile');

      const allActions = await request('/actions');
      const availableActions = allActions.filter(service => {
        const serviceLinkedKey = `${service.name}Linked`;

        if (serviceLinkedKey in profile) {
          if (profile[serviceLinkedKey] !== true) {
            return false;
          }
          return true;
        }
        return true;
      });
      setActions(availableActions);

      const allReactions = await request('/reactions');
      const availableReactions = allReactions.filter(service => {
        const serviceLinkedKey = `${service.name}Linked`;

        if (serviceLinkedKey in profile) {
          if (profile[serviceLinkedKey] !== true) {
            return false;
          }
          return true;
        }
        return true;
      });
      setReactions(availableReactions);
    })();
  }, []);

  switch (currentStep) {
    case 0:
      return <ChooseItem items={actions} choose={chooseAction} />;
    case 1:
      return (
        <Params
          params={selectedAction.widget.params}
          confirm={chooseActionParams}
        />
      );
    case 2:
      return <ChooseItem items={reactions} choose={chooseReaction} />;
    case 3:
      return (
        <Params
          params={selectedReaction.widget.params}
          confirm={chooseReactionParams}
        />
      );
    default:
      return null;
  }
};

export default CreateInstance;
