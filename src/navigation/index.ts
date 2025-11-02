// navigation/RootNavigation.ts
import {createNavigationContainerRef} from '@react-navigation/native';
import {navigationRef, type RootStacksParams} from '@src/screens';

export class Router {
  static navigate<T extends keyof RootStacksParams>(
    name: T,
    params?: RootStacksParams[T],
  ) {
    if (navigationRef.isReady()) {
      // @ts-ignore
      navigationRef.navigate(name, params);
    }
  }
}
