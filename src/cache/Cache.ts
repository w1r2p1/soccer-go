import * as fs from 'fs';
import * as path from 'path';
import cfg from '../config';
import CacheItem from './CacheItem';

export default class Cache {
  private file: string;
  private data: Map<string, CacheItem>;

  constructor(dir: string) {
    this.file = path.join(dir, cfg.cache.fileName);
    try {
      const buffer = fs.readFileSync(this.file);
      this.data = JSON.parse(buffer.toString('utf-8'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        fs.writeFileSync(this.file, '{}');
        this.data = new Map<string, CacheItem>();
      } else {
        throw error;
      }
    }
  }

  public add = (id: string, data: object) => {
    const res = this.data.set(id, new CacheItem(Date.now(), data));
    this.persist();
    return res;
  };

  public remove = (id: string) => {
    const res = this.data.delete(id);
    this.persist();
    return res;
  };

  public get = (id: string): CacheItem | undefined => this.data.get(id);

  public has = (id: string): boolean => this.data.has(id);

  private persist = () =>
    fs.writeFile(this.file, JSON.stringify(this.data), err => {
      throw err;
    });
}
