import React, { useState, useEffect } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, fallbackSrc }) => {
    const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);


    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImageSrc(src);
        };
        img.onerror = () => {
            console.error('Error loading image:', src);
            setImageSrc(fallbackSrc);
        };
    }, [src, fallbackSrc]);

    return < img src={imageSrc} alt={alt} className={className} />
}

export default LazyImage;
