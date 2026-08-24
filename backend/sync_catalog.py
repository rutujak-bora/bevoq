import asyncio
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from server import mongo_url, db_name, SAMPLE_COLLECTIONS, SAMPLE_PRODUCTS, slugify, now_iso

async def sync():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    for c in SAMPLE_COLLECTIONS:
        await db.collections.update_one(
            {"slug": c["slug"]},
            {
                "$set": {
                    "title": c["title"],
                    "slug": c["slug"],
                    "description": c["description"],
                    "banner_image": c.get("banner_image"),
                    "updated_at": now_iso()
                },
                "$setOnInsert": {
                    "id": str(uuid.uuid4()),
                    "created_at": now_iso()
                }
            },
            upsert=True
        )
    print("Collections updated.")

    for p in SAMPLE_PRODUCTS:
        slug = slugify(p["title"])
        await db.products.update_one(
            {"slug": slug},
            {
                "$set": {
                    "slug": slug,
                    "status": "active",
                    "updated_at": now_iso(),
                    **p
                },
                "$setOnInsert": {
                    "id": str(uuid.uuid4()),
                    "created_at": now_iso()
                }
            },
            upsert=True
        )
    print("Products updated.")
    client.close()

if __name__ == "__main__":
    asyncio.run(sync())
