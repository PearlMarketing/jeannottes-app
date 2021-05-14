import * as fs from "fs"
import { ShopStore } from "./ShopStore"

const testEnvironment = {
    fetch: () => Promise.resolve(JSON.parse(fs.readFileSync("./public/products.json"))),
    alert: (m) => console.log(m)
}

const testProduct = {
    id: "1",
    price: 3,
    author: "test",
    name: "test",
    sequence_i: 0,
    genre_s: "action",
    pages_i: 100
}

it("cart store can add new entries", () => {
    const shop = ShopStore.create({}, testEnvironment)

    shop.productStore.updateProducts([testProduct])

    expect(shop.cart.total).toBe(0)
    shop.cart.addProduct(shop.products.get(1))
    expect(shop.cart.total).toBe(3)
    shop.cart.addProduct(shop.products.get(1))

    expect(shop.cart.total).toBe(6)
    expect(shop.cart.subTotal).toBe(6)

    shop.cart.addProduct(shop.products.get(1), 98)
    expect(shop.cart.subTotal).toBe(300)
    expect(shop.cart.total).toBe(270)
})

it("cart store can clear entries", () => {
    const shop = ShopStore.create({}, testEnvironment)
    shop.productStore.updateProducts([testProduct])

    shop.cart.addProduct(shop.products.get(1))

    expect(shop.cart.total).toBe(3)
    expect(shop.cart.canCheckout).toBe(true)

    shop.cart.clear()
    expect(shop.cart.total).toBe(0)
    expect(shop.cart.canCheckout).toBe(false)
})

it("cart store can clear entries", () => {
    const shop = ShopStore.create({}, testEnvironment)
    shop.productStore.updateProducts([testProduct])

    shop.cart.addProduct(shop.products.get(1))

    expect(shop.cart.total).toBe(3)
    expect(shop.cart.canCheckout).toBe(true)

    shop.productStore.updateProducts([])
    expect(shop.cart.total).toBe(3)
    expect(shop.cart.canCheckout).toBe(false)
    expect(shop.products.get(1).isAvailable).toBe(false)
    expect(shop.products.size).toBe(1)
    expect(shop.sortedAvailableProducts.length).toBe(0)
})
