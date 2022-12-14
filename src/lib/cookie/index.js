import { Cookies } from "react-cookie";

const cookies = new Cookies();

/**
 *
 * @param {string} name
 * @param {string} value
 */
export const setCookie = (name, value) => {
    return cookies.set(name, value);
};

/**
 *
 * @param {string} name
 * @returns {string} value
 */
export const getCookie = (name) => {
    return cookies.get(name);
};

export const removeCookie = (name) => {
    return cookies.remove(name);
};
