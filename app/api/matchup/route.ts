import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import client from "@/lib/mongodb";

interface PostRequestBody {
  winnerId: string;
  loserId: string;
}

// Randomly select two images from the database and return them
export async function GET() {
  await client.connect();
  const db = client.db("Publius");
  const images = db.collection("images");

  // Get two random images
  const data = await images.aggregate([{ $sample: { size: 2 } }]).toArray();

  return NextResponse.json(data);
}

// Update the Elo ratings of the two images based on the match result
export async function POST(req: Request) {
  await client.connect();
  const db = client.db("Publius");
  const images = db.collection("images");

  // Load both documents from the database
  const { winnerId, loserId } = (await req.json()) as PostRequestBody;
  const winner = await images.findOne({ _id: new ObjectId(winnerId) });
  const loser = await images.findOne({ _id: new ObjectId(loserId) });
  if (!winner || !loser) {
    return NextResponse.json({ success: false, error: "Invalid IDs" });
  }

  // Declare a helper function to predict the expected score
  const expectedScore = (rating1: number, rating2: number) => {
    return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  };

  // Declare a helper function to update the rating based on the actual results
  const updateRating = (rating: number, expected: number, actual: number) => {
    const k = 32; // K-factor
    return Math.round(rating + k * (actual - expected));
  };

  // Calculate the new Elo ratings
  const expectedWinnerScore = expectedScore(winner.elo, loser.elo);
  const expectedLoserScore = expectedScore(loser.elo, winner.elo);
  const newWinnerRating = updateRating(winner.elo, expectedWinnerScore, 1); // Winner gets 1 point
  const newLoserRating = updateRating(loser.elo, expectedLoserScore, 0);

  // Update the ratings in the database
  await images.updateOne(
    { _id: new ObjectId(winnerId) },
    { $set: { elo: newWinnerRating } }
  );
  await images.updateOne(
    { _id: new ObjectId(loserId) },
    { $set: { elo: newLoserRating } }
  );

  return NextResponse.json({ success: true });
}
