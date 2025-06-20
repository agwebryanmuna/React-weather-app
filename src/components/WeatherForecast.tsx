import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  temp_min: number;
  temp_max: number;
  date: number;
  wind: number;
  humidity: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        weather: forecast.weather[0],
        date: forecast.dt,
        wind: forecast.wind.speed,
        humidity: forecast.main.humidity,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
      acc[date].wind += forecast.wind.speed;
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays: DailyForecast[] = Object.values(dailyForecast).slice(0, 6);

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => {
            return (
              <div
                key={day.date}
                className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
              >
                <div className="">
                  <p className="font-medium">
                    {format(new Date(day.date * 1000), "EEEE, MMM d")}
                  </p>
                  <p className="text-muted-foreground text-sm capitalize">
                    {day.weather.description}
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <span className="flex items-center text-blue-500">
                    <ArrowDown className="mr-1 size-4" />
                    {formatTemp(day.temp_min)}
                  </span>
                  <span className="flex items-center text-red-500">
                    <ArrowUp className="mr-1 size-4" />
                    {formatTemp(day.temp_max)}
                  </span>
                </div>

                <div className="flex justify-end gap-4">
                  <span className="flex items-center gap-1">
                    <Droplets className="text-blue-500 size-4" />
                    <span className="text-sm">{day.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="text-blue-500 size-4" />
                    <span className="text-sm">{day.wind.toFixed(2)} m/s</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
