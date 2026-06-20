// Returns the uploaded image URL (multer + Cloudinary set req.file.path).
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "لم يتم رفع صورة" });
    }
    res.json({ success: true, url: req.file.path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadImage };
