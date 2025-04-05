"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [images, setImages] = useState([]);

  // Fetch two random images from the database
  const fetchImages = async () => {
    const res = await fetch("/api/matchup");
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle click event and update database
  const handleClick = async (id: string) => {
    // Determine who the winner and loser are
    const winnerId = id;
    const loser: any = images.find((image: any) => image._id !== id);
    const loserId = loser._id;

    await fetch("/api/matchup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winnerId, loserId }),
    });

    fetchImages(); // Load new images after updating
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {images.map((image: any) => (
        <div
          key={image._id}
          className="cursor-pointer"
          onClick={() => handleClick(image._id)}
        >
          <Image
            src={`/data/${image.name}`}
            alt={image.name}
            width={300}
            height={300}
            className="rounded-lg"
          />
          <p className="mt-2 text-sm text-gray-500">{image.elo}</p>
        </div>
      ))}
    </div>
  );
}
