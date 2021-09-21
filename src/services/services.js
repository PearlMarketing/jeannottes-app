import wc_api from './wc_api'
import wp_api from './wp_api'
import axios from 'axios'

axios.defaults.baseURL = 'https://jmapp.pearlclients.com'
// axios.defaults.baseURL = 'https://www.jeannottesmarket.com'

class Service {
    // API
    Products(params) {
        return wc_api.get(`/products?${params}`)
    }

    Product(id) {
        return wc_api.get(`/products/${id}`)
    }

    ProductVariations(id) {
        return wc_api.get(`/products/${id}/variations`)
    }

    ProductEPO() {
        return wp_api.get('/tm_global_cp')
    }

    Categories(per_page = 50) {
        return wc_api.get(`/products/categories?per_page=${per_page}&order=desc`)
    }

    Billing() {
        return wc_api.get("/payment_gateways")
    }

    CreateCustomer(data) {
        return wc_api.post("/customers", data)
    }

    UpdateCustomer(id, data) {
        return wc_api.post(`/customers/${id}`, data)
    }

    CreateOrder(data) {
        return wc_api.post("/orders", data)
    }

    CustomerOrders(id) {
        return wc_api.get(`/orders?customer=${id}&per_page=50`)
    }

    Customer(id) {
        return wc_api.get(`/customers/${id}`)
    }

    // Other
    Pages(params) {
        return axios.get(`/wp/v2/pages/?${params}`)
    }

    Posts() {
        return axios.get(`/wp/v2/posts/?per_page=50`)
    }

    Post(id) {
        return axios.get(`/wp/v2/posts/${id}`)
    }

    SetToken(data) {
        return axios.post(`/wp-json/jwt-auth/v1/token`, data)
        // return axios.post(`/jwt-auth/v1/token`, data)
    }

    TokenValidate(token = null) {
        return axios.post(`/wp-json/jwt-auth/v1/token/validate`, token, {headers: {'Authorization': token !== null ? `Bearer ${token}` : null}})
    }

    PushToken(data, token) {
        return axios.post('/wp-json/app/register-user-token', data, {headers: {'Authorization': token !== null ? `Bearer ${token}` : null}})
    }

    ResetPassword(data) {
        return axios.post('/wp-json/bdpwr/v1/reset-password', data)
    }

    SetPassword(data) {
        return axios.post('/wp-json/bdpwr/v1/set-password', data)
    }

    ValidateCode(data) {
        return axios.post('/wp-json/bdpwr/v1/validate-code', data)
    }
}

export default new Service