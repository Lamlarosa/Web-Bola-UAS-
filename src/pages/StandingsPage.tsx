import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { footballApi, Standing } from '@/services/api';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, ArrowLeft, Heart, Trophy, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StandingsPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [standings, setStandings] = useState<Standing[]>([]);
  const [filteredStandings, setFilteredStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [leagueName, setLeagueName] = useState('');

  useEffect(() => {
    if (leagueId) {
      fetchStandings(parseInt(leagueId));
    }
  }, [leagueId]);

  useEffect(() => {
    filterStandings();
  }, [searchQuery, standings]);

  const fetchStandings = async (id: number) => {
    try {
      setLoading(true);
      const data = await footballApi.getStandings(id);
      setStandings(data);
      setFilteredStandings(data);
      
      // Try to get league name from first standing
      if (data.length > 0) {
        setLeagueName(data[0].group || 'League');
      }
    } catch (error) {
      console.error('Error fetching standings:', error);
      toast({
        title: "Error",
        description: "Failed to load standings. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const filterStandings = () => {
    if (!searchQuery) {
      setFilteredStandings(standings);
      return;
    }

    const filtered = standings.filter(standing =>
      standing.team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standing.team.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStandings(filtered);
  };

  const handleFavoriteToggle = (standing: Standing) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add teams to favorites.",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite(standing.team.id)) {
      removeFavorite(standing.team.id);
      toast({
        title: "Removed from favorites",
        description: `${standing.team.name} has been removed from your favorites.`,
      });
    } else {
      addFavorite(standing.team);
      toast({
        title: "Added to favorites",
        description: `${standing.team.name} has been added to your favorites.`,
      });
    }
  };

  const getPositionColor = (rank: number) => {
    if (rank <= 4) return 'text-green-600 dark:text-green-400';
    if (rank <= 6) return 'text-blue-600 dark:text-blue-400';
    if (rank >= standings.length - 2) return 'text-red-600 dark:text-red-400';
    return 'text-foreground';
  };

  const getFormIndicator = (form: string) => {
    const recent = form.slice(-5);
    const wins = (recent.match(/W/g) || []).length;
    const losses = (recent.match(/L/g) || []).length;
    
    if (wins >= 4) return { icon: TrendingUp, color: 'text-green-600' };
    if (losses >= 3) return { icon: TrendingDown, color: 'text-red-600' };
    return { icon: Target, color: 'text-yellow-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-stadium">
        <Navbar />
        <div className="container py-20">
          <LoadingSpinner size="lg" text="Loading standings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-stadium">
      <Navbar />
      
      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-border/50 hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{leagueName} Standings</h1>
              <p className="text-muted-foreground">Season 2023 - Live Standings</p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-primary/20 text-primary">
            <Trophy className="w-3 h-3 mr-1" />
            {filteredStandings.length} Teams
          </Badge>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 backdrop-blur border-border/50 focus:border-primary"
          />
        </div>

        {/* Standings Table */}
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span>League Table</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr className="text-sm text-muted-foreground">
                    <th className="text-left p-4 font-medium">Position</th>
                    <th className="text-left p-4 font-medium">Team</th>
                    <th className="text-center p-4 font-medium hidden sm:table-cell">MP</th>
                    <th className="text-center p-4 font-medium">W</th>
                    <th className="text-center p-4 font-medium">D</th>
                    <th className="text-center p-4 font-medium">L</th>
                    <th className="text-center p-4 font-medium hidden md:table-cell">GF</th>
                    <th className="text-center p-4 font-medium hidden md:table-cell">GA</th>
                    <th className="text-center p-4 font-medium">GD</th>
                    <th className="text-center p-4 font-medium font-bold">PTS</th>
                    <th className="text-center p-4 font-medium hidden lg:table-cell">Form</th>
                    <th className="text-center p-4 font-medium">♥</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStandings.map((standing, index) => {
                    const FormIcon = getFormIndicator(standing.form).icon;
                    return (
                      <tr 
                        key={standing.team.id}
                        className={cn(
                          "border-b border-border/30 hover:bg-accent/30 transition-colors",
                          index % 2 === 0 ? "bg-card/20" : "bg-transparent"
                        )}
                      >
                        {/* Position */}
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className={cn("font-bold text-lg", getPositionColor(standing.rank))}>
                              {standing.rank}
                            </span>
                            {standing.rank <= 4 && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-glow"></div>
                            )}
                          </div>
                        </td>

                        {/* Team */}
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={standing.team.logo} 
                              alt={`${standing.team.name} logo`}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(
                                  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
                                )}`;
                              }}
                            />
                            <div>
                              <p className="font-medium text-foreground line-clamp-1">
                                {standing.team.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {standing.team.country}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Matches Played */}
                        <td className="text-center p-4 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {standing.all.played}
                          </span>
                        </td>

                        {/* Wins, Draws, Losses */}
                        <td className="text-center p-4">
                          <span className="text-sm font-medium text-green-600">
                            {standing.all.win}
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className="text-sm font-medium text-yellow-600">
                            {standing.all.draw}
                          </span>
                        </td>
                        <td className="text-center p-4">
                          <span className="text-sm font-medium text-red-600">
                            {standing.all.lose}
                          </span>
                        </td>

                        {/* Goals */}
                        <td className="text-center p-4 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {standing.all.goals.for}
                          </span>
                        </td>
                        <td className="text-center p-4 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {standing.all.goals.against}
                          </span>
                        </td>

                        {/* Goal Difference */}
                        <td className="text-center p-4">
                          <span className={cn(
                            "text-sm font-medium",
                            standing.goalsDiff > 0 ? "text-green-600" : 
                            standing.goalsDiff < 0 ? "text-red-600" : "text-muted-foreground"
                          )}>
                            {standing.goalsDiff > 0 ? '+' : ''}{standing.goalsDiff}
                          </span>
                        </td>

                        {/* Points */}
                        <td className="text-center p-4">
                          <span className="text-lg font-bold text-primary">
                            {standing.points}
                          </span>
                        </td>

                        {/* Form */}
                        <td className="text-center p-4 hidden lg:table-cell">
                          <div className="flex items-center justify-center space-x-1">
                            <FormIcon className={cn("w-4 h-4", getFormIndicator(standing.form).color)} />
                            <div className="flex space-x-1">
                              {standing.form.slice(-5).split('').map((result, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    result === 'W' ? 'bg-green-500' :
                                    result === 'D' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  )}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Favorite */}
                        <td className="text-center p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavoriteToggle(standing)}
                            className={cn(
                              "w-8 h-8 p-0 transition-all duration-200",
                              isFavorite(standing.team.id) 
                                ? "text-red-500 hover:text-red-600" 
                                : "text-muted-foreground hover:text-red-500"
                            )}
                          >
                            <Heart 
                              className={cn(
                                "w-4 h-4",
                                isFavorite(standing.team.id) && "fill-current"
                              )} 
                            />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Champions League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Europa League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Relegation</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>MP: Matches Played</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>GF: Goals For</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>GA: Goals Against</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>GD: Goal Difference</span>
          </div>
        </div>
      </main>
    </div>
  );
}