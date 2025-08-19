import Message from '../models/messageModel.js';
import Notification from '../models/notificationModel.js';

const socketManager = (io) => {
  io.on('connection', (socket) => {
    console.log(' New client connected');

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      const message = await Message.create({ sender: senderId, receiver: receiverId, content });

      const notification = await Notification.create({
        user: receiverId,
        message: `New message from user`,
      });

      io.to(receiverId).emit('newMessage', message);
      io.to(receiverId).emit('newNotification', notification);
    });

    socket.on('disconnect', () => {
      console.log(' Client disconnected');
    });
  });
};

export default socketManager;
