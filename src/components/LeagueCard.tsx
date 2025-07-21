import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, Calendar } from "lucide-react";
import { League } from "@/services/api";
import { cn } from "@/lib/utils";

interface LeagueCardProps {
  league: League;
  onViewStandings: (leagueId: number, season: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_SUPPORTED_SEASON = 2023;

export const LeagueCard: React.FC<LeagueCardProps> = ({
  league,
  onViewStandings,
  className,
  style,
}) => {
  const validSeason =
    league.season && league.season <= MAX_SUPPORTED_SEASON
      ? league.season
      : MAX_SUPPORTED_SEASON;

  const handleView = () => {
    onViewStandings(league.id, validSeason);
  };

  const fallbackSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20"/></svg>`
  )}`;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-105 hover:-translate-y-1",
        "border-border/50 bg-gradient-stadium",
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-field p-3 shadow-field group-hover:shadow-glow transition-all duration-300">
              {league.logo ? (
                <img
                  src={league.logo}
                  alt={`${league.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackSvg;
                  }}
                />
              ) : (
                <Trophy className="w-full h-full text-primary-foreground" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1"
              title={league.name}
            >
              {league.name}
            </h3>

            <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{league.country}</span>
              {league.flag && (
                <img
                  src={league.flag}
                  alt={`${league.country} flag`}
                  className="w-6 h-4 object-cover rounded-sm border border-border"
                />
              )}
            </div>

            {league.season && (
              <div className="flex items-center space-x-2 mt-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  Season {league.season}
                </Badge>
              </div>
            )}

            {league.round && (
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="text-xs border-primary/20 text-primary"
                >
                  {league.round}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={handleView}
          className="w-full bg-gradient-field hover:shadow-field transition-all duration-300 group-hover:scale-105"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Lihat Klasemen
        </Button>
      </CardFooter>
    </Card>
  );
};
