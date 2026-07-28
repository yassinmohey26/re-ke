import type { ImageLoader } from 'next/image';

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality || 'auto'}`,
  ];
  // Insert transformation params after '/upload/' in the URL
  return src.replace('/upload/', `/upload/${params.join(',')}/`);
};

export default cloudinaryLoader;
