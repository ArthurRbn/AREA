import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Subheading, TextInput } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import request from '../../api/request';

const BooleanParam = ({ param, setValue }) => {
  const [rand, setRand] = useState(0);
  return (
    <View style={booleanStyles.view}>
      <Subheading>{param.name}</Subheading>
      <Checkbox
        status={param.value === 'true' ? 'checked' : 'unchecked'}
        onPress={() => {
          setValue(param.name, param.value !== 'true' ? 'true' : 'false');
          setRand(Math.random());
        }}
      />
    </View>
  );
};

const booleanStyles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
  },
});

const StringParam = ({ param, setValue }) => {
  return (
    <TextInput
      defaultValue={param.value}
      label={param.name}
      onChangeText={text => {
        setValue(param.name, text);
      }}
    />
  );
};

const NumParam = ({ param, setValue }) => {
  return (
    <TextInput
      label={param.name}
      defaultValue={param.value.toString()}
      type={'number'}
      keyboardType={'numeric'}
      onChangeText={text => {
        setValue(param.name, parseInt(text, 10));
      }}
    />
  );
};

const GetParam = ({ param, setValue }) => {
  const [shown, setShown] = useState(false);
  const [values, setValues] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await request(param.route);
      setValues(
        res.map(r => ({
          label: r.name,
          value: JSON.stringify(r),
        })),
      );
    })();
  }, [param.route]);

  const chosenParam = values.find(
    x => JSON.parse(x.value).value === param.value,
  );

  return (
    <DropDown
      label={param.name}
      mode="outlined"
      visible={shown}
      showDropDown={() => setShown(true)}
      onDismiss={() => setShown(false)}
      list={values}
      setValue={v => {
        setValue(param.name, JSON.parse(v).value, JSON.parse(v).type);
      }}
      value={chosenParam ? chosenParam.value : undefined}
    />
  );
};

const DropdownParam = ({ param, setValue }) => {
  const [shown, setShown] = useState(false);
  const values = param.options.map(r => ({
    label: r.name,
    value: JSON.stringify(r),
  }));
  const chosenParam = values.find(
    x => JSON.parse(x.value).value === param.value,
  );

  return (
    <DropDown
      label={param.name}
      mode="outlined"
      visible={shown}
      showDropDown={() => setShown(true)}
      onDismiss={() => setShown(false)}
      list={values}
      setValue={v => {
        setValue(param.name, JSON.parse(v).value, JSON.parse(v).type);
      }}
      value={chosenParam ? chosenParam.value : undefined}
    />
  );
};

const TimeParam = ({ param, setValue }) => {
  const [shown, setShown] = useState(false);
  const input = param.value;
  const parts = input.split(':');
  const minutes = parts[0] * 60 + parts[1];
  const inputDate = new Date(minutes * 60 * 1000);

  if (shown) {
    return (
      <RNDateTimePicker
        value={inputDate}
        mode="time"
        display="clock"
        onChange={(_, date) => {
          const m = date.getMinutes();
          setValue(param.name, `${date.getHours()}:${m}${m < 10 ? '0' : ''}`);
          setShown(false);
        }}
      />
    );
  }
  return (
    <Button mode="contained" onPress={() => setShown(true)}>
      Set {param.name}: {param.value}
    </Button>
  );
};

const Param = ({ param, setValue }) => {
  switch (param.type) {
    case 'boolean':
      return <BooleanParam param={param} setValue={setValue} />;
    case 'string':
      return <StringParam param={param} setValue={setValue} />;
    case 'number':
      return <NumParam param={param} setValue={setValue} />;
    case 'get':
      return <GetParam param={param} setValue={setValue} />;
    case 'dropdown':
      return <DropdownParam param={param} setValue={setValue} />;
    case 'time':
      return <TimeParam param={param} setValue={setValue} />;
    default:
      return null;
  }
};

const getDefaultValue = param => {
  if (param.value !== undefined) {
    return param.value;
  }

  switch (param.type) {
    case 'boolean':
      return 'false';
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'get':
      return '';
    case 'dropdown':
      return '';
    case 'time':
      return '00:00';
    default:
      return undefined;
  }
};

const Params = ({ params, confirm }) => {
  const setValue = (name, value, type) => {
    const index = input.findIndex(x => x.name === name);
    input[index].value = value;
    if (type != null) {
      input[index].chosenType = type;
    }
    setInput(input);
  };

  const defaultParams = params.map(p => {
    const defaultValue = getDefaultValue(p);
    return { ...p, value: defaultValue };
  });

  const [input, setInput] = useState(defaultParams);
  return (
    <View style={styles.view}>
      {input.map(i => {
        return (
          <View key={i.name} style={styles.item}>
            <Param param={i} setValue={setValue} />
          </View>
        );
      })}
      <Button style="contained" onPress={() => confirm(input)}>
        Confirm
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 4,
  },
  item: {
    marginVertical: 2,
  },
});

export default Params;
