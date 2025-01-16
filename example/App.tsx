import { useEvent } from "expo";
import ExpoBleAdvertise from "expo-ble-advertise";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import uuid from "react-native-uuid";
import { parse as parseToByteArray } from "uuid";
// import * as DevClient from "expo-dev-client";

function getRandomUUIDBuffer() {
  return parseToByteArray(uuid.v4());
}

export default function App() {
  const onChangePayload = useEvent(ExpoBleAdvertise, "onChange");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Async functions">
          <Button
            title="Set value"
            onPress={async () => {
              await ExpoBleAdvertise.setValueAsync("Hello from JS!");
            }}
          />
        </Group>
        <Group name="Async functions">
          <Button
            title="Broadcast"
            onPress={async () => {
              console.log(getRandomUUIDBuffer());
              const value = await ExpoBleAdvertise.broadcast({
                serviceUUIDs: [uuid.v4()],
                data: getRandomUUIDBuffer(),
              });

              console.log("🚀 - onPress={ - value:", value);
              await ExpoBleAdvertise.setValueAsync(value);
            }}
          />
        </Group>
        <Group name="Events">
          <Text>{onChangePayload?.value}</Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
