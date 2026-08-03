import re

with open('frontend/src/services/MockDB.ts', 'r') as f:
    content = f.read()

# Add FirestoreDBService import if not exists
if 'import { FirestoreDBService }' not in content:
    content = content.replace("import { doc, setDoc, deleteDoc } from 'firebase/firestore';", "import { doc, setDoc, deleteDoc } from 'firebase/firestore';\nimport { FirestoreDBService } from './FirestoreDBService';")

add_item_replacement = '''
  static async addItem(collection: keyof DatabaseSchema, item: any) {
    item.id = item.id || Math.random().toString(36).substr(2, 9);
    // Optimistic UI update
    const db = this.get();
    (db[collection] as any[]).push(item);
    this.set(db);

    // Instead of relying on backend REST endpoints (which are admin-only), 
    // directly write to Firestore using client SDK. This ensures no MockDB isolation.
    try {
      await FirestoreDBService.upsert(collection, item.id, item);
    } catch (err) {
      console.warn('Failed to sync addItem to Firestore:', err);
    }
  }
'''

update_item_replacement = '''
  static async updateItem(collection: keyof DatabaseSchema, id: string, item: any) {
    // Optimistic UI update
    const db = this.get();
    const index = (db[collection] as any[]).findIndex(i => (i.id === id || i.uid === id));
    if (index > -1) {
      (db[collection] as any[])[index] = { ...((db[collection] as any[])[index]), ...item };
      this.set(db);
    }

    try {
      await FirestoreDBService.upsert(collection, id, item);
    } catch (err) {
      console.warn('Failed to sync updateItem to Firestore:', err);
    }
  }
'''

delete_item_replacement = '''
  static async deleteItem(collection: keyof DatabaseSchema, id: string) {
    // Optimistic UI update
    const db = this.get();
    (db[collection] as any[]) = (db[collection] as any[]).filter(i => (i.id !== id && i.uid !== id));
    this.set(db);

    try {
      await FirestoreDBService.delete(collection, id);
    } catch (err) {
      console.warn('Failed to sync deleteItem to Firestore:', err);
    }
  }
'''

# Use regex to replace the methods
content = re.sub(r"static async addItem.*?\}\n\s*\}\n", add_item_replacement, content, flags=re.DOTALL)
content = re.sub(r"static async updateItem.*?\}\n\s*\}\n", update_item_replacement, content, flags=re.DOTALL)
content = re.sub(r"static async deleteItem.*?\}\n\s*\}\n", delete_item_replacement, content, flags=re.DOTALL)

with open('frontend/src/services/MockDB.ts', 'w') as f:
    f.write(content)
