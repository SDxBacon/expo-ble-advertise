import { useEvent } from "expo";
import ExpoBleAdvertise from "expo-ble-advertise";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Platform,
  PermissionsAndroid,
} from "react-native";
import uuid from "react-native-uuid";
import { parse as parseToByteArray } from "uuid";

function getRandomUUIDBuffer() {
  return parseToByteArray(uuid.v4()) as Uint8Array;
}

function requestLocationPermission() {
  if (Platform.OS === "android") {
    var permissionsRequiredToBeAccepted = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];

    if (Platform.Version >= 31) {
      permissionsRequiredToBeAccepted.push(
        ...[
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]
      );
    }

    PermissionsAndroid.requestMultiple(permissionsRequiredToBeAccepted).then(
      (permissionRequestResult) => {}
    );
  }
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
        <Group name="Start Broadcast">
          <Button
            title="Broadcast"
            onPress={async () => {
              requestLocationPermission();

              const uuids = [uuid.v4()] as string[];

              console.log("🚀 - uuids:", uuids);
              await ExpoBleAdvertise.startBroadcast({
                serviceUUIDs: uuids,
                data: undefined,
              });
              console.log("[End] - startBroadcast");
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
