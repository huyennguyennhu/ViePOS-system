const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const config = {
    user: 'sa',
    password: 'Password_123#',
    server: '127.0.0.1',
    port: 1434,
    database: 'master',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000
    }
};

const dataDir = path.join(__dirname, '../data');

// Cấu hình Schema cố định
const SCHEMA_CONFIG = {
    'CATEGORY': { pk: 'category_id' },
    'EMPLOYEE': { pk: 'employee_id' },
    'PAYMENT_METHOD': { pk: 'payment_method_id' },
    'SUPPLIER': { pk: 'supplier_id' },
    'INGREDIENT': { pk: 'ingredient_id', fks: [{ col: 'parent_ingredient_id', ref: '[INGREDIENT](ingredient_id)' }] },
    'PRODUCT': { pk: 'product_id', fks: [{ col: 'category_id', ref: '[CATEGORY](category_id)' }] },
    'ORDER': { pk: 'order_id', fks: [{ col: 'payment_method_id', ref: '[PAYMENT_METHOD](payment_method_id)' }, { col: 'employee_id', ref: '[EMPLOYEE](employee_id)' }] },
    'STOCK_IN': { pk: 'stock_in_id', fks: [{ col: 'supplier_id', ref: '[SUPPLIER](supplier_id)' }, { col: 'employee_id', ref: '[EMPLOYEE](employee_id)' }] },
    'ORDER_ITEM': { pk: 'order_item_id', fks: [{ col: 'order_id', ref: '[ORDER](order_id)' }, { col: 'product_id', ref: '[PRODUCT](product_id)' }] },
    'RECIPE': { pk: 'recipe_id', fks: [{ col: 'product_id', ref: '[PRODUCT](product_id)' }, { col: 'ingredient_id', ref: '[INGREDIENT](ingredient_id)' }] },
    'STOCK_IN_ITEM': { pk: 'stock_in_item_id', fks: [{ col: 'stock_in_id', ref: '[STOCK_IN](stock_in_id)' }, { col: 'ingredient_id', ref: '[INGREDIENT](ingredient_id)' }] },
    'STOCK_OUT': { pk: 'stock_out_id', fks: [{ col: 'employee_id', ref: '[EMPLOYEE](employee_id)' }, { col: 'order_id', ref: '[ORDER](order_id)' }] },
    'STOCK_OUT_ITEM': { pk: 'stock_out_item_id', fks: [{ col: 'stock_out_id', ref: '[STOCK_OUT](stock_out_id)' }, { col: 'ingredient_id', ref: '[INGREDIENT](ingredient_id)' }] }
};

const IMPORT_ORDER = ['CATEGORY', 'EMPLOYEE', 'PAYMENT_METHOD', 'SUPPLIER', 'INGREDIENT', 'PRODUCT', 'ORDER', 'ORDER_ITEM', 'RECIPE', 'STOCK_IN', 'STOCK_IN_ITEM', 'STOCK_OUT', 'STOCK_OUT_ITEM'];

async function main() {
    let pool;
    try {
        console.log('--- KHỞI ĐỘNG NHẬP DỮ LIỆU (V3 - IDENTITY PK) ---');
        pool = await sql.connect(config);
        const dbName = 'ViePOS';
        await pool.request().query(`IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'${dbName}') CREATE DATABASE [${dbName}]`);
        await pool.close();
        config.database = dbName;
        pool = await sql.connect(config);

        console.log('Đang dọn dẹp các bảng cũ...');
        
        // Xóa tất cả Khóa Ngoại trước để tránh lỗi ràng buộc
        console.log('> Đang gỡ bỏ toàn bộ ràng buộc khóa ngoại...');
        await pool.request().query(`
            DECLARE @sql NVARCHAR(MAX) = N'';
            SELECT @sql += N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
                + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
                ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
            FROM sys.foreign_keys;
            EXEC sp_executesql @sql;
        `);

        for (const table of [...IMPORT_ORDER].reverse()) { 
            await pool.request().query(`IF OBJECT_ID('[${table}]', 'U') IS NOT NULL DROP TABLE [${table}]`); 
        }

        for (const tableName of IMPORT_ORDER) {
            console.log(`> Đang xử lý bảng: ${tableName}`);
            const filePath = path.join(dataDir, `${tableName}.csv`);
            let rows = [];
            if (fs.existsSync(filePath)) {
                rows = await new Promise((res) => {
                    const data = [];
                    fs.createReadStream(filePath).pipe(csv())
                        .on('data', d => {
                            const clean = {};
                            Object.keys(d).forEach(k => clean[k.trim().toLowerCase()] = d[k] ? d[k].trim() : null);
                            data.push(clean);
                        })
                        .on('end', () => res(data));
                });
            }

            const schema = SCHEMA_CONFIG[tableName];
            const pkCol = schema.pk.toLowerCase();
            const fks = (schema.fks || []).map(f => ({ col: f.col.toLowerCase(), ref: f.ref }));
            
            // Xác định xem PK có trong CSV không
            const firstRow = rows[0] || {};
            const pkInCsv = Object.keys(firstRow).includes(pkCol);
            
            let allCols = new Set(Object.keys(firstRow));
            if (schema.fks) fks.forEach(f => allCols.add(f.col));

            let colDefs = [];
            if (!pkInCsv) {
                colDefs.push(`[${pkCol}] INT IDENTITY(1,1) PRIMARY KEY`);
            } else {
                colDefs.push(`[${pkCol}] NVARCHAR(100) NOT NULL PRIMARY KEY`);
            }

            allCols.forEach(col => {
                if (col === pkCol) return; // Đã xử lý ở trên
                if (fks.find(f => f.col === col)) {
                    colDefs.push(`[${col}] NVARCHAR(100) NULL`);
                } else {
                    colDefs.push(`[${col}] NVARCHAR(MAX) NULL`);
                }
            });

            await pool.request().query(`CREATE TABLE [${tableName}] (${colDefs.join(', ')})`);

            if (rows.length > 0) {
                console.log(`  Đang nhập ${rows.length} dòng...`);
                for (const row of rows) {
                    const colsPresent = Object.keys(row);
                    const request = pool.request();
                    // Chỉ chèn các cột có trong CSV
                    const insertQuery = `INSERT INTO [${tableName}] (${colsPresent.map(c => `[${c}]`).join(', ')}) VALUES (${colsPresent.map((_, i) => `@v${i}`).join(', ')})`;
                    colsPresent.forEach((c, i) => {
                        let val = row[c];
                        if (val === '' || val === undefined) val = null;
                        if (typeof val === 'string') {
                             request.input(`v${i}`, sql.NVarChar, val);
                        } else {
                             request.input(`v${i}`, val);
                        }
                    });
                    try {
                        await request.query(insertQuery);
                    } catch (e) {
                        console.error(`  ! Lỗi chèn dòng: ${JSON.stringify(row)}`);
                        console.error(`  ! Chi tiết: ${e.message}`);
                    }
                }
            } else {
                console.log('  Bảng trống.');
            }
        }

        console.log('\n> Đang thiết lập các ràng buộc Foreign Keys...');
        for (const tableName of IMPORT_ORDER) {
            const schema = SCHEMA_CONFIG[tableName];
            if (schema.fks) {
                for (const f of schema.fks) {
                    const fkName = `FK_${tableName}_${f.col.replace(/[\[\]]/g, '')}`;
                    try {
                        await pool.request().query(`ALTER TABLE [${tableName}] ADD CONSTRAINT [${fkName}] FOREIGN KEY ([${f.col.toLowerCase()}]) REFERENCES ${f.ref}`);
                        console.log(`  + Đã tạo FK: ${tableName}.${f.col} -> ${f.ref}`);
                    } catch (e) {
                        console.log(`  - Bỏ qua FK: ${tableName}.${f.col} -> ${f.ref} (Lỗi: ${e.message})`);
                    }
                }
            }
        }
        console.log('\n--- HOÀN TẤT QUY TRÌNH ---');
    } catch (err) {
        console.error('\nLỖI TỔNG THỂ:', err.message);
    } finally {
        if (pool) await pool.close();
        process.exit();
    }
}
main();
