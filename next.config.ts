import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure webpack to handle server-only modules that cannot be bundled for client
  // Note: This project uses Genkit AI which has Node.js dependencies that cause build failures
  webpack: (config, options) => {
    if (!options.isServer) {
      // Don't bundle server-only modules on the client - provide false as fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        zlib: false,
        http: false,
        https: false,
        child_process: false,
        dgram: false,
        path: false,
      };
    }
    // Suppress warnings (not errors) for known server-only module patterns
    config.ignoreWarnings = [
      {module: /@grpc\/grpc-js/},
      {module: /@opentelemetry/},
      {module: /agent-base/},
      {module: /google-auth-library/},
      {module: /gaxios/},
    ];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: [
    'genkit',
    '@genkit-ai/core',
    '@genkit-ai/google-genai',
    '@opentelemetry/sdk-node',
    '@grpc/grpc-js',
    '@opentelemetry/exporter-jaeger',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/otlp-grpc-exporter-base',
    'google-auth-library',
    'gaxios',
  ],
};

export default nextConfig;
