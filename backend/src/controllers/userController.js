exports.getProfile = async (req, res) => { res.json({ success: true, data: req.user }); }; exports.updateProfile = async (req, res) => { res.json({ success: true, message: "Profile updated" }); };
