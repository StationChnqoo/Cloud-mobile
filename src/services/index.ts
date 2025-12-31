import {
  Category,
  PaginationProps,
  Post,
  Property,
  TWallet,
} from '@src/constants/t';
import BaseService from './BaseService';

export default class Services extends BaseService {
  constructor() {
    super();
  }

  async login(params: {mobile: string; password: string}) {
    let result = await this.instance.get('/public/login', {
      params,
    });
    return result.data;
  }

  async selectUser() {
    let result = await this.instance.get('/users', {});
    return result.data;
  }

  async deleteWallet(params: {id: string}) {
    let result = await this.instance.delete(`/wallets/${params.id}`);
    return result.data;
  }

  async selectWallet(params: {id: string}) {
    let result = await this.instance.get(`/wallets/${params.id}`);
    return result.data;
  }

  async selectFirstAndLastWallet() {
    let result = await this.instance.get('/wallets/first-and-last', {});
    return result.data;
  }

  async selectWallets(params: PaginationProps) {
    let result = await this.instance.get('/wallets', {params});
    return result.data;
  }

  async mergeWallet(params: TWallet) {
    let result = await this.instance.post('/wallets', params);
    return result.data;
  }

  async selectCategories(params: PaginationProps) {
    let result = await this.instance.get('/categories', {
      params,
    });
    return result.data;
  }

  async selectPosts(params: PaginationProps, categoryId: string) {
    let result = await this.instance.get('/posts', {
      params: {
        ...params,
        categoryId,
      },
    });
    return result.data;
  }

  async mergeCategory(c: Category) {
    let result = await this.instance.post(`/categories`, c);
    return result.data;
  }

  async deleteCategory(id: String) {
    let result = await this.instance.delete(`/categories/${id}`);
    return result.data;
  }

  async deleteProperty(id: String) {
    let result = await this.instance.delete(`/categories/${id}`);
    return result.data;
  }

  async mergeProperty(property: Property) {
    let result = await this.instance.post(`/categories`, property);
    return result.data;
  }

  async deletePost(id: String) {
    let result = await this.instance.delete(`/posts/${id}`);
    return result.data;
  }

  async mergePost(post: Post) {
    let result = await this.instance.post(`/posts`, post);
    return result.data;
  }

  async selectPost(id: String) {
    let result = await this.instance.get(`/posts/${id}`);
    return result.data;
  }

  async selectCategory(id: String) {
    let result = await this.instance.get(`/categories/${id}`);
    return result.data;
  }
}
