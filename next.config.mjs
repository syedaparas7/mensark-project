/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "miro.medium.com",
      "naturalselectionlondon.com",
      "creator.nightcafe.studio",
      "burst.shopifycdn.com",
      "media.istockphoto.com",
      "blog.thejacketmaker.com",
      "static.vecteezy.com",
      "drive.google.com",
      "mrporter.com",
      "www.mrporter.com",
      "dtcralphlauren.scene7.com",
      "mobile.yoox.com",
      "i.pinimg.com",
      "res.cloudinary.com",
      "weavewardrobe.com",
      "www.transparentpng.com",
      "5.imimg.com",
      "static.vecteezy.com",
      "hips.hearstapps.com",
      "cdn.shopify.com",
      "images.unsplash.com",
      "upload.wikimedia.org",
      "www.thenews.com.pk",
      "crystalpng.com",
      "www.gdchome.com",
      "www.shutterstock.com",

    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;

