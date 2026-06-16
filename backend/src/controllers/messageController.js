const ContactMessage = require("../models/ContactMessage");

// Public: visitor submits a message via the chat widget.
const createMessage = async (req, res) => {
  try {
    const { name, contact, message, page } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "الاسم مطلوب." });
    }
    const doc = await ContactMessage.create({
      name: String(name).trim(),
      contact: contact ? String(contact).trim() : "",
      message: message ? String(message).trim() : "",
      page: page || "",
      user: req.user ? req.user._id : undefined,
    });
    res.status(201).json({ success: true, id: doc._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list messages (newest first).
const listMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(500);
    const unread = messages.filter((m) => m.status === "new").length;
    res.json({ success: true, unread, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: mark a message as read.
const markRead = async (req, res) => {
  try {
    const m = await ContactMessage.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
    if (!m) return res.status(404).json({ success: false, message: "الرسالة غير موجودة" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: delete a message.
const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createMessage, listMessages, markRead, deleteMessage };
