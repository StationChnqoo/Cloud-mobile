import BaseService from './BaseService';

export default class YahooService extends BaseService {
  constructor() {
    super();
  }
  // https://query1.finance.yahoo.com?&=&fields=&crumb=&formatted=false&region=US&lang=en-US
  async selectVnFunds(cookie: string, fundCodes: string) {
    this.instance.defaults.baseURL = 'https://query1.finance.yahoo.com';
    let result = await this.instance.get(`/v7/finance/quote`, {
      params: {
        symbols: fundCodes,
        fields: '',
        crumb: 'VPmHr38ItUO',
      },
      headers: {
        Cookie: cookie,
      },
    });
    return result.data;
  }
}
