import * as http from 'http';
import * as fs from 'fs';
import WebSocket from 'ws';
import {getLogger} from "../util/logger";

const logger = getLogger("WebServer")

export class WebServer {
    private readonly httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
    private readonly websocketServer: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>
    private readonly clients: Set<WebSocket> = new Set();
    private config: { http: { host: string, port: number }, websocket: { host: string, port: number } };

    constructor() {
        this.config = require("../../resources/config/webServer.json");
        this.httpServer = this.createHttpServer()
        this.websocketServer = this.createWebsocketServer()
    }

    startServer() {
        const port = this.config.http.port
        const host = this.config.http.host
        this.httpServer.listen(port, host, () => {
            const link = `http://${host}:${port}`
            logger.info(`Http server running at ${link}`)
            logger.info(`Click the link to open dynamic state diagram in your browser: ${link}/stateDiagram.html`)
        });

        this.httpServer.on("error", (e) => {
            if (e.message.includes("listen EACCES: permission denied")) {
                logger.fatal("Http server can not start.\n" +
                    `Possible solution: Port ${this.config.http.port} has been used by other process, please change another port.`)
                throw e
            }
        })
        this.websocketServer.on("error", (e) => {
            if (e.message.includes("listen EACCES: permission denied")) {
                logger.fatal("Websocket server can not start.\n" +
                `Possible solution: Port ${this.config.websocket.port} has been used by other process, please change another port.`)
                throw e
            }
        })
        this.websocketServer.on('connection', (ws: any) => {
            this.clients.add(ws);
            logger.info(`Websocket connected: ${this.clients.size}`)
            ws.on('close', () => {
                this.clients.delete(ws);
            });
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
        return new WebSocket.Server({port: this.config.websocket.port, host: this.config.websocket.host})
    }

    /**
     * Send message to all websocket clients connected.
     * @param data Any data that can be converted to JSON format.
     */
    public sendMessage(data: any) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        })
    }
}