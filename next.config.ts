// next.config.ts

/**
 * @type {import('next').NextConfig}
 **/ 
 const nextConfig = {
     // Remove error suppression
     typescript: {
         ignoreBuildErrors: false, // Enable TypeScript checking
     },
 }; 

 module.exports = nextConfig;