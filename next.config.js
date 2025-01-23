// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// };

// module.exports = nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login', // เปลี่ยน root route ไปที่หน้า login
        permanent: false,
      },
    ];
  },
};

