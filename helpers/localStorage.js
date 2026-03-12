

import Cookies from "js-cookie";

// -------- LocalStorage (Safe for SSR) --------

export const setLocalStorageItem = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem(key);
  }
  return null;
};

export const removeLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// -------- Cookie-Based Store (with js-cookie) --------

export function setLocalStoreData(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    Cookies.set(key, serializedValue);
  } catch (error) {
    console.error("Error setting cookie data:", error);
  }
}

export function getLocalStoreData(key) {
  try {
    const serializedValue = Cookies.get(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error("Error getting cookie data:", error);
    return null;
  }
}

export function deleteLocalStoreData(key) {
  try {
    Cookies.remove(key);
  } catch (error) {
    console.error("Error deleting cookie data:", error);
  }
}

export function deleteAllLocalStoreData() {
  try {
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => Cookies.remove(cookie));
  } catch (error) {
    console.error("Error deleting all cookies:", error);
  }
}
