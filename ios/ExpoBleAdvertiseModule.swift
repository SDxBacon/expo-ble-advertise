import CoreBluetooth
import ExpoModulesCore

struct BroadcastOptions: Record {
  @Field
  var serviceUUIDs: [String]
}

private class ExpoBleAdvertisePeripheralManager: NSObject, CBPeripheralManagerDelegate {
  var peripheralManager: CBPeripheralManager?

  override init() {
    super.init()
    peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
  }

  func startBroadcast(_ advertisementData: [String: Any]) {
    guard let peripheralManager = self.peripheralManager else {
      // TODO: handle this situation in the future
      return
    }

    if peripheralManager.isAdvertising {
      peripheralManager.stopAdvertising()
      // peripheralManager.removeAllServices()
    }

    peripheralManager.startAdvertising(advertisementData)
  }

  // Required delegate method
  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    switch peripheral.state {
    case .poweredOn:
      print("Bluetooth is powered on.")
    case .poweredOff:
      print("Bluetooth is powered off.")
    case .resetting:
      print("Bluetooth is resetting.")
    case .unauthorized:
      print("Bluetooth is unauthorized.")
    case .unsupported:
      print("Bluetooth is unsupported on this device.")
    case .unknown:
      print("Bluetooth state is unknown.")
    @unknown default:
      print("A new state was added that we are not handling yet.")
    }
  }
}

public class ExpoBleAdvertiseModule: Module {

  private var bleAdvertise: ExpoBleAdvertisePeripheralManager!

  public func definition() -> ModuleDefinition {
    Name("ExpoBleAdvertise")

    OnCreate {
      self.bleAdvertise = ExpoBleAdvertisePeripheralManager()
    }

    OnDestroy {
      var peripheralManager = self.bleAdvertise.peripheralManager
      peripheralManager?.stopAdvertising()
      peripheralManager = nil
    }

    Events("onChange")

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent(
        "onChange",
        [
          "value": value
        ])
    }

    AsyncFunction("startBroadcast") { (info: BroadcastOptions) in
      self.sendEvent(
        "onChange",
        [
          "value": info.serviceUUIDs[0]
        ]
      )
    }

    // AsyncFunction("startBroadcast") { (info: [String: Any]) in
    //   guard let uuidStrings = info["serviceUUIDs"] as? [String] else {
    //     throw NSError(
    //       domain: "BroadcastError", code: -1,
    //       userInfo: [NSLocalizedDescriptionKey: "Invalid serviceUUIDs"])
    //   }
    //   let serviceUUIDs = uuidStrings.map { CBUUID(string: $0) }

    //   let dataDict = info["data"] as? [String: Int] ?? [:]
    //   let sortedKeys = dataDict.keys.sorted { (a, b) in (Int(a) ?? 0) < (Int(b) ?? 0) }
    //   let array = sortedKeys.compactMap { dataDict[$0] }

    //   let service = CBMutableService(type: serviceUUIDs[0], primary: true)

    //   let advertisementData: [String: Any] = [
    //     CBAdvertisementDataServiceUUIDsKey: serviceUUIDs,
    //     CBAdvertisementDataManufacturerDataKey: [0x00, 0x01, 0xff, 0xfd],
    //     CBAdvertisementDataLocalNameKey: "BLE模拟器",
    //   ]

    //   self.bleAdvertise.startBroadcast(advertisementData)

    //   // return "[broadcast] serviceUUIDs: \(serviceUUIDs), data: \(Data(bytes: array))"
    //   return "[broadcast] serviceUUIDs: 99-88-11-00, data: 0"
    // }
  }

}
