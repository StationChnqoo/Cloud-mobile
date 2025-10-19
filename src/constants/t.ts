export interface TWallet {
  id: string;
  userId: string;
  unionpay: string;
  wechat: string;
  alipay: string;
  eastmoney: string;
  cash: string;
  fund: string[];
  carpool: string[];
  settleOn: string;
  createAt: string;
  updateAt: string;
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
}
