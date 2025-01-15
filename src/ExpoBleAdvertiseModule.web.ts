import { registerWebModule, NativeModule } from 'expo';

import { ExpoBleAdvertiseModuleEvents } from './ExpoBleAdvertise.types';

class ExpoBleAdvertiseModule extends NativeModule<ExpoBleAdvertiseModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoBleAdvertiseModule);
