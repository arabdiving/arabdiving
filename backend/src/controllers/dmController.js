const DirectMessage = require("../models/DirectMessage");
const User = require("../models/User");

const areFriends = (me, otherId) => (me.friends || []).some((x) => x.toString() === otherId.toString());

// Send a DM — friends only.
const sendDM = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const otherId = req.params.userId;
    if (!areFriends(me, otherId)) return res.status(403).json({ success: false, message: "يمكنك مراسلة الأصدقاء فقط." });
    const content = (req.body.content || "").trim();
    if (!content) return res.status(400).json({ success: false, message: "الرسالة فارغة" });
    const msg = await DirectMessage.create({ from: me._id, to: otherId, content });
    res.status(201).json({ success: true, message: msg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// Conversation with a user (and mark their messages to me as read).
const getConversation = async (req, res) => {
  try {
    const meId = req.user._id; const otherId = req.params.userId;
    const msgs = await DirectMessage.find({
      $or: [{ from: meId, to: otherId }, { from: otherId, to: meId }],
    }).sort({ createdAt: 1 }).limit(500);
    await DirectMessage.updateMany({ from: otherId, to: meId, read: false }, { read: true });
    res.json({ success: true, messages: msgs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// List conversations (latest message per partner) + unread counts.
const listConversations = async (req, res) => {
  try {
    const meId = req.user._id.toString();
    const all = await DirectMessage.find({ $or: [{ from: req.user._id }, { to: req.user._id }] })
      .sort({ createdAt: -1 }).limit(1000)
      .populate("from", "name profileImage").populate("to", "name profileImage");
    const map = {};
    for (const m of all) {
      const partner = m.from._id.toString() === meId ? m.to : m.from;
      const pid = partner._id.toString();
      if (!map[pid]) map[pid] = { partner, last: m.content, at: m.createdAt, unread: 0 };
      if (m.to._id.toString() === meId && !m.read) map[pid].unread += 1;
    }
    res.json({ success: true, conversations: Object.values(map) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const unreadCount = async (req, res) => {
  try {
    const count = await DirectMessage.countDocuments({ to: req.user._id, read: false });
    res.json({ success: true, count });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { sendDM, getConversation, listConversations, unreadCount };
