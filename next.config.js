// module.exports = {
//   reactStrictMode: true,
// };
// @type {import('next').NextConfig}
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "ipfs.infura.io",
      "tuomodesign.store",
      "design-system.immutable.com",
      "images.godsunchained.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/NFTsCollections",
        permanent: true,
      },
    ];
  },
};
// module.exports = {
//   useFileSystemPublicRoutes: false,
// };
