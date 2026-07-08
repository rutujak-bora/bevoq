"""BEVOQ E-commerce Backend - FastAPI + MongoDB"""
from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# =========================
# Setup
# =========================
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
ACCESS_TOKEN_MIN = 60 * 24 * 7  # 7 days

app = FastAPI(title="BEVOQ API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("bevoq")


# =========================
# Helpers
# =========================
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), h.encode())
    except Exception:
        return False


def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MIN),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])


def clean_doc(d: dict) -> dict:
    if not d:
        return d
    d.pop('_id', None)
    d.pop('password_hash', None)
    return d


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(401, "User not found")
    return clean_doc(user)


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin access required")
    return user


# =========================
# Models
# =========================
class Address(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str = "Home"
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    pincode: str
    country: str = "India"


class RegisterInput(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    address: Optional[Address] = None


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UpdateProfileInput(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None


class AddressInput(BaseModel):
    label: str = "Home"
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    pincode: str
    country: str = "India"


class ChangePasswordInput(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordInput(BaseModel):
    email: EmailStr


class ResetPasswordInput(BaseModel):
    token: str
    new_password: str


class ProductVariant(BaseModel):
    size: Optional[str] = None
    color: Optional[str] = None
    stock: int = 0
    sku: Optional[str] = None


class ProductInput(BaseModel):
    title: str
    slug: Optional[str] = None
    description: str = ""
    price: float
    compare_at_price: Optional[float] = None
    sku: Optional[str] = None
    stock: int = 0
    category: str = "General"
    tags: List[str] = []
    sizes: List[str] = []
    colors: List[str] = []
    images: List[str] = []
    status: str = "active"  # active | draft
    collections: List[str] = []  # collection slugs
    featured: bool = False
    trending: bool = False
    best_selling: bool = False


class CollectionInput(BaseModel):
    title: str
    slug: str
    description: str = ""
    banner_image: Optional[str] = None


class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None


class CheckoutInput(BaseModel):
    items: List[CartItem]
    address: AddressInput
    payment_method: str  # cod | upi | card | razorpay
    coupon_code: Optional[str] = None
    email: Optional[EmailStr] = None  # for guest checkout


class OrderStatusUpdate(BaseModel):
    status: str  # placed, processing, shipped, delivered, cancelled, refunded


class NewsletterInput(BaseModel):
    email: EmailStr


# =========================
# Auth Endpoints
# =========================
def slugify(s: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in s.lower()).strip("-")


def _set_cookie(resp: Response, token: str):
    resp.set_cookie(
        key="access_token", value=token,
        httponly=True, secure=False, samesite="lax",
        max_age=ACCESS_TOKEN_MIN * 60, path="/"
    )


@api.post("/auth/register")
async def register(inp: RegisterInput, response: Response):
    email = inp.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(400, "Email already registered")
    uid = str(uuid.uuid4())
    addresses = [inp.address.model_dump()] if inp.address else []
    user_doc = {
        "id": uid,
        "email": email,
        "name": inp.name,
        "phone": inp.phone,
        "password_hash": hash_password(inp.password),
        "role": "customer",
        "addresses": addresses,
        "created_at": now_iso(),
    }
    await db.users.insert_one(user_doc)
    token = create_token(uid, "customer")
    _set_cookie(response, token)
    return {"user": clean_doc(user_doc), "token": token}


@api.post("/auth/login")
async def login(inp: LoginInput, response: Response):
    email = inp.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(inp.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_token(user["id"], user["role"])
    _set_cookie(response, token)
    return {"user": clean_doc(user), "token": token}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api.put("/auth/profile")
async def update_profile(inp: UpdateProfileInput, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in inp.model_dump(exclude_none=True).items()}
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
    updated = await db.users.find_one({"id": user["id"]})
    return clean_doc(updated)


@api.post("/auth/change-password")
async def change_password(inp: ChangePasswordInput, user: dict = Depends(get_current_user)):
    full = await db.users.find_one({"id": user["id"]})
    if not verify_password(inp.current_password, full["password_hash"]):
        raise HTTPException(400, "Current password incorrect")
    await db.users.update_one({"id": user["id"]}, {"$set": {"password_hash": hash_password(inp.new_password)}})
    return {"ok": True}


@api.post("/auth/forgot-password")
async def forgot_password(inp: ForgotPasswordInput):
    user = await db.users.find_one({"email": inp.email.lower()})
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_resets.insert_one({
            "token": token,
            "user_id": user["id"],
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
            "used": False,
        })
        logger.info(f"[MOCK EMAIL] Password reset link for {inp.email}: /reset-password?token={token}")
    return {"ok": True, "message": "If email exists, reset link has been sent"}


@api.post("/auth/reset-password")
async def reset_password(inp: ResetPasswordInput):
    rec = await db.password_resets.find_one({"token": inp.token, "used": False})
    if not rec:
        raise HTTPException(400, "Invalid or used token")
    if datetime.fromisoformat(rec["expires_at"]) < datetime.now(timezone.utc):
        raise HTTPException(400, "Token expired")
    await db.users.update_one({"id": rec["user_id"]}, {"$set": {"password_hash": hash_password(inp.new_password)}})
    await db.password_resets.update_one({"token": inp.token}, {"$set": {"used": True}})
    return {"ok": True}


# Address book
@api.get("/auth/addresses")
async def list_addresses(user: dict = Depends(get_current_user)):
    return user.get("addresses", [])


@api.post("/auth/addresses")
async def add_address(inp: AddressInput, user: dict = Depends(get_current_user)):
    addr = {"id": str(uuid.uuid4()), **inp.model_dump()}
    await db.users.update_one({"id": user["id"]}, {"$push": {"addresses": addr}})
    return addr


@api.delete("/auth/addresses/{addr_id}")
async def delete_address(addr_id: str, user: dict = Depends(get_current_user)):
    await db.users.update_one({"id": user["id"]}, {"$pull": {"addresses": {"id": addr_id}}})
    return {"ok": True}


# =========================
# Products (Public)
# =========================
@api.get("/products")
async def list_products(
    category: Optional[str] = None,
    collection: Optional[str] = None,
    size: Optional[str] = None,
    color: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    trending: Optional[bool] = None,
    best_selling: Optional[bool] = None,
    featured: Optional[bool] = None,
    sort: str = "newest",
    limit: int = 100,
):
    q: dict = {"status": "active"}
    if category:
        q["category"] = category
    if collection:
        q["collections"] = collection
    if size:
        q["sizes"] = size
    if color:
        q["colors"] = color
    if min_price is not None or max_price is not None:
        q["price"] = {}
        if min_price is not None:
            q["price"]["$gte"] = min_price
        if max_price is not None:
            q["price"]["$lte"] = max_price
    if search:
        q["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
        ]
    if trending:
        q["trending"] = True
    if best_selling:
        q["best_selling"] = True
    if featured:
        q["featured"] = True

    sort_map = {
        "newest": [("created_at", -1)],
        "price_asc": [("price", 1)],
        "price_desc": [("price", -1)],
        "name_asc": [("title", 1)],
    }
    cursor = db.products.find(q, {"_id": 0}).sort(sort_map.get(sort, sort_map["newest"])).limit(limit)
    return await cursor.to_list(limit)


@api.get("/products/{slug}")
async def get_product(slug: str):
    p = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Product not found")
    return p


# =========================
# Collections (Public)
# =========================
@api.get("/collections")
async def list_collections():
    cursor = db.collections.find({}, {"_id": 0}).sort([("created_at", -1)])
    return await cursor.to_list(200)


@api.get("/collections/{slug}")
async def get_collection(slug: str):
    c = await db.collections.find_one({"slug": slug}, {"_id": 0})
    if not c:
        raise HTTPException(404, "Collection not found")
    products = await db.products.find({"collections": slug, "status": "active"}, {"_id": 0}).to_list(200)
    return {"collection": c, "products": products}


# =========================
# Search
# =========================
@api.get("/search/suggestions")
async def suggestions():
    return {"trending": ["t-shirt", "dress", "crop top", "hoodie", "women's wear"]}


# =========================
# Newsletter
# =========================
@api.post("/newsletter/subscribe")
async def subscribe(inp: NewsletterInput):
    existing = await db.newsletter.find_one({"email": inp.email.lower()})
    if not existing:
        await db.newsletter.insert_one({"email": inp.email.lower(), "created_at": now_iso()})
    return {"ok": True, "discount_code": "WELCOME10"}


# =========================
# Wishlist (authenticated)
# =========================
@api.get("/wishlist")
async def get_wishlist(user: dict = Depends(get_current_user)):
    items = await db.wishlist.find({"user_id": user["id"]}, {"_id": 0}).to_list(500)
    slugs = [i["product_slug"] for i in items]
    products = await db.products.find({"slug": {"$in": slugs}}, {"_id": 0}).to_list(500)
    return products


@api.post("/wishlist/{slug}")
async def add_wishlist(slug: str, user: dict = Depends(get_current_user)):
    existing = await db.wishlist.find_one({"user_id": user["id"], "product_slug": slug})
    if not existing:
        await db.wishlist.insert_one({"user_id": user["id"], "product_slug": slug, "created_at": now_iso()})
    return {"ok": True}


@api.delete("/wishlist/{slug}")
async def remove_wishlist(slug: str, user: dict = Depends(get_current_user)):
    await db.wishlist.delete_one({"user_id": user["id"], "product_slug": slug})
    return {"ok": True}


# =========================
# Checkout / Orders
# =========================
def calc_delivery(subtotal: float) -> float:
    return 0.0 if subtotal >= 999 else 79.0


@api.post("/checkout")
async def checkout(inp: CheckoutInput, request: Request):
    # allow guest checkout
    user = None
    try:
        user = await get_current_user(request)
    except HTTPException:
        pass

    if not inp.items:
        raise HTTPException(400, "Cart is empty")

    # Fetch products & compute totals
    order_items = []
    subtotal = 0.0
    for it in inp.items:
        p = await db.products.find_one({"id": it.product_id}, {"_id": 0})
        if not p:
            raise HTTPException(400, f"Product not found: {it.product_id}")
        if p.get("stock", 0) < it.quantity:
            raise HTTPException(400, f"Insufficient stock for {p['title']}")
        item_price = float(p["price"])
        subtotal += item_price * it.quantity
        order_items.append({
            "product_id": p["id"],
            "slug": p["slug"],
            "title": p["title"],
            "image": (p.get("images") or [None])[0],
            "price": item_price,
            "quantity": it.quantity,
            "size": it.size,
            "color": it.color,
        })
        # Decrement stock
        await db.products.update_one({"id": p["id"]}, {"$inc": {"stock": -it.quantity}})

    delivery = calc_delivery(subtotal)
    discount = 0.0
    if inp.coupon_code and inp.coupon_code.upper() == "WELCOME10":
        discount = round(subtotal * 0.10, 2)
    total = subtotal + delivery - discount

    order_id = str(uuid.uuid4())
    order_no = "BEVOQ-" + order_id[:8].upper()
    order = {
        "id": order_id,
        "order_no": order_no,
        "user_id": user["id"] if user else None,
        "email": (user["email"] if user else inp.email) if user or inp.email else None,
        "items": order_items,
        "address": inp.address.model_dump(),
        "subtotal": subtotal,
        "delivery": delivery,
        "discount": discount,
        "total": total,
        "payment_method": inp.payment_method,
        "payment_status": "pending" if inp.payment_method == "cod" else "paid",  # mocked
        "status": "placed",
        "created_at": now_iso(),
        "updated_at": now_iso(),
        "status_history": [{"status": "placed", "at": now_iso()}],
    }
    await db.orders.insert_one(order.copy())

    # Save payment record
    await db.payments.insert_one({
        "id": str(uuid.uuid4()),
        "order_id": order_id,
        "order_no": order_no,
        "user_id": order["user_id"],
        "amount": total,
        "method": inp.payment_method,
        "status": order["payment_status"],
        "created_at": now_iso(),
    })

    # MOCK: send confirmation email
    logger.info(f"[MOCK EMAIL] Order confirmation sent to {order['email']} - Order {order_no} - Total ₹{total}")
    logger.info(f"[MOCK EMAIL] Internal notification to admin: New order {order_no}")

    return clean_doc(order)


@api.get("/orders")
async def my_orders(user: dict = Depends(get_current_user)):
    cursor = db.orders.find({"user_id": user["id"]}, {"_id": 0}).sort([("created_at", -1)])
    return await cursor.to_list(500)


@api.get("/orders/{order_id}")
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Order not found")
    if o.get("user_id") != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Forbidden")
    return o


# =========================
# ADMIN Endpoints
# =========================
@api.get("/admin/dashboard/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": {"$in": ["placed", "processing"]}})
    total_customers = await db.users.count_documents({"role": "customer"})
    low_stock_products = await db.products.count_documents({"stock": {"$lte": 5}, "status": "active"})

    revenue_cursor = db.orders.find({"payment_status": "paid"}, {"total": 1, "_id": 0})
    revenue_docs = await revenue_cursor.to_list(10000)
    total_revenue = sum(d.get("total", 0) for d in revenue_docs)

    # last 7 days revenue
    from collections import defaultdict
    by_day: dict = defaultdict(float)
    cursor = db.orders.find({}, {"created_at": 1, "total": 1, "_id": 0})
    async for o in cursor:
        try:
            d = datetime.fromisoformat(o["created_at"]).date().isoformat()
            by_day[d] += o.get("total", 0)
        except Exception:
            pass
    today = datetime.now(timezone.utc).date()
    chart = []
    for i in range(6, -1, -1):
        d = (today - timedelta(days=i)).isoformat()
        chart.append({"date": d, "revenue": round(by_day.get(d, 0.0), 2)})

    recent_orders = await db.orders.find({}, {"_id": 0}).sort([("created_at", -1)]).limit(5).to_list(5)
    recent_customers = await db.users.find({"role": "customer"}, {"_id": 0, "password_hash": 0}).sort([("created_at", -1)]).limit(5).to_list(5)

    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_customers": total_customers,
        "low_stock_products": low_stock_products,
        "revenue_chart": chart,
        "recent_orders": recent_orders,
        "recent_customers": recent_customers,
    }


# --- Admin Products ---
@api.get("/admin/products")
async def admin_list_products(admin: dict = Depends(require_admin)):
    return await db.products.find({}, {"_id": 0}).sort([("created_at", -1)]).to_list(1000)


@api.post("/admin/products")
async def admin_create_product(inp: ProductInput, admin: dict = Depends(require_admin)):
    slug = inp.slug or slugify(inp.title)
    existing = await db.products.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    doc = {
        "id": str(uuid.uuid4()),
        "slug": slug,
        **inp.model_dump(exclude={"slug"}),
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.products.insert_one(doc.copy())
    doc.pop('_id', None)
    return doc


@api.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, inp: ProductInput, admin: dict = Depends(require_admin)):
    updates = inp.model_dump(exclude_none=True)
    updates["updated_at"] = now_iso()
    if inp.slug:
        updates["slug"] = inp.slug
    else:
        updates.pop("slug", None)
    await db.products.update_one({"id": product_id}, {"$set": updates})
    return await db.products.find_one({"id": product_id}, {"_id": 0})


@api.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, admin: dict = Depends(require_admin)):
    await db.products.delete_one({"id": product_id})
    return {"ok": True}


# --- Admin Collections ---
@api.get("/admin/collections")
async def admin_list_collections(admin: dict = Depends(require_admin)):
    return await db.collections.find({}, {"_id": 0}).sort([("created_at", -1)]).to_list(500)


@api.post("/admin/collections")
async def admin_create_collection(inp: CollectionInput, admin: dict = Depends(require_admin)):
    slug = inp.slug or slugify(inp.title)
    if await db.collections.find_one({"slug": slug}):
        raise HTTPException(400, "Collection slug already exists")
    doc = {
        "id": str(uuid.uuid4()),
        **inp.model_dump(),
        "slug": slug,
        "created_at": now_iso(),
    }
    await db.collections.insert_one(doc.copy())
    doc.pop('_id', None)
    return doc


@api.put("/admin/collections/{col_id}")
async def admin_update_collection(col_id: str, inp: CollectionInput, admin: dict = Depends(require_admin)):
    await db.collections.update_one({"id": col_id}, {"$set": inp.model_dump()})
    return await db.collections.find_one({"id": col_id}, {"_id": 0})


@api.delete("/admin/collections/{col_id}")
async def admin_delete_collection(col_id: str, admin: dict = Depends(require_admin)):
    await db.collections.delete_one({"id": col_id})
    return {"ok": True}


# --- Admin Orders ---
@api.get("/admin/orders")
async def admin_list_orders(
    status: Optional[str] = None,
    admin: dict = Depends(require_admin),
):
    q: dict = {}
    if status:
        q["status"] = status
    return await db.orders.find(q, {"_id": 0}).sort([("created_at", -1)]).to_list(1000)


@api.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, inp: OrderStatusUpdate, admin: dict = Depends(require_admin)):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(404, "Order not found")
    await db.orders.update_one(
        {"id": order_id},
        {
            "$set": {"status": inp.status, "updated_at": now_iso()},
            "$push": {"status_history": {"status": inp.status, "at": now_iso()}},
        },
    )
    logger.info(f"[MOCK EMAIL] Order {order.get('order_no')} status updated to {inp.status} — sent to {order.get('email')}")
    return await db.orders.find_one({"id": order_id}, {"_id": 0})


# --- Admin Customers ---
@api.get("/admin/customers")
async def admin_customers(admin: dict = Depends(require_admin)):
    users = await db.users.find({"role": "customer"}, {"_id": 0, "password_hash": 0}).sort([("created_at", -1)]).to_list(1000)
    # compute total spend
    for u in users:
        spend_cursor = db.orders.find({"user_id": u["id"], "payment_status": "paid"}, {"total": 1, "_id": 0})
        docs = await spend_cursor.to_list(1000)
        u["total_spend"] = round(sum(d.get("total", 0) for d in docs), 2)
        u["order_count"] = await db.orders.count_documents({"user_id": u["id"]})
    return users


@api.get("/admin/customers/{user_id}")
async def admin_customer_detail(user_id: str, admin: dict = Depends(require_admin)):
    u = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not u:
        raise HTTPException(404, "Customer not found")
    orders = await db.orders.find({"user_id": user_id}, {"_id": 0}).sort([("created_at", -1)]).to_list(500)
    return {"customer": u, "orders": orders}


# --- Admin Payments ---
@api.get("/admin/payments")
async def admin_payments(admin: dict = Depends(require_admin)):
    return await db.payments.find({}, {"_id": 0}).sort([("created_at", -1)]).to_list(1000)


# =========================
# Seed data
# =========================
SAMPLE_PRODUCTS = [
    {
        "title": "Ivory Silk Midi Dress", "category": "Dresses", "price": 3499, "compare_at_price": 4999,
        "stock": 25, "sizes": ["XS", "S", "M", "L"], "colors": ["Ivory", "Champagne"],
        "collections": ["women", "trending"], "featured": True, "trending": True, "tags": ["dress", "silk", "midi"],
        "description": "An effortlessly elegant midi silhouette crafted in liquid silk. Designed for evenings that matter.",
        "images": [
            "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=1200&q=85",
            "https://images.unsplash.com/photo-1610312774212-6bde94e8c0b0?w=1200&q=85",
        ],
    },
    {
        "title": "Classic White Cotton Tee", "category": "T-Shirts", "price": 899, "compare_at_price": 1299,
        "stock": 80, "sizes": ["S", "M", "L", "XL"], "colors": ["White", "Black", "Beige"],
        "collections": ["t-shirts", "best-selling"], "best_selling": True, "featured": True, "tags": ["tee", "cotton", "essentials"],
        "description": "The elevated basic. 100% combed cotton, tailored fit, made to layer.",
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=85",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=85",
        ],
    },
    {
        "title": "Champagne Crop Top", "category": "Crop Tops", "price": 1499,
        "stock": 40, "sizes": ["XS", "S", "M"], "colors": ["Champagne", "Rose"],
        "collections": ["women", "crop-tops", "trending"], "trending": True, "tags": ["crop", "party"],
        "description": "A refined crop silhouette in champagne satin — the piece your wardrobe was waiting for.",
        "images": [
            "https://images.unsplash.com/photo-1762343949052-c086a93fceac?w=1200&q=85",
        ],
    },
    {
        "title": "Midnight Wool Hoodie", "category": "Hoodies", "price": 2799, "compare_at_price": 3499,
        "stock": 30, "sizes": ["S", "M", "L", "XL"], "colors": ["Navy", "Black"],
        "collections": ["hoodies", "best-selling"], "best_selling": True, "tags": ["hoodie", "wool"],
        "description": "Heavyweight merino-blend hoodie in deep navy. Quiet luxury, all season.",
        "images": [
            "https://images.unsplash.com/photo-1760551733073-dd140353506b?w=1200&q=85",
        ],
    },
    {
        "title": "Oversized Graphic Tee", "category": "T-Shirts", "price": 1199,
        "stock": 60, "sizes": ["M", "L", "XL"], "colors": ["Black", "Cream"],
        "collections": ["t-shirts", "trending"], "trending": True, "tags": ["tee", "oversized"],
        "description": "Streetwear staple with editorial graphic print — relaxed, unbothered, iconic.",
        "images": [
            "https://images.unsplash.com/photo-1721637686340-de9f8cebda5a?w=1200&q=85",
        ],
    },
    {
        "title": "Signature Black Crew", "category": "T-Shirts", "price": 999,
        "stock": 70, "sizes": ["S", "M", "L", "XL"], "colors": ["Black"],
        "collections": ["t-shirts", "best-selling"], "best_selling": True, "tags": ["tee", "black"],
        "description": "The perfect black tee. Cut from Peruvian pima cotton with a soft, drapey hand.",
        "images": [
            "https://images.unsplash.com/photo-1627225925683-1da7021732ea?w=1200&q=85",
        ],
    },
    {
        "title": "Rose Chiffon Blouse", "category": "Tops", "price": 1899,
        "stock": 22, "sizes": ["XS", "S", "M", "L"], "colors": ["Rose", "White"],
        "collections": ["women", "trending"], "trending": True, "featured": True, "tags": ["blouse", "chiffon"],
        "description": "A soft, flowing blouse in blush chiffon. Weightless elegance, wear it anywhere.",
        "images": [
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85",
        ],
    },
    {
        "title": "Camel Wool Coat", "category": "Outerwear", "price": 6499, "compare_at_price": 8499,
        "stock": 12, "sizes": ["S", "M", "L"], "colors": ["Camel", "Black"],
        "collections": ["women", "outerwear"], "featured": True, "tags": ["coat", "wool", "outerwear"],
        "description": "A timeless investment coat in Italian wool. Structured shoulders, minimalist lines.",
        "images": [
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=85",
        ],
    },
]

SAMPLE_COLLECTIONS = [
    {"title": "Women", "slug": "women", "description": "Curated pieces for the modern woman.",
     "banner_image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85"},
    {"title": "T-Shirts", "slug": "t-shirts", "description": "Elevated everyday essentials.",
     "banner_image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=85"},
    {"title": "Hoodies", "slug": "hoodies", "description": "Quiet-luxury warmth.",
     "banner_image": "https://images.unsplash.com/photo-1760551733073-dd140353506b?w=1600&q=85"},
    {"title": "Crop Tops", "slug": "crop-tops", "description": "Refined silhouettes for statement moments.",
     "banner_image": "https://images.unsplash.com/photo-1762343949052-c086a93fceac?w=1600&q=85"},
    {"title": "Trending", "slug": "trending", "description": "What's moving this season.", "banner_image": None},
    {"title": "Best Selling", "slug": "best-selling", "description": "Customer favourites.", "banner_image": None},
    {"title": "Outerwear", "slug": "outerwear", "description": "Layers with intention.", "banner_image": None},
]


async def seed():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("slug", unique=True)
    await db.collections.create_index("slug", unique=True)

    # Admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@bevoq.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "BEVOQ Admin",
            "phone": "+91-0000000000",
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "addresses": [],
            "created_at": now_iso(),
        })
        logger.info(f"Seeded admin: {admin_email}")

    # Test customer
    if not await db.users.find_one({"email": "customer@bevoq.com"}):
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": "customer@bevoq.com",
            "name": "Test Customer",
            "phone": "+91-9999999999",
            "password_hash": hash_password("Customer@123"),
            "role": "customer",
            "addresses": [{
                "id": str(uuid.uuid4()),
                "label": "Home",
                "full_name": "Test Customer",
                "phone": "+91-9999999999",
                "street": "123 Marine Drive",
                "city": "Mumbai",
                "state": "Maharashtra",
                "pincode": "400001",
                "country": "India",
            }],
            "created_at": now_iso(),
        })

    # Collections
    for c in SAMPLE_COLLECTIONS:
        if not await db.collections.find_one({"slug": c["slug"]}):
            await db.collections.insert_one({
                "id": str(uuid.uuid4()),
                **c,
                "created_at": now_iso(),
            })

    # Products
    for p in SAMPLE_PRODUCTS:
        slug = slugify(p["title"])
        if not await db.products.find_one({"slug": slug}):
            doc = {
                "id": str(uuid.uuid4()),
                "slug": slug,
                "status": "active",
                "compare_at_price": p.get("compare_at_price"),
                "sku": None,
                "featured": p.get("featured", False),
                "trending": p.get("trending", False),
                "best_selling": p.get("best_selling", False),
                "created_at": now_iso(),
                "updated_at": now_iso(),
                **p,
            }
            await db.products.insert_one(doc)


@app.on_event("startup")
async def on_startup():
    await seed()
    logger.info("BEVOQ backend ready")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


@api.get("/")
async def root():
    return {"message": "BEVOQ API"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
