from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(".env.local")

# Connect to MongoDB
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["Publius"]
collection = db["images"]

# Get all images in the directory
images = os.listdir("./public/data")

# Iterate through each image and insert it into the database
for image in images:
    # Create a new document for each image
    doc = {
        "name": image,
        "elo": 1500,
    }

    # Insert the document into the collection
    collection.insert_one(doc)

    print(f"Inserted {image} into the database.")

print("All images have been added to the database.")
