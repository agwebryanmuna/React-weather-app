import { THEME_MODES, useTheme } from "@/context/themeProvider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import CitySearch from "../CitySearch";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { dark, light } = THEME_MODES;

  return (
    <header className="sticky top-0 z-50 w-full border-b  backdrop-blur bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img
            src={theme === dark ? "/logo.png" : "/logo2.png"}
            alt="klimate logo"
            className="h-14"
          />
        </Link>
        <div className="flex items-center gap-4">
          {/* search */}
          <CitySearch />
          {/* theme toggler */}
          <div
            onClick={() => setTheme(theme === dark ? light : dark)}
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              theme === dark ? "rotate-180" : "rotate-0"
            }`}
          >
            {theme === dark ? (
              <Sun className="size-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="size-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
