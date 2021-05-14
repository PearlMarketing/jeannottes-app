import * as fs from "fs"
import { when } from "mobx"
import { ShopStore } from "./ShopStore"

const productFetcher = () => Promise.resolve(JSON.parse(fs.readFileSync("./public/products.json")))

it("productstore fetches data", (done) => {
    const store = ShopStore.create({}, { fetch: productFetcher })
    when(
        () => store.isLoading === false,
        () => {
            expect(store.products.size).toBe(4)
            expect(store.products.get("978-1933988177").price).toBe(30.5)
            done()
        }
    )
})

it("productstore sorts data", (done) => {
    const store = ShopStore.create({}, { fetch: productFetcher })
    when(
        () => store.isLoading === false,
        () => {
            expect(store.sortedAvailableProducts.map((product) => product.name)).toEqual([
                "Lucene in Action, Second Edition",
                "Sophie's World : The Greek Philosophers",
                "The Lightning Thief",
                "The Sea of Monsters"
            ])
            done()
        }
    )
})
