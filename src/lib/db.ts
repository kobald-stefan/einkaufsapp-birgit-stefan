import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Expense, Settings } from '../types';

const DB_NAME = 'einkaufs_split_db';
const DB_VERSION = 2;

interface AppDB extends DBSchema {
  expenses: {
    key: string;           // Expense.id
    value: Expense;
    indexes: {
      'by-date': string;   // YYYY-MM-DD
      'by-payer': string;  // 'stefan' | 'birgit'
      'by-category': string;
    };
  };
  settings: {
    key: string;           // immer 'settings'
    value: Settings;
  };
  shopping: {
    key: string;           // item.id
    value: ShoppingItem;
  };
}

let _db: IDBPDatabase<AppDB> | null = null;

export async function resetDB() {
  if (_db) {
    _db.close();
    _db = null;
  }
  await indexedDB.deleteDatabase(DB_NAME);
}

export async function getDB() {
  if (_db) return _db;
  _db = await openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('expenses')) {
        const s = db.createObjectStore('expenses', { keyPath: 'id' });
        s.createIndex('by-date', 'date', { unique: false });
        s.createIndex('by-payer', 'payerId', { unique: false });
        s.createIndex('by-category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
      if (!db.objectStoreNames.contains('shopping')) {
        db.createObjectStore('shopping', { keyPath: 'id' });
      }
    },
  });

  // Default-Settings beim ersten Start setzen
  const tx = _db.transaction('settings', 'readwrite');
  const existing = await tx.store.get('settings');
  if (!existing) {
    const defaults: Settings = {
      users: [
        { id: 'stefan', name: 'Stefan' },
        { id: 'birgit', name: 'Birgit' },
      ],
      categories: ['Spar', 'Hofer', 'DM', 'Lidl', 'Sonstiges'],
      currency: 'EUR',
    };
    await tx.store.put(defaults, 'settings');
  }
  await tx.done;

  return _db;
}
