class Cache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    return this.cache.get(key)?.data;
  }

  has(key) {
    return this.cache.has(key);
  }
}

module.exports = Cache;
