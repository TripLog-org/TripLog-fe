import { create } from 'zustand';

export interface ImageWithMeta {
  uri: string;
  type: string;
  fileName: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  capturedAt?: string;
}

interface CreatePostState {
  content: string;
  tags: string[];
  images: ImageWithMeta[];
  visibility: 'public' | 'private';

  setContent: (content: string) => void;
  setTags: (tags: string[]) => void;
  setImages: (images: ImageWithMeta[]) => void;
  setVisibility: (visibility: 'public' | 'private') => void;
  updateImageMeta: (index: number, meta: Partial<ImageWithMeta>) => void;
  reset: () => void;
}

export const useCreatePostStore = create<CreatePostState>((set) => ({
  content: '',
  tags: [],
  images: [],
  visibility: 'public',

  setContent: (content) => set({ content }),
  setTags: (tags) => set({ tags }),
  setImages: (images) => set({ images }),
  setVisibility: (visibility) => set({ visibility }),
  updateImageMeta: (index, meta) =>
    set((state) => {
      const updated = [...state.images];
      updated[index] = { ...updated[index], ...meta };
      return { images: updated };
    }),
  reset: () => set({ content: '', tags: [], images: [], visibility: 'public' }),
}));
