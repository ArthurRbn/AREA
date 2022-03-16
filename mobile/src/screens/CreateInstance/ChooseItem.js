import React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

const ChooseItem = ({ items, choose }) => {
  return (
    <ScrollView>
      <List.Section>
        {items.map(item => {
          return (
            <List.Accordion title={item.displayName} key={item.name}>
              {item.widgets.map(widget => {
                return (
                  <List.Item
                    key={widget.name}
                    title={widget.displayName}
                    description={widget.description}
                    onPress={() => choose(item, widget)}
                  />
                );
              })}
            </List.Accordion>
          );
        })}
      </List.Section>
    </ScrollView>
  );
};

export default ChooseItem;
