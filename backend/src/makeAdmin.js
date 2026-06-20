require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

/*
  ترقية مستخدم موجود إلى مشرف، أو إنشاء حساب مشرف جديد.

  الاستخدام:
    npm run make-admin <email>                  -> ترقية مستخدم موجود إلى admin
    npm run make-admin <email> <password> <name>-> إنشاء حساب مشرف جديد
*/
(async () => {
  try {
    const [, , emailArg, passwordArg, ...nameParts] = process.argv;
    if (!emailArg) {
      console.error("❌ الاستخدام: npm run make-admin <email> [password] [name]");
      process.exit(1);
    }
    const email = emailArg.toLowerCase();

    if (!process.env.MONGO_URI) throw new Error("MONGO_URI غير مضبوط في backend/.env");
    await mongoose.connect(process.env.MONGO_URI);

    let user = await User.findOne({ email });

    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`✅ تمت ترقية «${user.name}» (${email}) إلى مشرف.`);
    } else {
      if (!passwordArg) {
        console.error(`❌ لا يوجد مستخدم بهذا البريد. لإنشاء حساب جديد: npm run make-admin ${email} <password> <name>`);
        process.exit(1);
      }
      const name = nameParts.join(" ") || "مشرف";
      const hashed = await bcrypt.hash(passwordArg, 10);
      user = await User.create({ name, email, password: hashed, role: "admin" });
      console.log(`✅ تم إنشاء حساب مشرف جديد: «${name}» (${email}).`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("❌ فشل:", e.message);
    process.exit(1);
  }
})();
