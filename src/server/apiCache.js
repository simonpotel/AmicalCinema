class Cache {
  // cache class to store data in memory
  constructor(maxSize) {
    this.maxSize = maxSize; // max size of the cache
    this.cache = new Map(); // cache is a map of key-value pairs
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value; // get the first key of the cache
      this.cache.delete(firstKey); // delete the first key of the cache
    }
    this.cache.set(key, {
      data: value, // value is the data to store
      timestamp: Date.now(), // timestamp is the current time
    });
  }

  get(key) {
    return this.cache.get(key)?.data; // get the data of the key
  }

  has(key) {
    return this.cache.has(key); // check if the key is in the cache
  }
}

module.exports = Cache;
