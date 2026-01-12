// Cloudinary URL helper (FAST + LCP optimized)
export function cld(publicId: string, width?: number): string {
  const parts = publicId.split('/').map(encodeURIComponent).join('/');

  const transformations = [
    'f_auto',
    'q_auto',
    'dpr_auto',
    'c_fill',
  ];

  if (width) transformations.push(`w_${width}`);

  return `https://res.cloudinary.com/duwhuzkib/image/upload/${transformations.join(',')}/${parts}`;
}