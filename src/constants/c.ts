import {TWallet} from './t';

export enum Fonts {
  Digital = 'digital-7',
}
export const WalletMaps = {
  wechat: '微信',
  alipay: '支付宝',
  unionpay: '银联',
  cash: '现金',
  carpool: '顺风车',
  eastmoney: '股票',
  fund: '公积金',
};

export const calculateWalletFormSum = (form: TWallet) => {
  let s: number = Object.keys(WalletMaps).reduce((total, key) => {
    const value = form[key];
    if (Array.isArray(value)) {
      return (
        total +
        value.reduce((sum, item) => {
          return sum + parseFloat(item);
        }, 0)
      );
    } else if (!isNaN(value)) {
      return total + parseFloat(value);
    }
    return total;
  }, 0);
  return s.toFixed(2);
};
