import React, {Context, createContext} from 'react';
import ISocketServer from '../Intefaces/ISocketServer';

export default createContext<ISocketServer>({
    server: null,
    isReady: false,
    sendMessage: null,
    serverMessage: null,
    chatMessage: '',
    chatInfo: null,
    onlineUsers: [],
    unreadMessages: [],
    markAsRead: null
});