import {createNavigationContainerRef} from '@react-navigation/native';
// import log from '@src/constants/log4j';
import {useCaches} from '@src/stores';
import {navigationRef} from '@src/screens';
import axios, {AxiosError, AxiosInstance} from 'axios';
import Config from 'react-native-config';
import {Alert} from 'react-native';
import {toast} from '@src/constants/u';

// import {toast} from 'sonner-native';

export default class BaseService {
  instance: AxiosInstance = null;

  constructor() {
    let cache = useCaches.getState();
    this.instance = axios.create({
      // baseURL: Config.SERVER,
      baseURL: __DEV__
        ? 'http://192.168.0.102:40092'
        : cache.config.SERVICE || Config.SERVICE,
      timeout: 10000,
      headers: {
        token: useCaches.getState().token || '',
      },
    });
    this.instance.interceptors.request.use(x => {
      console.log('Request: ', x.url);
      x.meta = x.meta || {};
      x.meta.timer = new Date().getTime();
      return x;
    });
    this.instance.interceptors.response.use(
      x => {
        // log.info(
        //   x.config.url,
        //   `${new Date().getTime() - x.config.meta.timer} ms`,
        //   // JSON.stringify(x.config.params),
        // );
        console.log('Response: ', x.data);
        return x;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        console.log('Error: ', error.code);
        if (error.code === AxiosError.ERR_NETWORK) {
          // 服务器没开，手机没网络 ...
          toast('无法连接服务器');
          console.log('无法连接服务器 ...');
        } else if (error.code === AxiosError.ECONNABORTED) {
          // navigationRef.navigate('NetError');
          // 服务器连接超时，用户取消 ...
          toast('服务器连接超时');
          console.log('服务器连接超时 ...');
        } else if (
          error.code === AxiosError.ERR_BAD_REQUEST ||
          error.code == AxiosError.ERR_BAD_RESPONSE
        ) {
          // Request: 状态码错误 -> 4xx
          // Response: 状态码错误 -> 5xx
          toast('服务器开小差了');
          console.log('服务器开小差了 ...');
          //
          //   toast.error('请求错误', {
          //     description: `${status}: ${JSON.stringify(error.config)}`,
          //   });
        }
        // log.error(
        //   error.config.url,
        //   `${new Date().getTime() - error.config.meta.timer} ms`,
        // );
        return Promise.reject(error);
      },
    );
  }
}
