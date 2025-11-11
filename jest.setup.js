// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      RNCNetInfo: {
        getCurrentState: jest.fn(() => Promise.resolve({
          type: 'wifi',
          isConnected: true,
          isInternetReachable: true,
        })),
      },
    },
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    useSharedValue: jest.fn(),
    useAnimatedStyle: jest.fn(style => style),
    withTiming: jest.fn((toValue) => toValue),
  },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  manifest: {},
  sessionId: 'test-session-id',
  systemFonts: [],
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve(true)),
  useFonts: () => [true, null],
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'View',
  Swipeable: 'View',
  ScrollView: 'View',
  NativeViewGestureHandler: 'View',
  TapGestureHandler: 'View',
  PanGestureHandler: 'View',
  gestureHandlerRootHOC: (component) => component,
}));