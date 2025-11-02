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

  async selectCategories(params: PaginationProps) {
    let result = await this.instance.get('/category/selectCategories.do', {params});
    return result.data;
  }

  async selectPosts(params: PaginationProps, categoryId: string) {
    let result = await this.instance.get('/post/selectPosts.do', {
      params: {
        ...params,
        categoryId,
      },
    });
    return result.data;
  }

  async mergeCategory(c: Category) {
    let result = await this.instance.post(`/category/mergeCategory.do`, c);
    return result.data;
  }

  async deleteCategory(id: String) {
    let result = await this.instance.get(`/category/deleteCategory.do`, {params: {id}});
    return result.data;
  }

  async deleteProperty(id: String) {
    let result = await this.instance.get(`/category/deleteProperty.do`, {params: {id}});
    return result.data;
  }

  async deletePassword(id: String) {
    let result = await this.instance.get(`/deletePassword.do`, {params: {id}});
    return result.data;
  }

  async mergeProperty(property: Property) {
    let result = await this.instance.post(`/category/mergeProperty.do`, property);
    return result.data;
  }

  async deletePost(id: String) {
    let result = await this.instance.get(`/post/deletePost.do`, {params: {id}});
    return result.data;
  }

  async mergePost(post: Post) {
    let result = await this.instance.post(`/post/mergePost.do`, post);
    return result.data;
  }

  async selectPost(id: String) {
    let result = await this.instance.get(`/post/selectPost.do`, {params: {id}});
    return result.data;
  }

  async selectCategory(id: String) {
    let result = await this.instance.get(`/category/selectCategory.do`, {params: {id}});
    return result.data;
  }
}
