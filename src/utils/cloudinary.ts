// Cloudinary URL helper
// Builds delivery URLs for the 'duwhuzkib' cloud with f_auto and q_auto
export function cld(publicId: string, width?: number): string {
  const parts = publicId.split('/').map(encodeURIComponent).join('/');
  const transformations = ['f_auto', 'q_auto'];
  if (width) transformations.push(`w_${width}`);
  const trans = transformations.join(',');
  return `https://res.cloudinary.com/duwhuzkib/image/upload/${trans}/${parts}`;
}
