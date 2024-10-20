import * as http from 'http';
import * as fs from 'fs';
import WebSocket from 'ws';

// 客户端连接列表
const clients: Set<WebSocket> = new Set();

export function startServer() {
    const hostname = '127.0.0.1';
    const port = 5689;

    const server = http.createServer((req, res) => {
        if (req.url === '/stateDiagram.html') {
            fs.readFile("resources/static/stateDiagram.html", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });

    // 创建WebSocket服务器
    const wss = new WebSocket.Server({port: 5690})


    wss.on('connection', (ws: any) => {
        clients.add(ws);
        console.log("Connected")
        console.log(clients.size);
        ws.on('close', () => {
            clients.delete(ws);
        });
    });


    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

// 假设这是你的数据更新函数
function updateData() {
    // 模拟数据更新
    const newData = 'New data from server';
    // 向所有客户端推送数据
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(newData);
        }
    })
}

