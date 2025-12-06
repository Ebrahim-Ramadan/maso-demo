/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  typescript: {
    // Allow production builds to successfully complete even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to successfully complete even if there are eslint errors
    ignoreDuringBuilds: true,
  },
  // Exclude large dependencies from being bundled
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'node_modules/webpack',
      'node_modules/terser',
      'node_modules/@xenova/transformers',
    ],
  },
  webpack: (config, { isServer }) => {
    // Externalize heavy dependencies on server
    if (isServer) {
      config.externals = [
        ...config.externals,
        '@xenova/transformers',
        'onnxruntime-node',
        'sharp',
      ]
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
      '@xenova/transformers$': false,
    };
    
    // Ignore large unnecessary files
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'javascript/auto',
    })
    
    return config;
  },
};

module.exports = nextConfig;
