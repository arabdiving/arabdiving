require("dotenv").config();
const mongoose = require("mongoose");
const DiveSite = require("./models/DiveSite");

// قائمة موسّعة بمواقع الغوص في مصر (البحر الأحمر وخليج العقبة).
// difficulty يجب أن تكون من: Beginner | Intermediate | Advanced
// image: يُترك فارغًا (يظهر تدرّج لوني) ما عدا المواقع التي تملك صورة محلية في public/images.
const sites = require("./data/diveSites");

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set. Configure backend/.env first.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");

    let created = 0;
    let updated = 0;

    for (const site of sites) {
      const result = await DiveSite.updateOne(
        { name: site.name },
        { $set: site },
        { upsert: true }
      );
      if (result.upsertedCount) created += 1;
      else if (result.matchedCount) updated += 1;
    }

    console.log(
      `✅ Seed complete — ${created} created, ${updated} updated, ${sites.length} total.`
    );
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
})();
