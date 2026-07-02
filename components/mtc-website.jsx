"use client";
import React, { useState, useMemo, useEffect } from "react";
/* ============================================================
MTC — MATCHA THE CLUB
Ordering site, GrabFood-style continuous menu.
Edit MENU_ITEMS / ADDONS / CATEGORIES / BLENDS below to update content.
============================================================ */
const C = {
green: "#56a267",
greenDark: "#073c2f",
cream: "#ffffec",
beige: "#f9f5eb",
brown: "#6f463c",
zalo: "#0068ff",
};
// TODO: thay bằng link Zalo OA / số điện thoại Zalo thật của quán
// Có thể lấy dạng: https://zalo.me/<so_dien_thoai> hoặc https://zalo.me/<oaid_cua_OA>
const ZALO_LINK = "https://zalo.me/0899046468";
// Mã QR chuyển khoản (VietQR) — hiện ra sau khi khách đặt hàng thành công
const PAYMENT_QR_DATA_URI = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEB
// Số điện thoại quán để khách liên hệ / gọi trực tiếp
const SHOP_PHONE_DISPLAY = "0899 046 468";
const SHOP_PHONE_TEL = "+84899046468";
// URL Google Apps Script Web App nhận đơn hàng (xem hướng dẫn setup ở cuối file)
const ORDER_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxLdyaJISG2Vb18IRwdqNcM
/* ---------- UI STRINGS ---------- */
const STR = {
vi: {
search: "Tìm món...",
cart: "Giỏ hàng",
items: "món",
empty: "Giỏ hàng đang trống.",
addToCart: "Thêm vào giỏ",
addons: "Add-on",
blend: "Chọn blend matcha",
size: "Chọn size",
mở ra
sweetness: "Độ ngọt",
ice: "Đá",
qty: "Số lượng",
checkout: "Đặt hàng",
orderInfo: "Thông tin đặt hàng",
name: "Họ tên",
phone: "Số điện thoại",
method: "Hình thức nhận",
note: "Ghi chú (tuỳ chọn)",
notePlaceholder: "Yêu cầu khác (nếu có)...",
chooseDrink: "Chọn 1 nước bất kỳ",
chooseSnack: "Chọn 1 bánh bất kỳ",
chooseDrink1: "Chọn matcha thứ 1",
chooseDrink2: "Chọn matcha thứ 2",
freeTea: "Trà trái cây tặng kèm",
comboDiscount: "Giảm",
comboFree: "Tặng",
confirm: "Xác nhận đơn hàng",
thanks: "Cảm ơn bạn! ",
thanksSub: "Bấm nút bên dưới để gửi đơn cho MTC qua Zalo nhé.",
copy: "Sao chép đơn hàng",
copied: "Đã sao chép ✓",
sendZalo: "Gửi đơn qua Zalo",
zaloNote: "Đơn hàng đã được sao chép — chỉ cần dán (paste) vào khung chat Zalo vừa newOrder: "Xong, đặt đơn mới",
total: "Tổng cộng",
tabMenu: "Menu",
tabAbout: "Giới thiệu",
tabLocation: "Location",
takeaway: "Pick-up tại quán",
delivery: "Delivery",
deliveryAddress: "Địa chỉ giao hàng",
addressPlaceholder: "Số nhà, đường, phường...",
shipNote: "Phí ship tính theo phí ứng dụng giao hàng tại thời điểm đặt. Freeship trong bá
orderSuccess: "Đặt hàng thành công! ",
orderSuccessSub: "Quán đã nhận được đơn của bạn. Quét mã bên dưới để thanh toán nhé.",
scanToPay: "Quét mã để thanh toán",
transferNote: "Vui lòng ghi chú trong nội dung chuyển khoản: Họ tên + Số điện thoại. Quán
needHelp: "Cần hỗ trợ? Gọi cho quán",
backupTitle: "Phòng khi cần, bạn cũng có thể",
sending: "Đang gửi đơn...",
story: "our story",
address: "Địa chỉ",
hours: "Giờ mở cửa",
ig: "Instagram",
noResults: "Không tìm thấy món phù hợp.",
remove: "Xóa",
included: "miễn phí",
heroTag: "A modern matcha takeaway concept designed for office rituals, creative breaks,
},
en: {
search: "Search dishes...",
cart: "Cart",
items: "items",
empty: "Your cart is empty.",
addToCart: "Add to cart",
addons: "Add-ons",
blend: "Choose matcha blend",
size: "Choose size",
sweetness: "Sweetness",
ice: "Ice",
qty: "Quantity",
checkout: "Checkout",
orderInfo: "Order details",
name: "Full name",
phone: "Phone number",
method: "Pickup method",
note: "Note (optional)",
notePlaceholder: "Any other request...",
chooseDrink: "Choose any 1 drink",
chooseSnack: "Choose any 1 snack",
chooseDrink1: "Choose matcha #1",
chooseDrink2: "Choose matcha #2",
freeTea: "Free fruit tea",
comboDiscount: "Off",
comboFree: "Free",
confirm: "Confirm order",
thanks: "Thank you! ",
thanksSub: "Tap the button below to send your order to MTC via Zalo.",
copy: "Copy order",
copied: "Copied ✓",
sendZalo: "Send order via Zalo",
zaloNote: "Your order has been copied — just paste it into the Zalo chat that opened and
newOrder: "Done, start a new order",
total: "Total",
tabMenu: "Menu",
tabAbout: "About",
tabLocation: "Location",
takeaway: "Pick-up at store",
delivery: "Delivery",
deliveryAddress: "Delivery address",
addressPlaceholder: "House no., street, ward...",
shipNote: "Delivery fee follows the delivery app's rate at the time of order. Freeship wi
orderSuccess: "Order placed! ",
orderSuccessSub: "MTC has received your order. Scan the code below to pay.",
scanToPay: "Scan to pay",
transferNote: "Please add your name & phone number as the transfer note. Our team will co
needHelp: "Need help? Call the shop",
backupTitle: "Just in case, you can also",
sending: "Sending order...",
story: "our story",
address: "Address",
hours: "Opening hours",
ig: "Instagram",
noResults: "No dishes found.",
remove: "Remove",
included: "included",
heroTag: "A modern ritual-driven takeaway concept for urban creatives.",
heroSub: "A little more joy every day, in a single cup.",
},
};
/* ---------- MENU DATA ---------- */
const CATEGORIES = [
{ id: "signature", emoji: " { id: "houjicha", emoji: " { id: "coldbrew", emoji: " { id: "seasonal", emoji: " { id: "coffee", emoji: " { id: "munchy", emoji: " { id: "combo", emoji: " } },
} },
", label: { en: "Signature Matcha", vi: "Signature Matcha" } }
", label: { en: "Houjicha", vi: "Houjicha" } },
", label: { en: "Cold Brew / Tea", vi: "Cold Brew / Tea" ", label: { en: "Seasonal Matcha", vi: "Seasonal Matcha" ", label: { en: "Coffee", vi: "Coffee" } },
", label: { en: "Munchy", vi: "Munchy" } },
", label: { en: "Combo", vi: "Combo" } },
];
// price/addon/blend values are in "k" VND (55 = 55,000). hasMatcha items show the blend pick
// badge = optional bilingual highlight pill (Best Seller / Must Try / etc.)
const MENU_ITEMS = [
{
id: "pure-latte",
category: "signature",
hasMatcha: true,
badge: { en: "Best Seller", vi: "Bán chạy nhất" },
name: { en: "Pure Matcha Latte", vi: "Pure Matcha Latte" },
desc: {
en: "Our bestseller. Rich Japanese matcha balanced with creamy milk. A smooth everyday
vi: "Món bán chạy nhất. Matcha Nhật đậm vị trà, cân bằng cùng sữa béo mịn. Classic, dễ
},
sizes: { M: 55, L: 75 },
},
{
id: "cold-whisked",
category: "signature",
},
{
},
{
},
{
},
{
hasMatcha: true,
badge: { en: "Must Try", vi: "Phải thử" },
name: { en: "Cold-Whisked Matcha", vi: "Cold-Whisked Matcha" },
desc: {
en: "For true matcha lovers. Cold-whisked for a richer texture and deeper tea finish.",
vi: "Dành cho người thích matcha đậm. Matcha đánh lạnh cho vị béo mịn, thơm và hậu trà
},
sizes: { M: 65, L: 85 },
id: "coco-cloud-matcha",
category: "signature",
hasMatcha: true,
name: { en: "Coco Cloud Matcha", vi: "Coco Cloud Matcha" },
desc: {
en: "Cold-whisked matcha topped with silky coconut foam. Light, refreshing and creamy."
vi: "Matcha đánh lạnh phủ lớp foam dừa béo mịn. Thanh mát, thơm nhẹ, cực hợp ngày nóng.
},
sizes: { M: 65, L: 85 },
id: "houjicha-latte",
category: "houjicha",
name: { en: "Houjicha Latte", vi: "Houjicha Latte" },
desc: {
en: "Low caffeine. Roasted tea with caramel notes and creamy milk.",
vi: "Ít caffeine. Hương trà rang thơm caramel, hậu vị khói nhẹ và béo mịn cùng sữa.",
},
sizes: { M: 55, L: 75 },
id: "coco-houjicha",
category: "houjicha",
name: { en: "Coco Houjicha", vi: "Coco Houjicha" },
desc: {
en: "Roasted houjicha paired with refreshing coconut and creamy foam.",
vi: "Houjicha rang thơm kết hợp nước dừa thanh mát và lớp foam béo nhẹ.",
},
sizes: { M: 65, L: 85 },
id: "raw-cold-brew-coffee",
category: "coldbrew",
name: { en: "Raw Cold Brew Coffee", vi: "Raw Cold Brew Coffee" },
desc: {
en: "24-hour cold brewed Arabica with chocolate and caramel notes. Smooth and low bitte
vi: "100% Arabica ủ lạnh 24h. Ít đắng, hậu chocolate và caramel, uống cực mượt.",
},
{
},
{
},
{
},
{
},
{
},
sizes: { M: 55, L: 75 },
note: { en: "100% Arabica, cold brewed 24h", vi: "100% Arabica, ủ lạnh 24h" },
id: "coco-cold-brew",
category: "coldbrew",
name: { en: "Coco Cold Brew", vi: "Coco Cold Brew" },
desc: {
en: "24-hour cold brewed Arabica blended with refreshing coconut water. Smooth, light a
vi: "Cold brew Arabica 24h hòa cùng nước dừa tươi. Thanh mát, ít đắng, hậu vị béo nhẹ v
},
sizes: { M: 45, L: 65 },
id: "star-fruit-cold-brew",
category: "coldbrew",
badge: { en: "Best Seller", vi: "Bán chạy nhất" },
name: { en: "Star Fruit Cold Brew", vi: "Star Fruit Cold Brew" },
desc: {
en: "24-hour cold brewed Arabica paired with fresh starfruit. Bright, refreshing vi: "Cold brew Arabica 24h kết hợp khế chua ngọt tự nhiên. Vị trái cây thanh mát and na
làm nổ
},
sizes: { M: 65, L: 85 },
note: { en: "100% Arabica, cold brewed 24h", vi: "100% Arabica, ủ lạnh 24h" },
id: "yuzu-cold-brew",
category: "coldbrew",
name: { en: "Yuzu Cold Brew", vi: "Yuzu Cold Brew" },
desc: {
en: "Cold brewed Arabica infused with aromatic yuzu. Bright citrus notes with a clean,
vi: "Cold brew Arabica kết hợp thanh yên thơm tinh dầu. Chua thanh, thơm dịu và cực sản
},
sizes: { M: 65, L: 85 },
id: "star-fruit-tea",
category: "coldbrew",
name: { en: "Star Fruit Tea", vi: "Star Fruit Tea" },
desc: {
en: "Refreshing tea with the natural sweet-tart flavor of fresh starfruit. Light, vibra
vi: "Trà khế thanh mát với vị chua ngọt tự nhiên từ khế tươi. Dễ uống, giải nhiệt và cự
},
sizes: { M: 45, L: 65 },
},
{
},
{
},
{
},
{
id: "yuzu-tea",
category: "coldbrew",
name: { en: "Yuzu Tea", vi: "Yuzu Tea" },
desc: {
en: "Fragrant yuzu tea with bright citrus aroma, balanced sweetness and a refreshing fi
vi: "Trà thanh yên thơm dịu hương vỏ cam chanh, chua thanh và ngọt nhẹ. Món trà tươi má
},
sizes: { M: 65, L: 85 },
id: "corn-vanilla-matcha",
category: "seasonal",
hasMatcha: true,
badge: { en: "Best Seller", vi: "Bán chạy nhất" },
name: { en: "Corn & Vanilla Matcha", vi: "Corn & Vanilla Matcha" },
desc: {
en: "Sweet corn and vanilla blended with premium matcha. Comforting and unique.",
vi: "Vị ngô ngọt tự nhiên, vani thơm nhẹ hòa cùng matcha Nhật. Vừa lạ vừa dễ ghiền.",
},
sizes: { M: 65, L: 85 },
id: "mango-matcha",
category: "seasonal",
hasMatcha: true,
badge: { en: "Best Seller", vi: "Bán chạy nhất" },
name: { en: "Mango Matcha Latte", vi: "Mango Matcha Latte" },
desc: {
en: "Japanese matcha paired with ripe mango and creamy milk. A summer favorite.",
vi: "Matcha Nhật hòa cùng xoài chín ngọt tự nhiên và lớp sữa béo mịn. Bestseller mùa hè
},
sizes: { M: 65, L: 85 },
id: "strawberry-matcha",
category: "seasonal",
hasMatcha: true,
name: { en: "Strawberry Matcha", vi: "Strawberry Matcha" },
desc: {
en: "Homemade strawberry jam layered with creamy milk and matcha.",
vi: "Mứt dâu nhà làm chua ngọt nhẹ cân bằng cùng matcha và sữa béo.",
},
sizes: { M: 65, L: 85 },
id: "banana-matcha",
category: "seasonal",
},
{
},
{
},
{
},
{
hasMatcha: true,
name: { en: "Banana Matcha Latte", vi: "Banana Matcha Latte" },
desc: {
en: "Ripe banana naturally softens matcha's boldness. Perfect for beginners.",
vi: "Chuối chín thơm ngọt giúp cân bằng vị matcha. Hoàn hảo cho người mới uống matcha."
},
sizes: { M: 65, L: 85 },
id: "banana-caramel-coffee",
category: "coffee",
badge: { en: "Best Seller", vi: "Bán chạy nhất" },
name: { en: "Banana Caramel Coffee", vi: "Banana Caramel Coffee" },
desc: {
en: "Espresso with homemade ripe banana sauce and caramel. Naturally sweet, smooth and
vi: "Cà phê đậm vị kết hợp sốt chuối nhà làm từ chuối chín, caramel thơm dịu. Ngọt tự n
},
sizes: { M: 55, L: 75 },
id: "sea-salt-cream-coffee",
category: "coffee",
name: { en: "Sea Salt Cream Coffee", vi: "Sea Salt Cream Coffee" },
desc: {
en: "Bold coffee topped with silky sea salt cream. A light salty finish enhances vi: "Cà phê đậm đà phủ lớp kem muối béo mịn. Vị mặn nhẹ giúp cân bằng vị ngọt và the co
làm nổ
},
sizes: { M: 55, L: 75 },
id: "brown-milk-coffee",
category: "coffee",
badge: { en: "Everyday Classic", vi: "Món quen mỗi ngày" },
name: { en: "Brown Milk Coffee", vi: "Brown Milk Coffee" },
desc: {
en: "Espresso balanced with creamy milk. Bold yet smooth for everyday enjoyment.",
vi: "Espresso hòa cùng sữa béo vừa đủ. Đậm vị cà phê nhưng vẫn mượt mà, dễ uống mỗi ngà
},
sizes: { M: 45, L: 65 },
id: "saigon-black",
category: "coffee",
badge: { en: "For Coffee Lovers", vi: "Dành cho tín đồ cà phê" },
name: { en: "Saigon Black Coffee", vi: "Saigon Black Coffee" },
desc: {
en: "100% Honey Robusta with dark chocolate notes and roasted wood finish. Crafted for
},
{
},
{
},
{
},
{
vi: "100% Robusta Honey. Đậm, mạnh, hậu vị chocolate đen và hương gỗ rang. Dành cho ngư
},
sizes: { M: 35, L: 55 },
note: {
en: "100% Robusta Honey \u2014 dark chocolate finish, roasted wood notes",
vi: "100% Robusta Honey, hậu vị chocolate đen, hương gỗ, hạt rang",
},
id: "grilled-cheese",
category: "munchy",
name: { en: "Grilled Cheese Sandwich", vi: "Grilled Cheese Sandwich" },
desc: {
en: "Golden toasted sandwich filled with melted cheese. Warm, comforting, and perfect w
vi: "Bánh mì nướng giòn với phô mai tan chảy béo mịn. Món ăn nhẹ nóng hổi, cực hợp khi
},
price: 35,
id: "ham-cheese",
category: "munchy",
name: { en: "Ham & Cheese Sandwich", vi: "Ham & Cheese Sandwich" },
desc: {
en: "Toasted sandwich with savory ham and melted cheese. Rich, satisfying, and perfect
vi: "Bánh mì nướng kẹp ham và phô mai tan chảy. Mặn mà, béo nhẹ và đủ năng lượng cho bữ
},
price: 45,
id: "breakfast-combo",
category: "combo",
isCombo: true,
comboType: "breakfast",
name: { en: "Breakfast Combo", vi: "Breakfast Combo" },
desc: {
en: "Pick any 1 drink + any 1 snack — get 10k off.",
vi: "Combo chọn 1 nước và 1 bánh bất kì, được giảm 10K.",
},
id: "team-break-combo",
category: "combo",
isCombo: true,
comboType: "teambreak",
name: { en: "Team Break Combo", vi: "Team Break Combo" },
desc: {
en: "2 matcha drinks — get 1 fruit tea free.",
vi: "Combo 2 matcha tặng 1 trà trái cây.",
},
},
];
// product photos keyed by item id (real Matcha The Club menu shots)
const ITEM_IMAGES = {
"pure-latte": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pure%20matcha%20latt
"cold-whisked": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coldwhisked%20matc
"coco-cloud-matcha": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coco%20matcha
"houjicha-latte": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/houjicha%20latte
"coco-houjicha": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coco%20houjicha-q
"raw-cold-brew-coffee": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca%CC%80%2
"coco-cold-brew": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coco%20coldbrew-
"star-fruit-cold-brew": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coldbrew%2
"yuzu-cold-brew": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coldbrew%20yuzu.
"star-fruit-tea": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tra%CC%80%20khe%
"yuzu-tea": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tra%CC%80%20yuzu-xLtco
"corn-vanilla-matcha": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/corn%20vani
"mango-matcha": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mango%20matcha.png
"strawberry-matcha": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/strawberry%20
"banana-matcha": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banana%20matcha%2
"banana-caramel-coffee": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banana%20
"sea-salt-cream-coffee": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca%CC%80%
"brown-milk-coffee": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca%CC%80%20ph
"saigon-black": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca%CC%80%20phe%CC%
"grilled-cheese": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled%20cheese
"ham-cheese": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ham%20%26%20cheese-p
};
// milk add-on prices vary by size (M/L)
const ADDONS = [
{ id: "meiji-milk", name: { en: "Meiji Milk", vi: "Meiji Milk" }, price: { M: 8, L: 15 } },
{ id: "vegan-milk", name: { en: "Vegan Milk", vi: "Vegan Milk" }, price: { M: 5, L: 10 } },
];
// matcha blend picker — shown as a topping choice on any item with hasMatcha: true
const BLENDS = [
{
id: "mori",
name: "Mori \u68ee",
sub: "Okumidori, Saemidori, Asanoka",
en: "Balanced, slightly bitter, rich umami, seaweed notes",
vi: "Cân bằng, chát nhẹ, umami, mùi tảo nhẹ",
price: { M: 0, L: 0 },
},
{
id: "hana",
name: "Hana \u82b1",
sub: "Saemidori, Yabukita, Yutakamidori",
en: "Sweet, bold tea, floral, refreshing finish",
vi: "Ngọt, đậm trà, hương hoa, thanh mát",
price: { M: 10, L: 15 },
},
{
id: "gyoku",
name: "Gyoku \u7389",
sub: "Asahi, Okumidori, Saemidori",
en: "Nutty, rich tea, sweet creamy finish",
vi: "Nutty, đậm trà, hậu ngọt, béo nhẹ",
price: { M: 25, L: 55 },
},
];
const getBlend = (id) => BLENDS.find((b) => b.id === id) || BLENDS[0];
// sweetness & ice — shown on any item that has sizes (i.e. is a drink)
const SWEETNESS_LEVELS = [
{ id: "none", label: { en: "No sugar", vi: "Không ngọt" } },
{ id: "less", label: { en: "Less sweet", vi: "Ít ngọt" } },
{ id: "normal", label: { en: "Normal sweet", vi: "Ngọt vừa" } },
{ id: "more", label: { en: "Extra sweet", vi: "Ngọt nhiều" } },
];
const ICE_LEVELS = [
{ id: "shared", label: { en: "Ice in cup", vi: "Đá chung" } },
{ id: "separate", label: { en: "Ice on the side", vi: "Đá riêng" } },
{ id: "none", label: { en: "No ice", vi: "Không đá" } },
];
const DEFAULT_SWEETNESS = "normal";
const DEFAULT_ICE = "shared";
const getSweetness = (id) => SWEETNESS_LEVELS.find((s) => s.id === id) || SWEETNESS_LEVELS[2]
const getIce = (id) => ICE_LEVELS.find((s) => s.id === id) || ICE_LEVELS[0];
// combo helper lists
const DRINK_ITEMS = MENU_ITEMS.filter((i) => i.sizes);
const SNACK_ITEMS = MENU_ITEMS.filter((i) => i.category === "munchy");
const MATCHA_ITEMS = MENU_ITEMS.filter((i) => i.hasMatcha);
const FREE_TEA_IDS = ["star-fruit-tea", "yuzu-tea"];
const FREE_TEA_ITEMS = MENU_ITEMS.filter((i) => FREE_TEA_IDS.includes(i.id));
const BREAKFAST_COMBO_DISCOUNT = 10; // k VND
const findItem = (id) => MENU_ITEMS.find((i) => i.id === id);
const fmt = (n) => n.toLocaleString("vi-VN") + "\u0111";
const priceFmt = (k) => fmt(k * 1000);
/* ---------- decorative flower doodle ---------- */
function Flower({ size = 40, color = C.cream, style }) {
return (
<svg width={size} height={size} viewBox="0 0 60 60" style={style} fill="none">
<g stroke={color} strokeWidth="2.2" strokeLinecap="round">
<path d="M30 30 C24 20, 18 16, 20 8 C28 10, 32 16, 30 30 Z" />
<path d="M30 30 C40 24, 46 24, 50 16 C44 24, 42 30, 30 30 Z" />
<path d="M30 30 C36 40, 42 42, 40 50 C32 48, 28 42, 30 30 Z" />
<path d="M30 30 C20 36, 14 36, 10 44 C16 36, 18 30, 30 30 Z" />
<circle cx="30" cy="30" r="2.5" fill={color} stroke="none" />
</g>
</svg>
);
}
export default function App() {
const [lang, setLang] = useState("vi");
const t = STR[lang];
const [tab, setTab] = useState("menu");
const [query, setQuery] = useState("");
const [cart, setCart] = useState([]);
const [cartOpen, setCartOpen] = useState(false);
const [detailItem, setDetailItem] = useState(null);
const [detailSize, setDetailSize] = useState(null);
const [detailBlend, setDetailBlend] = useState("mori");
const [detailAddons, setDetailAddons] = useState([]);
const [detailSweetness, setDetailSweetness] = useState(DEFAULT_SWEETNESS);
const [detailIce, setDetailIce] = useState(DEFAULT_ICE);
const [detailQty, setDetailQty] = useState(1);
const [combo, setCombo] = useState(null); // selections for the currently open combo const [orderOpen, setOrderOpen] = useState(false);
const [orderInfo, setOrderInfo] = useState({ name: "", phone: "", method: STR.vi.takeaway,
const [orderDone, setOrderDone] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [copied, setCopied] = useState(false);
item
useEffect(() => {
const style = document.createElement("style");
style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;5
document.head.appendChild(style);
return () => document.head.removeChild(style);
}, []);
useEffect(() => {
setOrderInfo((o) => {
const wasDefault = [STR.vi.takeaway, STR.en.takeaway].includes(o.method);
return wasDefault ? { ...o, method: t.takeaway } : o;
});
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [lang]);
const cartCount = cart.reduce((s, c) => s + c.qty, 0);
const cartTotal = cart.reduce((s, c) => {
const addonSum = c.addons.reduce((a, x) => a + x.price, 0);
const blendSum = c.blend ? c.blend.price : 0;
return s + (c.unitPrice + addonSum + blendSum) * c.qty;
}, 0);
const filteredCategories = useMemo(() => {
const q = query.trim().toLowerCase();
return CATEGORIES.map((cat) => ({
...cat,
items: MENU_ITEMS.filter(
(i) => i.category === cat.id && (q === "" || i.name.en.toLowerCase().includes(q) || i
),
})).filter((cat) => cat.items.length > 0);
}, [query]);
function quickAdd(item) {
if (item.isCombo) {
openDetail(item);
return;
}
const size = item.sizes ? "M" : null;
const unitPrice = item.sizes ? item.sizes.M : item.price;
const blend = item.hasMatcha ? { id: "mori", name: getBlend("mori").name, price: 0 const sweetness = item.sizes ? getSweetness(DEFAULT_SWEETNESS) : null;
const ice = item.sizes ? getIce(DEFAULT_ICE) : null;
setCart((prev) => {
const existing = prev.find(
(c) => c.itemId === item.id && c.size === size && c.addons.length === 0 && (!c.blend
} : nu
);
return [
...prev,
if (existing) return prev.map((c) => (c.key === existing.key ? { ...c, qty: c.qty + 1 }
{ key: `${item.id}-${size}-base-${Date.now()}`, itemId: item.id, name: item.name[lang
];
});
}
function openDetail(item) {
setDetailItem(item);
setDetailSize(item.sizes ? "M" : null);
setDetailBlend("mori");
setDetailAddons([]);
setDetailSweetness(DEFAULT_SWEETNESS);
setDetailIce(DEFAULT_ICE);
setDetailQty(1);
if (item.isCombo) {
if (item.comboType === "breakfast") {
setCombo({ drinkId: DRINK_ITEMS[0]?.id, drinkSize: "M", snackId: SNACK_ITEMS[0]?.id }
} else if (item.comboType === "teambreak") {
setCombo({
drink1Id: MATCHA_ITEMS[0]?.id,
drink1Size: "M",
drink2Id: MATCHA_ITEMS[1]?.id || MATCHA_ITEMS[0]?.id,
drink2Size: "M",
freeTeaId: FREE_TEA_ITEMS[0]?.id,
});
}
} else {
setCombo(null);
}
}
function toggleAddon(a) {
setDetailAddons((prev) => (prev.find((x) => x.id === a.id) ? prev.filter((x) => x.id !==
}
function confirmDetailAdd() {
if (detailItem.isCombo) {
confirmComboAdd();
return;
}
const unitPrice = detailItem.sizes ? detailItem.sizes[detailSize] : detailItem.price;
const addonsWithPrice = detailAddons.map((a) => ({ id: a.id, name: a.name, price: a.price
const blendObj = detailItem.hasMatcha ? getBlend(detailBlend) : null;
const blend = blendObj ? { id: blendObj.id, name: { en: blendObj.name, vi: blendObj.name
const sweetness = detailItem.sizes ? getSweetness(detailSweetness) : null;
const ice = detailItem.sizes ? getIce(detailIce) : null;
setCart((prev) => [
...prev,
{
key: `${detailItem.id}-${detailSize}-${detailBlend}-${detailSweetness}-${detailIce}-$
itemId: detailItem.id,
name: detailItem.name[lang],
size: detailSize,
unitPrice,
blend,
sweetness,
ice,
addons: addonsWithPrice,
qty: detailQty,
},
]);
setDetailItem(null);
}
function confirmComboAdd() {
if (!combo) return;
let composedName, unitPrice;
if (detailItem.comboType === "breakfast") {
const drink = findItem(combo.drinkId);
const snack = findItem(combo.snackId);
if (!drink || !snack) return;
const drinkPrice = drink.sizes[combo.drinkSize];
unitPrice = drinkPrice + snack.price - BREAKFAST_COMBO_DISCOUNT;
composedName = `${detailItem.name[lang]} (${drink.name[lang]} ${combo.drinkSize} } else {
const drink1 = findItem(combo.drink1Id);
const drink2 = findItem(combo.drink2Id);
const freeTea = findItem(combo.freeTeaId);
if (!drink1 || !drink2 || !freeTea) return;
unitPrice = drink1.sizes[combo.drink1Size] + drink2.sizes[combo.drink2Size];
const freeLabel = lang === "vi" ? "tặng" : "free";
composedName = `${detailItem.name[lang]} (${drink1.name[lang]} ${combo.drink1Size} + ${
+ ${sn
}
const sweetness = getSweetness(detailSweetness);
const ice = getIce(detailIce);
setCart((prev) => [
...prev,
{
key: `${detailItem.id}-${JSON.stringify(combo)}-${detailSweetness}-${detailIce}-${Dat
itemId: detailItem.id,
name: composedName,
size: null,
unitPrice,
blend: null,
sweetness,
ice,
addons: [],
qty: detailQty,
},
]);
setDetailItem(null);
setCombo(null);
}
function removeLine(key) {
setCart((prev) => prev.filter((c) => c.key !== key));
}
function changeQty(key, delta) {
setCart((prev) => prev.map((c) => (c.key === key ? { ...c, qty: Math.max(0, c.qty + delta
}
const orderSummaryText = useMemo(() => {
if (cart.length === 0) return "";
const lines = cart.map((c) => {
const sizeStr = c.size ? ` (${c.size})` : "";
const blendStr = c.blend ? ` \u2013 ${c.blend.name[lang]}${c.blend.price ? ` (+${c.blen
const addonStr = c.addons.length ? ` +${c.addons.map((a) => a.name[lang]).join(", ")}`
const sweetIceStr = c.sweetness || c.ice ? ` [${[c.sweetness?.label[lang], c.ice?.label
const linePrice = (c.unitPrice + c.addons.reduce((s, a) => s + a.price, 0) + (c.blend ?
return `\u2022 ${c.name}${sizeStr}${blendStr}${sweetIceStr}${addonStr} x${c.qty} \u2014
});
return [
`\ud83c\udf75 ${lang === "vi" ? "ĐƠN HÀNG" : "ORDER"} \u2014 MATCHA THE CLUB`,
...lines,
`${t.total}: ${priceFmt(cartTotal)}`,
``,
`${t.name}: ${orderInfo.name || "..."}`,
`${t.phone}: ${orderInfo.phone || "..."}`,
`${t.method}: ${orderInfo.method}`,
orderInfo.method === t.delivery && orderInfo.address ? `${t.deliveryAddress}: ${orderIn
orderInfo.note ? `${t.note}: ${orderInfo.note}` : null,
]
.filter(Boolean)
.join("\n");
}, [cart, cartTotal, orderInfo, lang, t]);
function copySummary() {
navigator.clipboard?.writeText(orderSummaryText).then(() => {
setCopied(true);
setTimeout(() => setCopied(false), 2000);
});
}
async function submitOrder() {
// Sends the order to the Google Apps Script endpoint, which logs it to a
// Google Sheet and pings the shop's Telegram bot instantly.
// NOTE: Apps Script web apps usually require mode:'no-cors' from the browser,
// which means we can't read the response — this is a fire-and-forget call.
setSubmitting(true);
const payload = {
timestamp: new Date().toISOString(),
lang,
customer: { name: orderInfo.name, phone: orderInfo.phone, method: orderInfo.method, add
items: cart.map((c) => ({
name: c.name,
size: c.size,
blend: c.blend ? c.blend.name[lang] : null,
sweetness: c.sweetness ? c.sweetness.label[lang] : null,
ice: c.ice ? c.ice.label[lang] : null,
addons: c.addons.map((a) => a.name[lang]),
qty: c.qty,
lineTotal: (c.unitPrice + c.addons.reduce((s, a) => s + a.price, 0) + (c.blend })),
total: cartTotal * 1000,
summaryText: orderSummaryText,
? c.bl
};
try {
await fetch(ORDER_ENDPOINT_URL, {
method: "POST",
mode: "no-cors",
headers: { "Content-Type": "text/plain" },
body: JSON.stringify(payload),
});
} catch (err) {
console.error("Order submit failed:", err);
} finally {
setSubmitting(false);
setOrderDone(true);
}
}
function sendViaZalo() {
// Zalo doesn't support pre-filling chat text via link, so we copy the
// order text to the clipboard and open the shop's Zalo chat — the
// customer just needs to paste (Ctrl/Cmd+V) and hit send.
navigator.clipboard?.writeText(orderSummaryText);
window.open(ZALO_LINK, "_blank", "noopener,noreferrer");
setCopied(true);
setTimeout(() => setCopied(false), 2000);
}
const detailPreviewTotal = detailItem
? detailItem.isCombo
? combo
? (detailItem.comboType === "breakfast"
? (findItem(combo.drinkId)?.sizes[combo.drinkSize] || 0) + (findItem(combo.snackI
: (findItem(combo.drink1Id)?.sizes[combo.drink1Size] || 0) + (findItem(combo.drin
detailQty
: 0
: ((detailItem.sizes ? detailItem.sizes[detailSize] : detailItem.price) +
detailAddons.reduce((s, a) => s + (a.price[detailSize] ?? 0), 0) +
(detailItem.hasMatcha ? getBlend(detailBlend).price[detailSize] : 0)) *
detailQty
: 0;
return (
<div style={{ fontFamily: "'Inter', sans-serif", background: C.beige, color: C.greenDark,
<style>{`
* { box-sizing: border-box; font-family: 'Inter', sans-serif; }
.handwrite { font-family: 'Schoolbell', cursive; letter-spacing: 0.3px; }
.btn { cursor: pointer; border: none; background: none; }
button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px soli
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: ${C.green}; border-radius: 4px; }
.clamp2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
`}</style>
{/* ============ HEADER ============ */}
<header style={{ position: "sticky", top: 0, zIndex: 30, background: C.cream, borderBot
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
<div className="handwrite" style={{ fontWeight: 400, fontSize: 26, color: C.greenDa
matcha the club
</div>
<div style={{ display: "flex", background: `${C.green}22`, borderRadius: 999, paddi
{["vi", "en"].map((l) => (
<button
key={l}
className="btn"
onClick={() => setLang(l)}
style={{
padding: "5px 11px",
borderRadius: 999,
fontSize: 12,
fontWeight: 700,
background: lang === l ? C.green : "transparent",
color: lang === l ? C.cream : C.greenDark,
>
))}
</div>
</div>
}}
{l.toUpperCase()}
</button>
{tab === "menu" && (
<div style={{ padding: "0 16px 12px" }}>
<input
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder={t.search}
style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: `1.5px
/>
</div>
)}
</header>
{/* ============ MENU TAB (home) ============ */}
{tab === "menu" && (
<main style={{ paddingBottom: cartCount > 0 ? 150 : 90 }}>
{/* hero banner */}
{query.trim() === "" && (
<div style={{ background: C.green, color: C.cream, padding: "26px 20px 30px", tex
<Flower size={44} color="#ffffec55" style={{ position: "absolute", top: 6, left
<Flower size={30} color="#ffffec44" style={{ position: "absolute", top: 20, rig
<Flower size={26} color="#ffffec33" style={{ position: "absolute", bottom: -4,
<div className="handwrite" style={{ fontSize: 40, lineHeight: 1.05, marginBotto
<p style={{ fontSize: 13, opacity: 0.95, margin: 0, maxWidth: 340, marginLeft:
<p className="handwrite" style={{ fontSize: 18, opacity: 0.9, margin: "6px 0 0"
</div>
)}
{filteredCategories.length === 0 && <p style={{ textAlign: "center", padding: 40, f
{filteredCategories.map((cat) => (
<section key={cat.id} style={{ padding: "18px 16px 6px" }}>
<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }
<span style={{ fontSize: 18 }}>{cat.emoji}</span>
<h2 className="handwrite" style={{ fontSize: 22, fontWeight: 400, margin: 0,
{cat.label[lang]}
</h2>
</div>
<div style={{ display: "flex", flexDirection: "column" }}>
{cat.items.map((item, idx) => {
const displayPrice = item.isCombo
? item.comboType === "breakfast"
? `${t.comboDiscount} ${BREAKFAST_COMBO_DISCOUNT}k`
: `${t.comboFree} 1 ${lang === "vi" ? "trà trái cây" : "fruit tea"}`
: item.sizes
? `${priceFmt(item.sizes.M)} \u2013 ${priceFmt(item.sizes.L)}`
: priceFmt(item.price);
return (
<div key={item.id}>
<div onClick={() => openDetail(item)} role="button" tabIndex={0} <div
style=
style={{
width: 84,
height: 84,
minWidth: 84,
borderRadius: 14,
overflow: "hidden",
background: `linear-gradient(135deg, ${C.green}44, ${C.green}18)`
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 28,
}}
>
{ITEM_IMAGES[item.id] ? (
<img
src={ITEM_IMAGES[item.id] || "/placeholder.svg"}
alt={item.name[lang]}
loading="lazy"
style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
) : (
cat.emoji
)}
</div>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: {item.desc[lang] && (
<p className="clamp2" style={{ fontSize: 12.5, color: "#5c6b60",
{item.desc[lang]}
</p>
3, lin
)}
<div style={{ fontWeight: 700, fontSize: 14, color: C.brown }}>{dis
</div>
<div style={{ display: "flex", alignItems: "flex-end", paddingBottom:
<button
className="btn"
onClick={(e) => {
e.stopPropagation();
quickAdd(item);
}}
style={{
width: 34,
height: 34,
borderRadius: "50%",
background: C.green,
color: C.cream,
fontSize: 19,
fontWeight: 700,
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
+
</button>
</div>
</div>
</div>
{idx < cat.items.length - 1 && <div style={{ height: 1, background: `${
);
})}
</div>
</section>
))}
</main>
)}
{/* ============ ABOUT TAB ============ */}
{tab === "about" && (
<main style={{ padding: "28px 20px 100px", maxWidth: 640, margin: "0 auto" }}>
<h1 className="handwrite" style={{ fontSize: 32, fontWeight: 400, marginBottom: 16,
<p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#3a4a3f", marginBottom: 18 }}
{lang === "vi"
? `Matcha The Club bắt đầu như một "side hustle" nhỏ — một cô nàng văn phòng là
: `Matcha The Club started as a small "side hustle" — a 9-to-5 office girl maki
</p>
<div style={{ background: C.green, color: C.cream, borderRadius: 16, padding: 18, p
<Flower size={28} color="#ffffec44" style={{ position: "absolute", top: 8, right:
<p
className="handwrite"
style={{
fontSize: 19,
lineHeight: 1.5,
margin: 0,
}}
>
</p>
To add a little more joy & spontaneity into everyday life through small daily rituals.
</div>
</main>
)}
{/* ============ LOCATION TAB ============ */}
{tab === "location" && (
>
<main style={{ padding: "28px 20px 100px", maxWidth: 640, margin: "0 auto" }}>
<h1 className="handwrite" style={{ fontSize: 32, fontWeight: 400, marginBottom: 16,
<div style={{ display: "grid", gap: 16, fontSize: 14.5, lineHeight: 1.6 }}>
<div>
<div style={{ fontWeight: 700, marginBottom: 2 }}>{t.address}</div>
<div style={{ color: "#3a4a3f" }}>87 Trương Định, Xuân Hoà Ward</div>
</div>
<div>
<div style={{ fontWeight: 700, marginBottom: 2 }}>{t.hours}</div>
<div style={{ color: "#3a4a3f" }}>7:00 – 21:00 {lang === "vi" ? "hằng ngày" : "
</div>
<div>
<div style={{ fontWeight: 700, marginBottom: 2 }}>{t.phone}</div>
<a href={`tel:${SHOP_PHONE_TEL}`} style={{ color: C.green, fontWeight: 700, tex
{SHOP_PHONE_DISPLAY}
</a>
</div>
<div>
<div style={{ fontWeight: 700, marginBottom: 2 }}>{t.ig}</div>
<div style={{ color: "#3a4a3f" }}>@matchatheclub</div>
</div>
</div>
<a
href="https://maps.app.goo.gl/YmAL1rQdPT9RHNoS8"
target="_blank"
rel="noopener noreferrer"
style={{ textDecoration: "none" }}
<div
style={{
marginTop: 22,
height: 170,
borderRadius: 16,
background: `${C.green}15`,
border: `1px solid ${C.green}40`,
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 8,
color: C.greenDark,
cursor: "pointer",
}}
>
<div style={{ fontSize: 28 }}> </div>
<div
style={{
fontWeight: 700,
fontSize: 16,
>
}}
Matcha The Club
</div>
<div
style={{
fontSize: 13,
opacity: 0.8,
}}
>
</div>
87 Trương Định, Xuân Hoà (D3)
<div
style={{
fontSize: 12,
color: C.green,
}}
>
{lang === "vi"
? "Nhấn để mở Google Maps"
: "Open in Google Maps"}
</div>
</div>
</a>
</main>
)}
{/* ============ FLOATING CART BAR ============ */}
{cartCount > 0 && !cartOpen && !detailItem && !orderOpen && (
<button
className="btn"
onClick={() => setCartOpen(true)}
style={{
position: "fixed",
bottom: 62,
left: 12,
right: 12,
background: C.green,
color: C.cream,
padding: "14px 18px",
borderRadius: 14,
display: "flex",
alignItems: "center",
justifyContent: "space-between",
fontWeight: 700,
fontSize: 14.5,
boxShadow: "0 8px 20px #073c2f44",
zIndex: 45,
}}
>
<span>{t.cart} • {cartCount} {t.items}</span>
<span>{priceFmt(cartTotal)}</span>
</button>
)}
{/* ============ BOTTOM TAB BAR ============ */}
<nav
style={{
position: "fixed",
bottom: 0,
left: 0,
right: 0,
background: C.cream,
borderTop: `1px solid ${C.green}33`,
display: "flex",
zIndex: 40,
paddingBottom: "env(safe-area-inset-bottom, 0px)",
}}
>
{[
{ id: "menu", label: t.tabMenu, icon: "\ud83c\udf75" },
{ id: "about", label: t.tabAbout, icon: "\ud83d\udcd6" },
{ id: "location", label: t.tabLocation, icon: "\ud83d\udccd" },
].map((tb) => (
<button
key={tb.id}
className="btn"
onClick={() => setTab(tb.id)}
style={{
flex: 1,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 2,
padding: "9px 0 8px",
color: tab === tb.id ? C.green : "#8a9690",
fontWeight: tab === tb.id ? 700 : 500,
fontSize: 11,
}}
>
<span style={{ fontSize: 18 }}>{tb.icon}</span>
{tb.label}
</button>
))}
</nav>
{/* ============ ITEM DETAIL SHEET ============ */}
{detailItem && (
<Sheet onClose={() => setDetailItem(null)}>
{ITEM_IMAGES[detailItem.id] && (
<div
style={{
width: "100%",
height: 220,
borderRadius: 16,
overflow: "hidden",
marginBottom: 14,
background: `linear-gradient(135deg, ${C.green}44, ${C.green}18)`,
}}
>
<img
/>
</div>
src={ITEM_IMAGES[detailItem.id] || "/placeholder.svg"}
alt={detailItem.name[lang]}
style={{ width: "100%", height: "100%", objectFit: "cover" }}
)}
<div className="handwrite" style={{ fontSize: 24, marginBottom: 4, color: C.brown }
{detailItem.desc[lang] && <p style={{ fontSize: 13, color: "#5c6b60", marginBottom:
{detailItem.note && <p style={{ fontSize: 11.5, color: C.brown, fontStyle: "italic"
{detailItem.isCombo && combo && detailItem.comboType === "breakfast" && (
<div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18
<div>
<div style={fieldLabel}>{t.chooseDrink}</div>
<select
value={combo.drinkId}
onChange={(e) => setCombo({ ...combo, drinkId: e.target.value })}
style={selectStyle}
>
{DRINK_ITEMS.map((d) => (
<option key={d.id} value={d.id}>
{d.name[lang]}
</option>
))}
</select>
<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
{["M", "L"].map((sz) => (
<button
key={sz}
className="btn"
onClick={() => setCombo({ ...combo, drinkSize: sz })}
style={{
flex: 1,
padding: 8,
borderRadius: 10,
border: `1.5px solid ${C.green}`,
background: combo.drinkSize === sz ? C.green : "transparent",
color: combo.drinkSize === sz ? C.cream : C.greenDark,
fontWeight: 600,
fontSize: 12.5,
}}
>
{sz}
</button>
))}
</div>
</div>
<div>
<div style={fieldLabel}>{t.chooseSnack}</div>
<select
value={combo.snackId}
onChange={(e) => setCombo({ ...combo, snackId: e.target.value })}
style={selectStyle}
>
{SNACK_ITEMS.map((s) => (
<option key={s.id} value={s.id}>
{s.name[lang]}
</option>
))}
</select>
</div>
</div>
)}
{detailItem.isCombo && combo && detailItem.comboType === "teambreak" && (
<div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18
{[1, 2].map((n) => (
<div key={n}>
<div style={fieldLabel}>{n === 1 ? t.chooseDrink1 : t.chooseDrink2}</div>
<select
value={n === 1 ? combo.drink1Id : combo.drink2Id}
onChange={(e) => setCombo({ ...combo, [n === 1 ? "drink1Id" : "drink2Id"]
style={selectStyle}
>
{MATCHA_ITEMS.map((d) => (
<option key={d.id} value={d.id}>
{d.name[lang]}
</option>
))}
</select>
<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
{["M", "L"].map((sz) => (
<button
key={sz}
className="btn"
onClick={() => setCombo({ ...combo, [n === 1 ? "drink1Size" : "drink2
style={{
flex: 1,
padding: 8,
borderRadius: 10,
border: `1.5px solid ${C.green}`,
background: (n === 1 ? combo.drink1Size : combo.drink2Size) === sz
color: (n === 1 ? combo.drink1Size : combo.drink2Size) === sz ? C.c
fontWeight: 600,
fontSize: 12.5,
}}
>
))}
</div>
</div>
{sz}
</button>
))}
<div>
<div style={fieldLabel}>{t.freeTea}</div>
<select
value={combo.freeTeaId}
onChange={(e) => setCombo({ ...combo, freeTeaId: e.target.value })}
style={selectStyle}
>
{FREE_TEA_ITEMS.map((f) => (
<option key={f.id} value={f.id}>
{f.name[lang]}
</option>
))}
</select>
</div>
</div>
)}
{detailItem.sizes && (
<div style={{ marginBottom: 18 }}>
<div style={fieldLabel}>{t.size}</div>
<div style={{ display: "flex", gap: 8 }}>
{Object.entries(detailItem.sizes).map(([sz, pr]) => (
<button
key={sz}
className="btn"
onClick={() => setDetailSize(sz)}
style={{
flex: 1,
padding: 10,
borderRadius: 10,
border: `1.5px solid ${C.green}`,
background: detailSize === sz ? C.green : "transparent",
color: detailSize === sz ? C.cream : C.greenDark,
fontWeight: 600,
fontSize: 13.5,
}}
>
{sz} · {priceFmt(pr)}
</button>
))}
</div>
</div>
)}
{detailItem.hasMatcha && (
<div style={{ marginBottom: 18 }}>
<div style={fieldLabel}>{t.blend}</div>
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{BLENDS.map((b) => {
const active = detailBlend === b.id;
const delta = b.price[detailSize];
return (
<button
key={b.id}
className="btn"
onClick={() => setDetailBlend(b.id)}
style={{
textAlign: "left",
padding: "10px 12px",
borderRadius: 12,
border: `1.5px solid ${active ? C.green : C.green + "55"}`,
background: active ? `${C.green}18` : "transparent",
}}
>
<div style={{ display: "flex", justifyContent: "space-between", alignIt
<span style={{ fontWeight: 700, fontSize: 13.5, color: C.greenDark }}
<span style={{ fontSize: 12, fontWeight: 700, color: delta ? C.brown
{delta ? `+${priceFmt(delta)}` : t.included}
</span>
</div>
<div style={{ fontSize: 11.5, color: "#5c6b60", marginTop: 2 }}>{lang =
</button>
);
})}
</div>
</div>
)}
{detailItem.sizes && (
<div style={{ marginBottom: 18 }}>
<div style={fieldLabel}>{t.addons}</div>
<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
{ADDONS.map((a) => {
const active = detailAddons.some((x) => x.id === a.id);
return (
<button
key={a.id}
className="btn"
onClick={() => toggleAddon(a)}
style={{
padding: "8px 12px",
borderRadius: 999,
border: `1.5px solid ${C.brown}`,
background: active ? C.brown : "transparent",
color: active ? C.cream : C.brown,
fontSize: 12.5,
fontWeight: 600,
}}
>
{a.name[lang]} +{a.price[detailSize]}k
</button>
);
})}
</div>
</div>
)}
{(detailItem.sizes || detailItem.isCombo) && (
<div style={{ marginBottom: 18 }}>
<div style={fieldLabel}>{t.sweetness}</div>
<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
{SWEETNESS_LEVELS.map((s) => {
const active = detailSweetness === s.id;
return (
<button
key={s.id}
className="btn"
onClick={() => setDetailSweetness(s.id)}
style={{
padding: "8px 12px",
borderRadius: 999,
border: `1.5px solid ${C.green}`,
background: active ? C.green : "transparent",
color: active ? C.cream : C.greenDark,
fontSize: 12.5,
fontWeight: 600,
}}
>
{s.label[lang]}
</button>
);
})}
</div>
</div>
)}
{(detailItem.sizes || detailItem.isCombo) && (
<div style={{ marginBottom: 18 }}>
<div style={fieldLabel}>{t.ice}</div>
<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
{ICE_LEVELS.map((s) => {
const active = detailIce === s.id;
return (
<button
key={s.id}
className="btn"
onClick={() => setDetailIce(s.id)}
style={{
padding: "8px 12px",
borderRadius: 999,
border: `1.5px solid ${C.green}`,
background: active ? C.green : "transparent",
color: active ? C.cream : C.greenDark,
fontSize: 12.5,
fontWeight: 600,
}}
>
{s.label[lang]}
</button>
);
})}
</div>
</div>
)}
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between
<div style={fieldLabel}>{t.qty}</div>
<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
<StepBtn onClick={() => setDetailQty((q) => Math.max(1, q - 1))}>–</StepBtn>
<span style={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}>{detailQty
<StepBtn onClick={() => setDetailQty((q) => q + 1)}>+</StepBtn>
</div>
</div>
<button
className="btn"
onClick={confirmDetailAdd}
style={{ width: "100%", background: C.greenDark, color: C.cream, padding: 14, bor
>
{t.addToCart} · {priceFmt(detailPreviewTotal)}
</button>
</Sheet>
)}
{/* ============ CART SHEET (vertical) ============ */}
{cartOpen && !orderOpen && (
<Sheet onClose={() => setCartOpen(false)}>
<div className="handwrite" style={{ fontSize: 24, marginBottom: 16, color: C.brown
{cart.length === 0 ? (
<p style={{ fontSize: 13.5, color: "#5c6b60" }}>{t.empty}</p>
) : (
<>
<div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom:
{cart.map((c) => (
<div key={c.key} style={{ display: "flex", flexDirection: "column", gap: 8,
<div style={{ display: "flex", justifyContent: "space-between", gap: 10 }
<div style={{ fontWeight: 700, fontSize: 14 }}>
{c.name} {c.size ? `(${c.size})` : ""}
</div>
<div style={{ fontWeight: 700, fontSize: 13.5, color: C.brown, whiteSpa
{priceFmt((c.unitPrice + c.addons.reduce((s, a) => s + a.price, 0) +
</div>
</div>
{c.blend && <div style={{ fontSize: 11.5, color: "#5c6b60" }}>{lang === "
{(c.sweetness || c.ice) && (
<div style={{ fontSize: 11.5, color: "#5c6b60" }}>
{[c.sweetness?.label[lang], c.ice?.label[lang]].filter(Boolean).join(
</div>
)}
{c.addons.length > 0 && <div style={{ fontSize: 11.5, color: "#5c6b60" }}
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<StepBtn small onClick={() => changeQty(c.key, -1)}>–</StepBtn>
<span style={{ fontSize: 13, fontWeight: 600 }}>{c.qty}</span>
<StepBtn small onClick={() => changeQty(c.key, 1)}>+</StepBtn>
<button className="btn" onClick={() => removeLine(c.key)} style={{ colo
{t.remove}
</button>
</div>
</div>
))}
</div>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1
<span>{t.total}</span>
<span>{priceFmt(cartTotal)}</span>
</div>
<button
className="btn"
onClick={() => setOrderOpen(true)}
style={{ width: "100%", background: C.greenDark, color: C.cream, padding: 14,
>
{t.checkout}
</button>
</>
)}
</Sheet>
)}
{/* ============ ORDER FORM SHEET ============ */}
{orderOpen && (
<Sheet
onClose={() => {
setOrderOpen(false);
setOrderDone(false);
}}
>
{!orderDone ? (
<>
<div className="handwrite" style={{ fontSize: 24, marginBottom: 16, color: C.br
<div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
<div>
<div style={fieldLabel}>{t.name}</div>
<input value={orderInfo.name} onChange={(e) => setOrderInfo({ ...orderInfo,
</div>
<div>
<div style={fieldLabel}>{t.phone}</div>
<input value={orderInfo.phone} onChange={(e) => setOrderInfo({ ...orderInfo
</div>
<div>
<div style={fieldLabel}>{t.method}</div>
<div style={{ display: "flex", gap: 12 }}>
{[t.takeaway, t.delivery].map((m) => (
<button
key={m}
className="btn"
onClick={() =>
setOrderInfo({
...orderInfo,
method: m,
})
}
style={{
flex: 1,
padding: 14,
borderRadius: 14,
border: `1.5px solid ${C.green}`,
background:
orderInfo.method === m
? C.green
: "transparent",
color:
orderInfo.method === m
? C.cream
: C.greenDark,
fontSize: 14,
fontWeight: 600,
lineHeight: 1.4,
}}
>
))}
</div>
</div>
{m}
</button>
{orderInfo.method === t.delivery && (
<div>
<div style={fieldLabel}>{t.deliveryAddress}</div>
<input
value={orderInfo.address}
onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value }
style={inputStyle}
placeholder={t.addressPlaceholder}
/>
</div>
<p style={{ fontSize: 11, color: "#5c6b60", marginTop: 6, lineHeight: 1.4
)}
<div>
<div style={fieldLabel}>{t.note}</div>
<textarea
value={orderInfo.note}
onChange={(e) => setOrderInfo({ ...orderInfo, note: e.target.value style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
placeholder={t.notePlaceholder}
})}
/>
</div>
</div>
<button
className="btn"
disabled={!orderInfo.name || !orderInfo.phone || (orderInfo.method === onClick={submitOrder}
style={{
width: "100%",
background: !orderInfo.name || !orderInfo.phone || (orderInfo.method color: C.cream,
padding: 14,
borderRadius: 12,
fontWeight: 700,
fontSize: 14.5,
cursor: !orderInfo.name || !orderInfo.phone ? "not-allowed" : "pointer",
t.deli
=== t.
}}
>
{submitting ? t.sending : t.confirm}
</button>
</>
) : (
<>
<div className="handwrite" style={{ fontSize: 24, marginBottom: 4, color: C.bro
<p style={{ fontSize: 13, color: "#5c6b60", marginBottom: 16 }}>{t.orderSuccess
{/* payment QR */}
<div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom:
<div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: C.green
<img
src={PAYMENT_QR_DATA_URI}
alt="MTC payment QR"
style={{ width: "100%", maxWidth: 240, borderRadius: 12, margin: "0 auto",
/>
</div>
<p style={{ fontSize: 11.5, color: "#5c6b60", marginTop: 10, lineHeight: 1.5
{/* call the shop */}
<a
href={`tel:${SHOP_PHONE_TEL}`}
style={{
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: 8,
width: "100%",
background: C.green,
color: C.cream,
padding: 13,
borderRadius: 12,
fontWeight: 700,
fontSize: 14,
marginBottom: 18,
textDecoration: "none",
}}
>
{t.needHelp} · {SHOP_PHONE_DISPLAY}
</a>
{/* backup: manual Zalo send */}
<div style={{ borderTop: `1px dashed ${C.green}33`, paddingTop: 14, marginBotto
<p style={{ fontSize: 11.5, color: "#8a9690", marginBottom: 10, textTransform
<button
className="btn"
onClick={sendViaZalo}
style={{
width: "100%",
background: C.zalo,
color: "#fff",
padding: 12,
borderRadius: 12,
fontWeight: 700,
fontSize: 13.5,
marginBottom: 8,
}}
>
{copied ? t.copied : t.sendZalo}
</button>
<button
className="btn"
onClick={copySummary}
style={{ width: "100%", background: "transparent", color: C.greenDark, padd
>
{t.copy}
</button>
</div>
<button
className="btn"
onClick={() => {
setCart([]);
setOrderOpen(false);
setCartOpen(false);
setOrderDone(false);
setOrderInfo({ name: "", phone: "", method: t.takeaway, address: "", note:
}}
style={{ width: "100%", background: "transparent", color: "#5c6b60", padding:
>
{t.newOrder}
</button>
</>
)}
</Sheet>
)}
</div>
);
}
/* ---------- shared bits ---------- */
const fieldLabel = { fontSize: 12, fontWeight: 700, color: "#5c6b60", marginBottom: 6, textTr
const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 10, border: "1.5px so
const selectStyle = { ...inputStyle, appearance: "auto" };
function StepBtn({ children, onClick, small }) {
return (
<button
className="btn"
onClick={onClick}
style={{
width: small ? 26 : 30,
height: small ? 26 : 30,
borderRadius: "50%",
background: "#56a26722",
color: "#073c2f",
fontWeight: 700,
fontSize: small ? 14 : 16,
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
{children}
</button>
);
}
function Sheet({ children, onClose }) {
return (
<div
<div style={{ position: "fixed", inset: 0, background: "#073c2f66", display: "flex", alig
onClick={(e) => e.stopPropagation()}
style={{ background: "#ffffec", width: "100%", maxWidth: 480, maxHeight: "85vh", over
>
<div style={{ width: 40, height: 4, background: "#56a26755", borderRadius: 4, margin:
{children}
</div>
</div>
);
}
