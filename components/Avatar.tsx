import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string; // URL of the avatar image
  alt?: string; // Alternative text for the image
  size?: number; // Size of the avatar in pixels
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "User Avatar", size = 40 }) => {
  return (
    <div
      className={`rounded-full overflow-hidden border-2 border-white mx-2`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src || '/assets/images/profile.png'}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Avatar;
