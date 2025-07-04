import { CommandList } from "cmdk";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "./ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/useWeather";
import { useNavigate } from "react-router";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { format } from "date-fns";
import { useFavorites } from "@/hooks/useFavorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    // add to search history
    addToHistory.mutate({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      country,
      query,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search />
        Search Cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((location) => (
                <CommandItem
                  key={location.id}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="mr-2 size-4 text-yellow-500" />
                  <span>{location.name}</span>

                  {location.state && (
                    <span className="text-sm text-muted-foreground">
                      , {location.state}
                    </span>
                  )}

                  <span className="text-sm text-muted-foreground">
                    {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="size-4" /> Clear
                  </Button>
                </div>

                {history.map((location) => (
                  <CommandItem
                    key={location.lat + "-" + location.lon}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 size-4 text-muted-foreground" />
                    <span>{location.name}</span>

                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}

                    <span className="text-sm text-muted-foreground">
                      {location.country}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(location.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {locations && locations.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Suggestions">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                )}

                {locations.map((location) => (
                  <CommandItem
                    key={location.lat + "-" + location.lon}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 size-4" />
                    <span>{location.name}</span>

                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}

                    <span className="text-sm text-muted-foreground">
                      {location.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
