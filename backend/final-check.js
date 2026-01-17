const sql = require('mssql');
const config = {
    user: 'sa',
    password: 'Password_123#',
    server: '127.0.0.1',
    port: 1434,
    database: 'ViePOS',
    options: { encrypt: false, trustServerCertificate: true }
};
async function check() {
    try {
        const pool = await sql.connect(config);
        const tables = ['CATEGORY', 'EMPLOYEE', 'PAYMENT_METHOD', 'SUPPLIER', 'INGREDIENT', 'PRODUCT', 'ORDER', 'STOCK_IN', 'ORDER_ITEM', 'RECIPE', 'STOCK_IN_ITEM', 'LOG_INVENTORY'];
        
        console.log('--- THỐNG KÊ DỮ LIỆU ---');
        for (const t of tables) {
            const res = await pool.request().query(`SELECT COUNT(*) as count FROM [${t}]`);
            console.log(`${t.padEnd(15)}: ${res.recordset[0].count} dòng`);
        }

        const pkRes = await pool.request().query("SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'PRIMARY KEY'");
        const fkRes = await pool.request().query("SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'");
        console.log('\n--- THỐNG KÊ RÀNG BUỘC ---');
        console.log(`Số lượng Primary Keys: ${pkRes.recordset[0].count}`);
        console.log(`Số lượng Foreign Keys: ${fkRes.recordset[0].count}`);

        await pool.close();
    } catch(e) { console.error(e); }
}
check();
