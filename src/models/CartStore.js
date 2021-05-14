import { when, reaction } from "mobx"
import { types, getParent, getSnapshot, applySnapshot, destroy } from "mobx-state-tree"
import { Product } from "./ProductStore"

const CartEntry = types
    .model("CartEntry", {
        // quantity: 0,
        id: types.identifierNumber,
        product: types.reference(Product),
        selectedOptions: types.array(types.model({
          option: types.string,
          value: types.string,
          // price: types.optional(types.number),
        }))
    })
    .views((self) => ({
        get price() {
            return self.product.price
        },
        get isValidProduct() {
            return self.product.isAvailable
        }
    }))
    .actions((self) => ({
        // increaseQuantity(number) {
        //     self.quantity += number
        // },
        // setQuantity(number) {
        //     self.quantity = number
        // },
        remove() {
            getParent(self, 2).remove(self)
        }
    }))

export const CartStore = types
    .model("CartStore", {
        entries: types.array(CartEntry)
    })
    .views((self) => ({
        get shop() {
            return getParent(self)
        },
        get subTotal() {
            return self.entries.reduce((sum, e) => sum + e.price, 0)
        },
        get hasDiscount() {
            return self.subTotal >= 100
        },
        get discount() {
            return self.subTotal * (self.hasDiscount ? 0.1 : 0)
        },
        get total() {
            return self.subTotal - self.discount
        },
        get canCheckout() {
            return (
                self.entries.length > 0
                // && self.entries.every((entry) => entry.isValidProduct)
            )
        }
    }))
    .actions((self) => ({
        afterAttach() {
            if (typeof window !== "undefined" && window.localStorage) {
                when(
                    () => !self.shop.isLoading,
                    () => {
                        self.readFromLocalStorage()
                        reaction(
                            () => getSnapshot(self),
                            (json) => {
                                window.localStorage.setItem("cart", JSON.stringify(json))
                            }
                        )
                    }
                )
            }
        },
        addProduct(product, selectedOptions, quantity = 1, notify = true) {
            // let entry = self.entries.find((entry) => entry.product === product)
            // if (!entry) {
            self.entries.push({ id: self.entries.length, product: product.id, selectedOptions: selectedOptions })
                // entry = self.entries[self.entries.length - 1]
            // }
            // entry.increaseQuantity(quantity)
            if (notify) self.shop.alert("Added to cart")
        },
        remove(product) {
            destroy(product)
        },
        checkout() {
            const total = self.total
            self.clear()
            self.shop.alert(`Bought products for ${total} $ !`)
        },
        clear() {
            self.entries.clear()
        },
        readFromLocalStorage() {
            const cartData = window.localStorage.getItem("cart")
            if (cartData) applySnapshot(self, JSON.parse(cartData))
        }
    }))
