import * as http from 'http';
import * as fs from 'fs';
import WebSocket from 'ws';

export class WebServer {
    private readonly hostname: string = '127.0.0.1';
    private readonly port: number = 5689;
    private readonly websocketPort: number = 5690
    private readonly httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
    private readonly websocketServer: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>
    private readonly clients: Set<WebSocket> = new Set();

    constructor() {
        this.httpServer = this.createHttpServer()
        this.websocketServer = this.createWebsocketServer()
    }

    startServer() {
        this.httpServer.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }

    private createHttpServer() {
        return http.createServer((req, res) => {
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
    }

    private createWebsocketServer() {
        const wss = new WebSocket.Server({port: this.websocketPort})

        wss.on('connection', (ws: any) => {
            this.clients.add(ws);
            console.log("Connected")
            console.log(this.clients.size);
            ws.on('close', () => {
                this.clients.delete(ws);
            });
        });

        return wss
    }

    public pushMessage(data: any) {
        // 向所有客户端推送数据
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        })
    }
}