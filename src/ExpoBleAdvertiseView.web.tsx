import * as React from 'react';

import { ExpoBleAdvertiseViewProps } from './ExpoBleAdvertise.types';

export default function ExpoBleAdvertiseView(props: ExpoBleAdvertiseViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
