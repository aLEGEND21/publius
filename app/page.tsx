"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollText, Trophy } from "lucide-react";

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
    <div className="min-h-screen bg-[#faf6f1]">
      <header className="border-b border-neutral-200 text-center">
        <div className="max-w-screen-xl mx-auto py-12 px-4">
          <div className="flex justify-center mb-8">
            <ScrollText size={36} className="text-foreground opacity-80" />
          </div>
          <h1 className="newspaper-title text-7xl md:text-8xl mb-8">Publius</h1>
          <p className="newspaper-subtitle text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Where Images Stand the Test of Public Opinion
          </p>
          <nav className="flex justify-center items-center gap-6 text-sm font-serif">
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trophy size={16} />
              <span>View Rankings</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-16">
        <article className="prose prose-slate mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {images.map((image: any) => (
              <div
                key={image._id}
                onClick={() => handleClick(image._id)}
                className="image-container group cursor-pointer"
              >
                <figure className="image-frame">
                  <Image
                    src={`/data/${image.name}`}
                    alt={image.name}
                    width={800}
                    height={800}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="image-standing">
                    <p className="font-serif text-base mb-2 opacity-80">
                      Current Standing
                    </p>
                    <p className="font-mono text-2xl">{image.elo}</p>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 border-t border-neutral-200 pt-10">
            <p className="text-sm text-muted-foreground font-serif italic">
              Make your choice by clicking on an image
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
