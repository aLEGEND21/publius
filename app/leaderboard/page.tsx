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
    let scaledElo = 5 + zScore * 2.5; // Adjust mean to 5, std dev to 2.5

    // Clamp values between 1 and 10
    scaledElo = Math.max(1, Math.min(10, scaledElo));

    return { ...image, elo: Math.round(scaledElo * 10) / 10 }; // Round to 1 decimal place
  });

  // Verify the standard deviation of the normalized elo ratings
  const normalizedEloValues = normalizedData.map((image: any) => image.elo);
  const meanNormalizedElo =
    normalizedEloValues.reduce((sum, elo) => sum + elo, 0) /
    normalizedEloValues.length;
  const stdDevNormalizedElo = Math.sqrt(
    normalizedEloValues.reduce(
      (sum, elo) => sum + Math.pow(elo - meanNormalizedElo, 2),
      0
    ) / normalizedEloValues.length
  );
  console.log("Mean Normalized Elo:", meanNormalizedElo);
  console.log("Standard Deviation Normalized Elo:", stdDevNormalizedElo);

  return (
    <div className="flex flex-col items-center gap-6">
      {normalizedData.map((image: any) => (
        <div key={image._id} className="flex items-center gap-4">
          <img
            src={`/data/${image.name}`}
            alt={image.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
          <p className="text-lg font-semibold">{image.name}</p>
          <p className="text-sm text-gray-500">{image.elo}</p>
        </div>
      ))}
    </div>
  );
}
