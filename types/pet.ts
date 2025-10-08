export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed?: string;
  age?: string;
  weight?: string;
  color?: string;
  observations?: string;
  image?: string | null;
  createdAt: string;
}

export interface PetContextType {
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
  updatePet: (id: string, pet: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  isLoading: boolean;
  refreshPets: () => Promise<void>;
}