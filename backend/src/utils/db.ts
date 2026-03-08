import sqlite3 from 'sqlite3';
import path from 'path';

// Create and export a singleton database connection
const dbPath = path.resolve(__dirname, '../../dev.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Initialize required tables if they don't exist
        db.run(`
      CREATE TABLE IF NOT EXISTS Categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        imageUrl TEXT
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS Brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        categoryId TEXT,
        FOREIGN KEY (categoryId) REFERENCES Categories(id)
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS Devices (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        basePrice REAL NOT NULL,
        categoryId TEXT,
        brandId TEXT,
        FOREIGN KEY (categoryId) REFERENCES Categories(id),
        FOREIGN KEY (brandId) REFERENCES Brands(id)
      )
    `);

        // Insert mock data if empty
        db.get('SELECT count(*) as count FROM Categories', (err, row: any) => {
            if (row && row.count === 0) {
                db.run('INSERT INTO Categories (id, name, slug) VALUES (?, ?, ?)', ['cat_1', 'Mobiles', 'mobiles']);
                db.run('INSERT INTO Categories (id, name, slug) VALUES (?, ?, ?)', ['cat_2', 'Laptops', 'laptops']);

                db.run('INSERT INTO Brands (id, name, categoryId) VALUES (?, ?, ?)', ['brand_1', 'Apple', 'cat_1']);
                db.run('INSERT INTO Devices (id, name, slug, basePrice, categoryId, brandId) VALUES (?, ?, ?, ?, ?, ?)',
                    ['dev_1', 'iPhone 13 128GB', 'iphone-13-128gb', 35000, 'cat_1', 'brand_1']);
            }
        });

    }
});

export default db;
