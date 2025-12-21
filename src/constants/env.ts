import Config from 'react-native-config';

export class Envs {
  config: any = {};
  constructor() {
    this.config = (Config as any)?.getConstants();
  }

  get(
    string:
      | 'APP_NAME'
      | 'APP_PACKAGE_NAME'
      | 'APP_JAVA'
      | 'APP_PICGO'
      | 'APP_ENV',
  ) {
    return this.config?.[string] || '';
  }
  all() {
    return this.config;
  }
}
