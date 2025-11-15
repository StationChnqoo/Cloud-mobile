import Config from 'react-native-config';

export class Envs {
  config: any = {};
  constructor() {
    this.config = (Config as any)?.getConstants();
  }

  get(
    string: 'APP_NAME' | 'APP_PACKAGE_NAME' | 'APP_MY_SERVICE' | 'APP_PICGO',
  ) {
    return this.config?.[string] || '';
  }
  all() {
    return this.config;
  }
}
