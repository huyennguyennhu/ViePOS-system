const { execSync, exec } = require('child_process');
const sql = require('mssql');

const CONTAINER_NAME = 'sql2019';
const DB_CONFIG = {
    user: 'sa',
    password: 'Password_123#',
    server: '127.0.0.1',
    port: 1434,
    database: 'master',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 5000 // Chờ ngắn để kiểm tra nhanh
    }
};

async function checkConnection() {
    try {
        const pool = await sql.connect(DB_CONFIG);
        await pool.close();
        return true;
    } catch (err) {
        return false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log(`\n--- KIỂM TRA TRẠNG THÁI DOCKER (${CONTAINER_NAME}) ---`);

    // 1. Kiểm tra Docker Engine
    let dockerReady = false;
    try {
        execSync('docker ps', { stdio: 'ignore' });
        dockerReady = true;
    } catch (e) {
        console.log('Docker Engine chưa chạy. Đang thử khởi chạy Docker Desktop...');
        if (process.platform === 'win32') {
            try {
                // Thử các đường dẫn phổ biến của Docker Desktop trên Windows
                const dockerPaths = [
                    '"C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"',
                    'start "" "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"'
                ];
                exec(dockerPaths[1]); // Dùng lệnh start để không bị block
                console.log('Đã gửi yêu cầu mở Docker Desktop. Vui lòng chờ vài giây để Docker khởi động...');
                
                // Chờ Docker Engine sẵn sàng (tối đa 60 giây)
                for (let i = 0; i < 30; i++) {
                    process.stdout.write('.');
                    try {
                        execSync('docker ps', { stdio: 'ignore' });
                        dockerReady = true;
                        console.log('\nDocker Engine đã sẵn sàng!');
                        break;
                    } catch (err) {
                        await sleep(3000);
                    }
                }
            } catch (err) {
                console.error('\nKHÔNG THỂ tự động mở Docker Desktop. Vui lòng mở thủ công.');
                process.exit(1);
            }
        } else {
            console.error('LỖI: Docker Engine chưa chạy. Vui lòng bật Docker trước.');
            process.exit(1);
        }
    }

    if (!dockerReady) {
        console.error('\nLỖI: Docker Engine không khởi động kịp. Vui lòng thử lại sau khi Docker Desktop đã bật hoàn toàn.');
        process.exit(1);
    }

    // 2. Kiểm tra container
    try {
        containerStatus = execSync(`docker inspect -f "{{.State.Status}}" ${CONTAINER_NAME}`, { encoding: 'utf8' }).trim();
    } catch (e) {
        console.log(`Không tìm thấy container "${CONTAINER_NAME}". Đang tiến hành tạo mới...`);
        try {
            // Tạo container mới với cấu hình: Port 1434, Password chuẩn, Image SQL 2019
            execSync(`docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Password_123#" -p 1434:1433 --name ${CONTAINER_NAME} -d mcr.microsoft.com/mssql/server:2019-latest`);
            console.log('Đã tạo và khởi chạy container mới thành công.');
            containerStatus = 'running';
        } catch (createErr) {
            console.error('LỖI: Không thể tạo container. Vui lòng đảm bảo Docker Desktop đã được cài đặt và đang chạy.');
            process.exit(1);
        }
    }

    if (containerStatus !== 'running') {
        console.log(`Container "${CONTAINER_NAME}" đang ở trạng thái: ${containerStatus}. Đang khởi động...`);
        try {
            execSync(`docker start ${CONTAINER_NAME}`);
            console.log('Đã gửi lệnh khởi động.');
        } catch (e) {
            console.error('LỖI: Không thể khởi động container.');
            process.exit(1);
        }
    } else {
        console.log(`Container "${CONTAINER_NAME}" đang chạy.`);
    }

    // 3. Chờ SQL Server sẵn sàng
    console.log('Đang chờ SQL Server sẵn sàng nhận kết nối...');
    const maxRetries = 30;
    let connected = false;

    for (let i = 0; i < maxRetries; i++) {
        process.stdout.write('.');
        connected = await checkConnection();
        if (connected) {
            console.log('\nKẾT NỐI THÀNH CÔNG! SQL Server đã sẵn sàng.');
            process.exit(0);
        }
        await sleep(2000);
    }

    console.error('\nLỖI: Đã quá thời gian chờ nhưng vẫn không thể kết nối tới SQL Server.');
    process.exit(1);
}

main();
