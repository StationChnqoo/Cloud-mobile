import {PaginationProps, TWallet} from '@src/constants/t';
import BaseService from './BaseService';

export default class Services extends BaseService {
  constructor() {
    super();
  }

  async login(params: {mobile: string; password: string}) {
    let result = await this.instance.get('/public/login.do', {
      params,
    });
    return result.data;
  }

  async selectUser() {
    let result = await this.instance.get('/user/selectUser.do', {});
    return result.data;
  }

  async deleteWallet(params: {id: string}) {
    let result = await this.instance.get('/wallet/deleteWallet.do', {params});
    return result.data;
  }

  async selectWallet(params: {id: string}) {
    let result = await this.instance.get('/wallet/selectWallet.do', {params});
    return result.data;
  }

  async selectWallets(params: PaginationProps) {
    let result = await this.instance.get('/wallet/selectWallets.do', {params});
    return result.data;
  }

  async mergeWallet(params: TWallet) {
    let result = await this.instance.post('/wallet/mergeWallet.do', params);
    return result.data;
  }
}
