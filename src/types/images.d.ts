export interface ImageItem {
  id: number;
  src: string;
  title?: string;
  caption?: string;
  alt?: string;
}

export interface HomeImages {
  flipbook: ImageItem[];
}

export interface GalleryImages {
  gallery: ImageItem[];
}