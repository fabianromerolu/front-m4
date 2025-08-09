import { Product } from "../interfaces/Product";
const mockProducts: Product[] = [
	{
		id: 1,
		name: "iPhone 11",
		description: "Experience power and elegance with the iPhone 11: capture stunning moments with its dual-camera system, enjoy exceptional performance, and immerse yourself in a brilliant Liquid Retina display. Discover a world of possibilities in the palm of your hand!",
		price: 699,
		stock: 10,
		image: "https://mac-center.com/cdn/shop/files/194252097236-7.jpg?v=1709763494&width=823",
		categoryId: 1
	},
	{
		id: 2,
		name: "MacBook Air",
		description: "Embrace efficiency and sophistication with the MacBook Air: lightweight design meets powerful performance, stunning Retina display brings your work to life, and all-day battery life keeps you productive wherever you go. Elevate your computing experience with the MacBook Air.",
		price: 999,
		stock: 10,
		image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-og-202503?wid=1200&hei=630&fmt=jpeg&qlt=90&.v=1739216814915",
		categoryId: 2
	},
	{
		id: 3,
		name: "iPad Pro",
		description: "Unleash your creativity and productivity with the iPad Pro: powerful performance, stunning Liquid Retina display, and all-day battery life make the iPad Pro the perfect tool for work and play. Transform your ideas into reality with the iPad Pro.",
		price: 799,
		stock: 10,
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdexTrTVS4qjotIEYOoGPwD0rq5gxisAP_AQ&s",
		categoryId: 3
	},
	{
		id: 4,
		name: "Apple Watch Series 6",
		description: "Stay connected and healthy with the Apple Watch Series 6: track your workouts, monitor your health, and stay in touch with the people and information you care about most. Experience the future of health and wellness with the Apple Watch Series 6.",
		price: 399,
		stock: 10,
		image: "https://www.apple.com/newsroom/images/product/watch/standard/Apple_watch-series-6-aluminum-blue-case-countup-watchface_09152020_carousel.jpg.large.jpg",
		categoryId: 4
	},
	{
		id: 5,
		name: "AirPods Pro",
		description: "Immerse yourself in sound with the AirPods Pro: active noise cancellation, transparency mode, and customizable fit make the AirPods Pro the perfect companion for music, calls, and everything in between. Elevate your audio experience with the AirPods Pro.",
		price: 249,
		stock: 10,
		image: "https://mac-center.com/cdn/shop/files/AirPods_Pro_en_su_estuche_con_MagSafe.jpg?v=1742255727&width=1445",
		categoryId: 5
	},
	{
		id: 6,
		name: "HomePod mini",
		description: "Elevate your home audio experience with the HomePod mini: immersive sound, intelligent assistant, and smart home hub make the HomePod mini the perfect addition to your home. Enjoy a world of music, news, and more with the HomePod mini.",
		price: 99,
		stock: 10,
		image: "https://www.apple.com/newsroom/images/2024/07/apple-introduces-homepod-mini-in-midnight/tile/Apple-HomePod-mini-midnight-lp.jpg.news_app_ed.jpg",
		categoryId: 6
	}
]

export default mockProducts;