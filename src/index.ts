// Reexport the native module. On web, it will be resolved to ExpoBleAdvertiseModule.web.ts
// and on native platforms to ExpoBleAdvertiseModule.ts
export { default } from './ExpoBleAdvertiseModule';
export { default as ExpoBleAdvertiseView } from './ExpoBleAdvertiseView';
export * from  './ExpoBleAdvertise.types';
