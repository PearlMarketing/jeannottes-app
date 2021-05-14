import * as fs from "fs"
import { when } from "mobx"
import { ShopStore } from "./ShopStore"

const productFetcher = () => Promise.resolve(JSON.parse(fs.readFileSync("./public/products.json")))

it("as a user I can buy products", (done) => {
    const alertSpy = jasmine.createSpy("alert")
    const shop = ShopStore.create({}, { fetch: productFetcher, alert: alertSpy })

    shop.view.openProductsPage()
    expect(shop.view.page).toBe("products")
    expect(shop.view.currentUrl).toBe("/")
    expect(shop.isLoading).toBe(true)

    when(
        () => !shop.isLoading,
        () => {
            expect(shop.products.size).toBe(4)

            shop.view.openProductPageById("978-1423103349")
            expect(shop.view.page).toBe("product")
            expect(shop.view.currentUrl).toBe("/product/978-1423103349")
            expect(shop.view.selectedProduct.name).toBe("The Sea of Monsters")
            expect(alertSpy.calls.count()).toBe(0)

            shop.cart.addProduct(shop.view.selectedProduct)
            expect(alertSpy.calls.count()).toBe(1)

            shop.view.openCartPage()
            expect(shop.view.page).toBe("cart")
            expect(shop.view.currentUrl).toBe("/cart")
            expect(shop.cart.canCheckout).toBe(true)

            shop.cart.checkout()
            expect(alertSpy.calls.count()).toBe(2)
            expect(shop.cart.entries.length).toBe(0)
            expect(shop.cart.canCheckout).toBe(false)
            done()
        }
    )
})
