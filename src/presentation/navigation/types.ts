import { RootStackParamList as AppRootStackParamList } from '../../utils/const';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppRootStackParamList {}
  }
}

export type RootStackParamList = AppRootStackParamList;