import axios, { AxiosResponse } from 'axios';
import OAuth from 'oauth-1.0a';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';

export const config = {
    WC_BASE_URL: 'https://jmapp.pearlclients.com',
    WC_API_URL: '/wp-json/wc/v3',
    WC_CONSUMER_KEY: 'ck_c02bbd3328b6785565937ed8f62591836740fe53',
    WC_CONSUMER_SECRET: 'cs_7d8ae839dad169ef3d781bb9d4bcf2b016f04301'

    // WC_BASE_URL: 'https://www.jeannottesmarket.com',
    // WC_API_URL: '/wp-json/wc/v3',
    // WC_CONSUMER_KEY: 'ck_b61003fa03d3a51ce289b392452abc29425432c1',
    // WC_CONSUMER_SECRET: 'cs_adf6ceb71da4d952742ca312a4864ec36a75d681'
};

const _getOAuth = () => new OAuth({
    consumer: {
        key: config.WC_CONSUMER_KEY,
        secret: config.WC_CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => Base64.stringify(hmacSHA1(baseString, key))
});

const get = async (path) => {
    const request = {
        url: `${config.WC_BASE_URL}${config.WC_API_URL}${path}`,
        method: 'GET'
    };
    const oauth = _getOAuth().authorize(request);
    return axios.get(request.url, { params: oauth });
};

const post = async (path, body) => {
    const request = {
        url: `${config.WC_BASE_URL}${config.WC_API_URL}${path}`,
        method: 'POST'
    };
    const oauth = _getOAuth().authorize(request);
    return axios.post(request.url, body, { params: oauth });
};

export default {
    get,
    post
};