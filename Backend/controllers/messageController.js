import Message from '../models/messageModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: "Receiver and content are required" });
    }

    const newMessage = await Message.create({
      sender: req.user._id, // ✅ fetched from auth middleware
      receiver: receiverId,
      content,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
