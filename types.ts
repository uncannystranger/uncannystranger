
export type Section = 'home' | 'projects' | 'projects:exhibition' | 'artist';
export type ProjectView = 'gallery' | 'exhibition';
export type GalleryCategory = 'albums' | 'collections' | 'journal';

export interface Photo {
  id: string;
  url: string;
  title: string;
  alt: string;
  description: string;
  category: GalleryCategory;
}

export interface Exhibition {
  id: string;
  title: string;
  photos: Photo[];
}
