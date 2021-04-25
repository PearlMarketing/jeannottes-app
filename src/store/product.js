import { makeObservable, observable, computed, action, toJS } from "mobx"
import Service from '../services/services'

class ProductModule {
    @observable products = []
    @observable productVariations = []
    @observable initiateLoad = false
    @observable isLoadingProducts

    constructor() {
        makeObservable(this)
    }

    @computed
    get productsList() {
        return this.products
    }

    @computed
    get productsLoading() {
        return this.isLoadingProducts
    }

    @action
    loadProducts = async (params) => {
        this.initiateLoad = true
        this.isLoadingProducts = true
        await Service.Products(`${params}&per_page=50`)
                .then(res => {this.products = res.data.filter(item => item.status === 'publish')})
                .finally(() => {this.isLoadingProducts = false})
    }
}

export default new ProductModule