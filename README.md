# Publius

## Overview

Publius is an open source browser-based image rating app. It uses an Elo-rating system properly rank large numbers of images based on user input, through 1v1 matchups.

By running the app yourself, you can upload your own set of images to rank based on whatever criteria you choose. This will then provide you with a leaderboard of the images, ranked from best to worst.

This project is meant to be a simple experiment in developing Elo rating systems for images. It was designed to be flexible and reusable for other datasets, and to be easy to run locally. The app is built using Next.js and TypeScript, and has a simple and minimalist design.

## Features

- **Fair Rankings**: The Elo rating system is designed to provide fair and accurate rankings of large numbers of images based on user input. This reduces human error and bias in the ranking process.
- **Leaderboard**: The app includes a leaderboard page that shows all images and their ratings.
- **Normalized Results**: Elo ratings are also normalized onto a 1 - 10 scale, making it easier to understand the relative quality of images in the dataset.

## Getting Started

### Installation

Run the following commands to clone the repository and install the dependencies:

```bash
git clone https://github.com/aLEGEND21/publius.git
cd publius
npm install
```

### Configuration

#### Setting Up the Database

The app uses MongoDB for the database. You will need to set up your own MongoDB instance and add the connection string to a `.env.local` file in the root directory of the project. Use the same format as the `.env.example` file, replacing placeholders as needed.

#### Adding Images

Before running the app, you will need to add your own images. You can do this by creating a new folder in the `public` directory called `data` and adding your images there.

To load the images into the database, use the `init_db.py` script. This script will read the images from the `data` folder and add them to the database. You can run the script using the following command:

```bash
python3 init_db.py
```

### Running the App

Once you have set up the database and added your images, you can run the app using the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000` and open the app in your default web browser. You can then navigate to the app and start rating images.
