
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
}

interface StoreContextType {
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store | null) => void;
  addStore: (store: Omit<Store, "id">) => void;
  updateStore: (store: Store) => void;
  deleteStore: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Mock inicial para lojas
const INITIAL_STORES: Store[] = [
  {
    id: "1",
    name: "Alberson Radiadores",
    address: "Rua Principal, 123",
    phone: "(00) 12345-6789"
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [stores, setStores] = useState<Store[]>(() => {
    const savedStores = localStorage.getItem("stores");
    return savedStores ? JSON.parse(savedStores) : INITIAL_STORES;
  });
  
  const [currentStore, setCurrentStore] = useState<Store | null>(() => {
    const savedStore = sessionStorage.getItem("currentStore");
    return savedStore ? JSON.parse(savedStore) : null;
  });

  useEffect(() => {
    localStorage.setItem("stores", JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    if (currentStore) {
      sessionStorage.setItem("currentStore", JSON.stringify(currentStore));
    } else {
      sessionStorage.removeItem("currentStore");
    }
  }, [currentStore]);

  const addStore = (storeData: Omit<Store, "id">) => {
    const newStore = {
      ...storeData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setStores([...stores, newStore]);
  };

  const updateStore = (updatedStore: Store) => {
    setStores(stores.map(store => 
      store.id === updatedStore.id ? updatedStore : store
    ));
    
    if (currentStore?.id === updatedStore.id) {
      setCurrentStore(updatedStore);
    }
  };

  const deleteStore = (id: string) => {
    setStores(stores.filter(store => store.id !== id));
    
    if (currentStore?.id === id) {
      setCurrentStore(null);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        setCurrentStore,
        addStore,
        updateStore,
        deleteStore
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return context;
};
