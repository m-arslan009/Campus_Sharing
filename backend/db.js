const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    const configuredDbName = process.env.MONGODB_DB_NAME?.trim();
    let uriDbName = "";

    try {
      const parsedUri = new URL(mongoUri);
      uriDbName = parsedUri.pathname.replace(/^\//, "").trim();
    } catch (_error) {
      uriDbName = "";
    }

    if (
      configuredDbName &&
      uriDbName &&
      configuredDbName.toLowerCase() !== uriDbName.toLowerCase()
    ) {
      throw new Error(
        `Database name mismatch: MONGODB_URI uses \"${uriDbName}\" but MONGODB_DB_NAME is \"${configuredDbName}\"`,
      );
    }

    const finalDbName = uriDbName || configuredDbName || "Campus_Sharing";
    const conn = await mongoose.connect(mongoUri, {
      dbName: finalDbName,
    });
    console.log(`Database Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = ConnectDB;
