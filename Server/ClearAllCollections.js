const mongoose = require("mongoose");
const ATLAS_USERNAME = "amrmofeedfoqha";
const ATLAS_PASSWORD = "aMr11111111";
const DB_NAME = "financeDB";

const uri = `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@testproject.l3pmxx6.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

async function clearDatabase() {
  console.log("Clearing database...");
  console.log(uri);
  await mongoose.connect(uri);

  const collections = await mongoose.connection.db.listCollections().toArray();

  for (const coll of collections) {
    await mongoose.connection.db.collection(coll.name).deleteMany({});
    console.log(`Cleared collection: ${coll.name}`);
  }

  console.log("All collections cleared!");
  await mongoose.disconnect();
}

clearDatabase().catch(console.error);
