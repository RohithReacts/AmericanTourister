import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
  type: "Home" | "Work" | "Other";
};

type AddressContextType = {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
};

const AddressContext = createContext<AddressContextType>({
  addresses: [],
  addAddress: () => {},
  removeAddress: () => {},
});

export const useAddress = () => useContext(AddressContext);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from Storage
  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@addresses");
        if (jsonValue != null) {
          setAddresses(JSON.parse(jsonValue));
        } else {
          // Default data if needed
          setAddresses([]);
        }
      } catch (e) {
        console.error("Failed to load addresses", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Save to Storage
  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem("@addresses", JSON.stringify(addresses));
      } catch (e) {
        console.error("Failed to save addresses", e);
      }
    };
    save();
  }, [addresses, loaded]);

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress = { ...address, id: Date.now().toString() };
    setAddresses((prev) => [...prev, newAddress]);
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <AddressContext.Provider value={{ addresses, addAddress, removeAddress }}>
      {children}
    </AddressContext.Provider>
  );
}
