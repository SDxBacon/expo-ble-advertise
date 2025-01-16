import { NativeModule, requireNativeModule } from "expo";

import { ExpoBleAdvertiseModuleEvents } from "./ExpoBleAdvertise.types";

declare class ExpoBleAdvertiseModule extends NativeModule<ExpoBleAdvertiseModuleEvents> {
  setValueAsync(value: string): Promise<void>;

  /**
   * Starts broadcasting BLE advertisements with the specified service UUIDs and data.
   * @param info - The broadcast configuration object
   * @param info.serviceUUIDs - Array of UUIDs for the services to advertise
   * @param info.data - Optional byte array containing the advertisement data
   * @returns A Promise that resolves to a string indicating the broadcast status or identifier
   */
  startBroadcast(info: {
    serviceUUIDs: string[];
    data: Uint8Array | undefined;
  }): Promise<string>;

  /**
   * Stops broadcasting BLE advertisements.
   */
  stopBroadcast(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoBleAdvertiseModule>("ExpoBleAdvertise");
