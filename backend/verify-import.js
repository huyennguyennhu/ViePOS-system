const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Password_123#',
    server: '127.0.0.1',
    port: 1434,
    database: 'ViePOS',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function verify() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
        
        console.log('--- DANH SÁCH BẢNG VÀ SỐ DÒNG ---');
        for (const row of result.recordset) {
            const countRes = await pool.request().query(`SELECT COUNT(*) as count FROM [${row.TABLE_NAME}]`);
            console.log(`${row.TABLE_NAME}: ${countRes.recordset[0].count} dòng`);
        }
        await pool.close();
    } catch (err) {
        console.error('Lỗi xác minh:', err.message);
    }
}

verify();
