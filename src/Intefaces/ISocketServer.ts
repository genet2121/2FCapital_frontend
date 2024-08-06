export default interface ISocketServer {
    sendMessage: any,
    chatMessage: any,
    serverMessage: any,
    chatInfo: any,
    server: (WebSocket | null);
    isReady: boolean;
    onlineUsers: any[];
    unreadMessages: any[];
    markAsRead: any;
}