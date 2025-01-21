import { useEvent } from "expo";
import ExpoBleAdvertise from "expo-ble-advertise";
import { useRef, useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  View,
  Text,
  Platform,
  PermissionsAndroid,
} from "react-native";
import uuid from "react-native-uuid";
import { BleManager, Device } from "react-native-ble-plx";
import { parse as parseToByteArray } from "uuid";

import ScannedDeviceList from "./components/ScannedDeviceList";

const SERVICE_UUID = "5566c487-6544-472e-88a4-8b90afd12e1c";

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

  const manager = useRef(new BleManager()).current;

  const [data, setData] = useState(new Map<string, Device>());
  const [isPoweredOn, setIsPoweredOn] = useState(false);

  function scanAndConnect() {
    manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      if (device) {
        setData((prev) => {
          const newData = new Map(prev);
          newData.set(device.id, device);
          return newData;
        });
        console.log("Device found:", device);
      }
    });
  }

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        setIsPoweredOn(true);
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        {/**
         * Start Broadcasting button section
         */}
        <Group name="Start Broadcast">
          <Button
            title="Broadcast"
            onPress={async () => {
              requestLocationPermission();
              const uuids = [uuid.v4()] as string[];
              await ExpoBleAdvertise.startBroadcast({
                serviceUUIDs: [SERVICE_UUID],
                data: undefined,
              });
            }}
          />
        </Group>
        {/**
         * Broadcasting Events section
         */}
        <Group name="Broadcasting Events">
          <Text>{onChangePayload?.value}</Text>
        </Group>

        {/**
         * Start Scanning section
         * TODO:
         */}
        <Group name="Start Scanning">
          <Button
            title="SCAN"
            onPress={async () => {
              if (!isPoweredOn) return;

              scanAndConnect();
            }}
          />
        </Group>
        {/**
         * Scanning Result section
         * TODO:
         */}
        <Group name="Scanning Result">
          <ScannedDeviceList data={Array.from(data.values())} />
        </Group>
      </View>
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
