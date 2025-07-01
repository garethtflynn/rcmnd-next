import { useState } from "react";
import Image from "next/image";
import rcmndLogo from "../../public/rcmndLogo.png";

function AppImage({
  src,
  alt,
  variant = "standard",
  fallbackSrc = rcmndLogo,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const variants = {
    standard: {
      container: "relative w-full h-64 md:h-80",
      background: "bg-white",
      padding: "p-0",
      objectFit: "cover",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    },
    square: {
      container: "relative w-full aspect-square",
      background: "bg-gradient-to-br from-gray-50 to-white",
      padding: "p-0",
      objectFit: "cover",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px",
    },
    hero: {
      container: "relative w-full h-96 md:h-[32rem]",
      background: "bg-white",
      padding: "p-0",
      objectFit: "cover",
      sizes: "100vw",
    },
  };

  const config = variants[variant];

  const handleImageError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getOptimizedUrl = (url) => {
    // Check if url is a valid string
    if (!url || typeof url !== "string") {
      console.warn("Invalid URL passed to getOptimizedUrl:", url, typeof url);
      return url;
    }

    // Skip data URLs
    if (url.includes("data:")) return url;

    // For external image optimization service
    const params =
      variant === "square" ? "w_400,h_400,c_pad" : "w_600,h_480,c_pad";
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&${params}&bg=white&t=square`;
  };

  return (
    <div
      className={`${config.container} ${config.background} rounded-md overflow-hidden group`}
    >
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Image unavailable</span>
        </div>
      )}

      {/* Main image */}
      {!hasError && (
        <div className={`${config.padding} relative w-full h-full`}>
          <Image
            src={getOptimizedUrl(imgSrc) || imgSrc}
            alt={alt}
            fill
            sizes={config.sizes}
            style={{
              objectFit: config.objectFit,
              filter: isLoading ? "blur(4px)" : "none",
              transition: "filter 0.3s ease",
            }}
            className="transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            {...props}
          />
        </div>
      )}
    </div>
  );
}

export default AppImage;
