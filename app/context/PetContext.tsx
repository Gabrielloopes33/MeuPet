import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pet, PetContextType } from '../../types/pet';

const PETS_STORAGE_KEY = 'meupet-pets';

// Criação do Contexto
const PetContext = createContext<PetContextType | undefined>(undefined);

// Hook customizado para usar o contexto de pets
export function usePets() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}

// Componente Provedor que envolve a aplicação
export function PetProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para gerar um ID único
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Carregar pets do AsyncStorage
  const loadPets = async () => {
    try {
      const storedPets = await AsyncStorage.getItem(PETS_STORAGE_KEY);
      if (storedPets) {
        const parsedPets = JSON.parse(storedPets);
        setPets(parsedPets);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar pets no AsyncStorage
  const savePets = async (newPets: Pet[]) => {
    try {
      await AsyncStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(newPets));
    } catch (error) {
      console.error('Erro ao salvar pets:', error);
    }
  };

  // Adicionar um novo pet
  const addPet = async (petData: Omit<Pet, 'id'>) => {
    try {
      const newPet: Pet = {
        ...petData,
        id: generateId(),
      };

      const updatedPets = [...pets, newPet];
      setPets(updatedPets);
      await savePets(updatedPets);
    } catch (error) {
      console.error('Erro ao adicionar pet:', error);
      throw error;
    }
  };

  // Atualizar um pet existente
  const updatePet = async (id: string, petData: Partial<Pet>) => {
    try {
      const updatedPets = pets.map(pet => 
        pet.id === id ? { ...pet, ...petData } : pet
      );
      setPets(updatedPets);
      await savePets(updatedPets);
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      throw error;
    }
  };

  // Deletar um pet
  const deletePet = async (id: string) => {
    try {
      const updatedPets = pets.filter(pet => pet.id !== id);
      setPets(updatedPets);
      await savePets(updatedPets);
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      throw error;
    }
  };

  // Buscar pet por ID
  const getPetById = (id: string): Pet | undefined => {
    return pets.find(pet => pet.id === id);
  };

  // Recarregar pets
  const refreshPets = async () => {
    setIsLoading(true);
    await loadPets();
  };

  // Carregar pets quando o componente for montado
  useEffect(() => {
    loadPets();
  }, []);

  const contextValue: PetContextType = {
    pets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    isLoading,
    refreshPets,
  };

  return (
    <PetContext.Provider value={contextValue}>
      {children}
    </PetContext.Provider>
  );
}