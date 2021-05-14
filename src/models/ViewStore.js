import { types, getParent } from "mobx-state-tree"

export const ViewStore = types
    .model({
        page: "products",
        selectedProductId: ""
    })
    .views((self) => ({
        get shop() {
            return getParent(self)
        },
        get isLoading() {
            return self.shop.isLoading
        },
        get currentUrl() {
            switch (self.page) {
                case "products":
                    return "/"
                case "product":
                    return "/product/" + self.selectedProductId
                case "cart":
                    return "/cart"
                default:
                    return "/404"
            }
        },
        get selectedProduct() {
            return self.isLoading || !self.selectedProductId
                ? null
                : self.shop.products.get(self.selectedProductId)
        }
    }))
    .actions((self) => ({
        openProductsPage() {
            self.page = "products"
            self.selectedProductId = ""
        },
        openProductPage(product) {
            self.page = "product"
            self.selectedProductId = product.id
        },
        openProductPageById(id) {
            self.page = "product"
            self.selectedProductId = id
        },
        openCartPage() {
            self.page = "cart"
            self.selectedProductId = ""
        }
    }))
