// FIFO — витісняє найстаріший запис
class FIFOCache extends Cache {
  private order: string[] = [];

  protected evict(): string {
    return this.order.shift()!;
  }

  protected touch(key: string): void {
    if (!this.order.includes(key)) this.order.push(key);
  }
}

// LRU — витісняє найменш нещодавно вживаний
class LRUCache extends Cache {
  private usage: string[] = [];

  protected evict(): string {
    return this.usage.shift()!;
  }

  protected touch(key: string): void {
    this.usage = this.usage.filter((k) => k !== key);
    this.usage.push(key);
  }
}

// Використання
const fifo: Cache = new FIFOCache(2);
fifo.put("a", 1);
fifo.put("b", 2);
fifo.get("a");

abstract class Cache {
  protected store = new Map<string, number>();
  constructor(protected capacity: number) {}

  // Template Method — незмінний скелет алгоритму
  get(key: string): number | undefined {
    const value = this.store.get(key);
    if (value === undefined) return undefined;
    this.touch(key);            // Hook
    return value;
  }

  put(key: string, value: number): void {
    if (this.store.size >= this.capacity) {
      this.store.delete(this.evict());   // Primitive
    }
    this.store.set(key, value);
    this.touch(key);
  }

  // Primitive Method (реалізують підкласи)
  protected abstract evict(): string;

  // Hook — типова реалізація порожня
  protected touch(key: string): void {}
}
