import { NativeModule, requireNativeModule } from 'expo';

import { ExpoBleAdvertiseModuleEvents } from './ExpoBleAdvertise.types';

declare class ExpoBleAdvertiseModule extends NativeModule<ExpoBleAdvertiseModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoBleAdvertiseModule>('ExpoBleAdvertise');
