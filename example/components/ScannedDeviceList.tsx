import React from "react";
import { View, Text, FlatList } from "react-native";
import { Device } from "react-native-ble-plx";

interface ScannedDeviceListProps {
  data: Device[];
}

const ScannedDeviceList = (props: ScannedDeviceListProps) => {
  const { data } = props;
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View key={item.id}>
          <Text>id: {item.id}</Text>
          <Text>manufacturerData: {item.manufacturerData}</Text>
        </View>
      )}
    />
  );
};

export default ScannedDeviceList;
