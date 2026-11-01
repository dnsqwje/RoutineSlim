const storage = {
  async getItem(key: string) { return localStorage.getItem(key); },
  async setItem(key: string, value: string) { localStorage.setItem(key, value); },
  async removeItem(key: string) { localStorage.removeItem(key); },
};
export default storage;
export const getItemAsync = storage.getItem;
export const setItemAsync = storage.setItem;
export const deleteItemAsync = storage.removeItem;
