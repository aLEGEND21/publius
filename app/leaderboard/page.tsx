import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import client from "@/lib/mongodb";

export default async function Leaderboard() {
  await client.connect();
  const db = client.db("Publius");
  const images = db.collection("images");

  // Get all images sorted by Elo rating
  const data = await images.find().sort({ elo: -1 }).toArray();

  // Normalize Elo ratings to a 1-10 scale for display. They should have a standard deviation of 2.5
  const elos = data.map((image: any) => image.elo);
  const meanElo = elos.reduce((sum, elo) => sum + elo, 0) / elos.length;
  const stdDevElo = Math.sqrt(
    elos.reduce((sum, elo) => sum + Math.pow(elo - meanElo, 2), 0) / elos.length
  );

  const normalizedData = data.map((image: any) => {
    let zScore = (image.elo - meanElo) / stdDevElo; // Z-score normalization
    let scaledElo = 5 + zScore * 2; // Adjust mean to 5, std dev to 2

    // Clamp values between 1 and 10
    scaledElo = Math.max(1, Math.min(10, scaledElo));

    return { ...image, scaledElo: Math.round(scaledElo * 10) / 10 }; // Round to 1 decimal place
  });

  return (
    <div className="min-h-screen bg-[#faf6f1] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            <span>Return to Voting</span>
          </Link>
          <h1 className="newspaper-title text-5xl md:text-6xl mb-6">
            Current Rankings
          </h1>
          <p className="newspaper-subtitle text-xl text-muted-foreground max-w-2xl mx-auto">
            Images ranked by public opinion
          </p>
        </header>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-neutral-100">
          {normalizedData.map((image, index) => (
            <div
              key={image._id.toString()}
              className={`flex items-center gap-8 p-8 ${
                index !== normalizedData.length - 1
                  ? "border-b border-neutral-100"
                  : ""
              }`}
            >
              <span className="font-mono text-3xl text-muted-foreground w-12 text-center">
                {index + 1}
              </span>
              <div className="relative w-32 h-32 overflow-hidden rounded-lg shadow-sm">
                <Image
                  src={`/data/${image.name}`}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-serif text-xl mb-2">
                  Rating: {image.scaledElo.toFixed(1)} / 10
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {image.elo} Elo
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
