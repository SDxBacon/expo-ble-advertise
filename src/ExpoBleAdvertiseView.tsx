import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoBleAdvertiseViewProps } from './ExpoBleAdvertise.types';

const NativeView: React.ComponentType<ExpoBleAdvertiseViewProps> =
  requireNativeView('ExpoBleAdvertise');

export default function ExpoBleAdvertiseView(props: ExpoBleAdvertiseViewProps) {
  return <NativeView {...props} />;
}
