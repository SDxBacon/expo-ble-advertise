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

    AsyncFunction("startBroadcast") { (info: BroadcastOptions) in
      let serviceUUIDs = info.serviceUUIDs.map { CBUUID(string: $0) }

      let advertisementData: [String: Any] = [
        CBAdvertisementDataServiceUUIDsKey: serviceUUIDs,
        CBAdvertisementDataManufacturerDataKey: [0x00, 0x01, 0xff, 0xfd],
      ]

      self.bleAdvertise.startBroadcast(advertisementData)

      // TODO: the way to return result to JS will be refactor in the future
      self.sendEvent(
        "onChange",
        [
          "value": "Advertising started, service UUID: \(serviceUUIDs[0])"
        ]
      )

      return "[broadcast] serviceUUIDs: \(serviceUUIDs)"
    }
  }

}
