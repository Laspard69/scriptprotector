import clientPromise from "../../lib/mongodb";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("robloxkeys");
    const collection = db.collection("scripts");

    const { script } = req.body;
    if (!script || !script.trim()) {
      return res.status(400).json({ error: "Script is required" });
    }

    const id = crypto.randomBytes(16).toString("hex");

    await collection.insertOne({
      _id: id,
      script,
      createdAt: new Date(),
    });

    return res.status(200).json({ id });
  } catch (err) {
    console.error("API /create error:", err.message);
    return res.status(500).json({ error: "Database connection failed" });
  }
}
