import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  theme: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    textSecondary: string;
    icon: string;
    inputBackground: string;
  };
};

const LightTheme = {
  background: "#F1F2F6",
  text: "#333333",
  card: "#FFFFFF",
  border: "#E0E0E0",
  primary: "#FF801F",
  textSecondary: "#666666",
  icon: "#555555",
  inputBackground: "#F5F6F8",
};

const DarkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  card: "#1E1E1E",
  border: "#333333",
  primary: "#FF801F",
  textSecondary: "#AAAAAA",
  icon: "#DDDDDD",
  inputBackground: "#2C2C2C",
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  theme: LightTheme,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const val = await AsyncStorage.getItem("@theme");
        if (val === "dark") setIsDark(true);
      } catch (e) {
        console.error("Failed to load theme", e);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newVal = !isDark;
    setIsDark(newVal);
    try {
      await AsyncStorage.setItem("@theme", newVal ? "dark" : "light");
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
