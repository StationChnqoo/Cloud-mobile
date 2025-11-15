import BaseService from './BaseService';

export default class DfcfService extends BaseService {
  constructor() {
    super();
  }

  /**
   * 获取板块下所有的股票
   * @param code
   * @returns
   */
  async selectStocksOfSector(code: string) {
    this.instance.defaults.baseURL = 'https://push2delay.eastmoney.com';
    let result = await this.instance.get(`/api/qt/clist/get`, {
      params: {
        cb: '',
        fid: 'f62',
        po: 1,
        pz: 99,
        pn: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fs: `b:${code}`,
        fields:
          'f12,f14,f2,f3,f62,f184,f66,f69,f72,f75,f78,f81,f84,f87,f204,f205,f124,f1,f13',
      },
    });
    this.instance.defaults.headers[
      'referer'
    ] = `https://data.eastmoney.com/bkzj/${code}.html`;
    // https://push2delay.eastmoney.com/api/qt/clist/get?cb=&fid=f62&po=1&pz=50&pn=1&np=1&fltt=2&invt=2&fs=b:BK0450&fields=f12,f14,f2,f3,f62,f184,f66,f69,f72,f75,f78,f81,f84,f87,f204,f205,f124,f1,f13
    return result.data;
  }

  /**
   * 单日K线走势，只有每分钟的K线数据
   * @param code
   * @returns
   */
  async selectDailyTrends(code: string) {
    this.instance.defaults.baseURL = 'https://push2.eastmoney.com';
    this.instance.defaults.headers['referer'] =
      'https://quote.eastmoney.com/center/hszs.html';
    const result = await this.instance.get(`/api/qt/stock/trends2/get`, {
      params: {
        secid: code,
        fields1: Array.from({length: 13}, (_, i) => `f${i + 1}`).join(','),
        fields2: Array.from({length: 8}, (_, i) => `f${50 + i}`).join(','),
        iscr: 0,
        cb: '',
        isqhquote: '',
      },
    });
    return result.data;
  }

  /**
   * 指数的实时净值
   * @param code
   */
  async selectRealtimePrice(code: string) {
    this.instance.defaults.baseURL = 'https://push2.eastmoney.com';
    this.instance.defaults.headers[
      'referer'
    ] = `https://so.eastmoney.com/web/s?keyword=${code}`;
    // 接口太狗了 还玩儿上Cookie了 ...
    this.instance.defaults.headers[
      'Cookie'
    ] = `qgqp_b_id=; st_nvi=; st_si=; st_pvi=; st_sp=; st_inirUrl=; st_asi=delete; st_sn=2; st_psi=; nid=${Math.random()}; nid_create_time=; gvi=; gvi_create_time=`;
    let result = await this.instance.get(`/api/qt/stock/get`, {
      params: {
        cb: '',
        fields:
          'f57,f58,f59,f152,f43,f169,f170,f60,f44,f45,f168,f50,f47,f48,f49,f46,f78,f85,f86,f169,f117,f107,f111,f116,f117,f118,f163,f171,f113,f114,f115,f161,f162,f164,f168,f172,f177,f180,f181,f292,f751,f752',
        secid: code,
        invt: 2,
      },
    });
    return result.data;
  }

  /**
   * 首页三大指数涨跌家数
   * @returns
   */
  async selectDfcfFundCounts() {
    this.instance.defaults.baseURL = 'https://push2.eastmoney.com';
    this.instance.defaults.headers['referer'] =
      'https://data.eastmoney.com/zjlx/dpzjlx.html';
    let result = await this.instance.get('/api/qt/ulist.np/get', {
      params: {
        cb: '',
        fltt: 2,
        secids: '1.000001,0.399001',
        fields: 'f1,f2,f3,f4,f6,f12,f13,f104,f105,f106',
      },
    });
    return result.data;
  }

  async selectQuickNews() {
    this.instance.defaults.baseURL = 'https://np-weblist.eastmoney.com';
    this.instance.defaults.headers['referer'] =
      'https://www.eastmoney.com/default.html';
    let result = await this.instance.get('/comm/web/getFastNews', {
      params: {
        client: 'web',
        biz: 'web_home724',
        req_trace: '',
        callback: '',
      },
    });
    return result.data;
  }

  async selectSearcher(s: string) {
    // /codetable/search/web?client=web&clientType=webSuggest&clientVersion=lastest&cb=&keyword=512&pageIndex=1&pageSize=20&securityFilter=
    this.instance.defaults.baseURL = 'https://search-codetable.eastmoney.com';
    this.instance.defaults.headers[
      'referer'
    ] = `https://www.eastmoney.com/default.html`;
    let result = await this.instance.get(`/codetable/search/web`, {
      params: {
        client: 'web',
        clientType: 'webSuggest',
        clientVersion: 'lastest',
        cb: '',
        keyword: s,
        pageIndex: 1,
        pageSize: 20,
        securityFilter: '',
      },
    });
    return result.data;
  }

  /**
   * 外围股市涨跌
   * @param indexes
   * @returns
   */
  async selectOtherCountryStocks(indexes: string[]) {
    this.instance.defaults.baseURL = 'https://push2.eastmoney.com';
    this.instance.defaults.headers['referer'] = `https://www.eastmoney.com/`;
    this.instance.defaults.headers['Content-Type'] =
      'application/x-www-form-urlencoded';
    let result = await this.instance.get(`/api/qt/ulist/get`, {
      params: {
        fields: 'f13,f12,f14,f1,f2,f4,f3,f152',
        secids: indexes.join(','),
        pn: 1,
        np: 1,
        pz: 100,
      },
    });
    // console.log('selectOtherCountryStocks: ', result.data)
    return result.data;
  }

  async selectFundRanks() {
    this.instance.defaults.baseURL = 'https://push2.eastmoney.com';
    this.instance.defaults.headers[
      'referer'
    ] = `https://data.eastmoney.com/bkzj/hy_5.html`;
    let result = await this.instance.get(`/api/qt/clist/get`, {
      params: {
        cb: '',
        fid: 'f62',
        po: 1,
        pz: 99,
        pn: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fs: 'm:90 t:2',
        fields:
          'f12,f14,f2,f3,f62,f184,f66,f69,f72,f75,f78,f81,f84,f87,f204,f205,f124,f1,f13',
      },
    });
    return result.data;
  }
}
