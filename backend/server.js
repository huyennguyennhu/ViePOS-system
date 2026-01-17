const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
const port = 3000;
const CONTAINER_NAME = 'sql2019';

app.use(cors());
app.use(express.json());

const config = {
    user: 'sa',
    password: 'Password_123#',
    server: '127.0.0.1',
    port: 1434,
    database: 'ViePOS',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000
    }
};

// Hàm xử lý khi tắt server
function shutdown() {
    console.log('\nĐang ngắt kết nối và dừng Docker...');
    try {
        execSync(`docker stop ${CONTAINER_NAME}`);
        console.log(`Đã dừng container ${CONTAINER_NAME}.`);
    } catch (e) {
        console.log(`Không thể dừng container ${CONTAINER_NAME}: ${e.message}`);
    }
    process.exit();
}

// Lắng nghe các sự kiện tắt (Ctrl+C hoặc terminal đóng)
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function startServer() {
    try {
        await sql.connect(config);
        console.log('Đã kết nối với SQL Server');

        app.get('/api/categories', async (req, res) => {
            try {
                const result = await sql.query('SELECT * FROM CATEGORY');
                res.json(result.recordset);
            } catch (err) {
                res.status(500).send(err.message);
            }
        });

        app.get('/api/products', async (req, res) => {
            try {
                const result = await sql.query('SELECT * FROM PRODUCT');
                res.json(result.recordset);
            } catch (err) {
                res.status(500).send(err.message);
            }
        });

        app.listen(port, () => {
            console.log(`Backend API đang chạy tại http://localhost:${port}`);
            console.log(`Nhấn Ctrl + C để dừng server và Docker.`);
        });
    } catch (err) {
        console.error('Lỗi khởi động server:', err.message);
        process.exit(1);
    }
}

startServer();
