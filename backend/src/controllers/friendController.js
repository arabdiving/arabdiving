const User = require("../models/User");

const has = (arr, id) => (arr || []).some((x) => x.toString() === id.toString());
const pull = (arr, id) => (arr || []).filter((x) => x.toString() !== id.toString());

// Send a friend request (auto-accepts if the other already requested you).
const sendRequest = async (req, res) => {
  try {
    const meId = req.user._id;
    const otherId = req.params.id;
    if (meId.toString() === otherId) return res.status(400).json({ success: false, message: "لا يمكنك إضافة نفسك" });
    const me = await User.findById(meId);
    const other = await User.findById(otherId);
    if (!other) return res.status(404).json({ success: false, message: "العضو غير موجود" });
    if (has(me.friends, otherId)) return res.json({ success: true, status: "friends" });

    // If they already sent me a request → accept.
    if (has(me.friendReqIn, otherId)) {
      me.friendReqIn = pull(me.friendReqIn, otherId);
      other.friendReqOut = pull(other.friendReqOut, meId);
      if (!has(me.friends, otherId)) me.friends.push(otherId);
      if (!has(other.friends, meId)) other.friends.push(meId);
      await me.save(); await other.save();
      return res.json({ success: true, status: "friends" });
    }
    if (!has(me.friendReqOut, otherId)) me.friendReqOut.push(otherId);
    if (!has(other.friendReqIn, meId)) other.friendReqIn.push(meId);
    await me.save(); await other.save();
    res.json({ success: true, status: "outgoing" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const acceptRequest = async (req, res) => {
  try {
    const meId = req.user._id; const otherId = req.params.id;
    const me = await User.findById(meId); const other = await User.findById(otherId);
    if (!other) return res.status(404).json({ success: false, message: "العضو غير موجود" });
    if (!has(me.friendReqIn, otherId)) return res.status(400).json({ success: false, message: "لا يوجد طلب من هذا العضو" });
    me.friendReqIn = pull(me.friendReqIn, otherId);
    other.friendReqOut = pull(other.friendReqOut, meId);
    if (!has(me.friends, otherId)) me.friends.push(otherId);
    if (!has(other.friends, meId)) other.friends.push(meId);
    await me.save(); await other.save();
    res.json({ success: true, status: "friends" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const declineRequest = async (req, res) => {
  try {
    const meId = req.user._id; const otherId = req.params.id;
    const me = await User.findById(meId); const other = await User.findById(otherId);
    me.friendReqIn = pull(me.friendReqIn, otherId);
    me.friendReqOut = pull(me.friendReqOut, otherId);
    if (other) { other.friendReqOut = pull(other.friendReqOut, meId); other.friendReqIn = pull(other.friendReqIn, meId); await other.save(); }
    await me.save();
    res.json({ success: true, status: "none" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const removeFriend = async (req, res) => {
  try {
    const meId = req.user._id; const otherId = req.params.id;
    const me = await User.findById(meId); const other = await User.findById(otherId);
    me.friends = pull(me.friends, otherId);
    if (other) { other.friends = pull(other.friends, meId); await other.save(); }
    await me.save();
    res.json({ success: true, status: "none" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const myFriends = async (req, res) => {
  try {
    const me = await User.findById(req.user._id)
      .populate("friends", "name profileImage country")
      .populate("friendReqIn", "name profileImage country")
      .populate("friendReqOut", "name profileImage");
    res.json({ success: true, friends: me.friends, incoming: me.friendReqIn, outgoing: me.friendReqOut });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { sendRequest, acceptRequest, declineRequest, removeFriend, myFriends };
