export default class ProxySource {
  constructor(source) {
    this.source = source;
    this.cache = {};
  }

  getStream() {
    const key = this.source.constructor.name;
    if (this.cache[key]) {
      console.log(`Proxy cache hit for ${key}`);
      return this.cache[key];
    }
    const stream = this.source.getStream();
    this.cache[key] = stream;
    console.log(`Proxy cached: ${key}`);
    return stream;
  }
}