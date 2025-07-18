import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeagueCard } from '@/components/LeagueCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { footballApi, League } from '@/services/api';
import { Globe, Flag, Star, Trophy, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CategoryPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Popular countries and regions
  const categories = [
    { id: 'all', label: 'All Leagues', icon: Globe },
    { id: 'england', label: 'England', icon: Flag },
    { id: 'spain', label: 'Spain', icon: Flag },
    { id: 'italy', label: 'Italy', icon: Flag },
    { id: 'germany', label: 'Germany', icon: Flag },
    { id: 'france', label: 'France', icon: Flag },
    { id: 'europe', label: 'European Cups', icon: Trophy },
    { id: 'international', label: 'International', icon: Star },
  ];

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await footballApi.getLeagues();
      
      // Filter for current season and popular leagues
      const currentSeasonLeagues = data.filter(league => 
        league.season >= 2023
      );
      
      setLeagues(currentSeasonLeagues);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      toast({
        title: "Error",
        description: "Failed to load leagues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLeagues = (category: string): League[] => {
    switch (category) {
      case 'england':
        return leagues.filter(league => 
          league.country.toLowerCase().includes('england') || 
          league.name.includes('Premier League') ||
          league.name.includes('Championship') ||
          league.name.includes('FA Cup')
        );
      
      case 'spain':
        return leagues.filter(league => 
          league.country.toLowerCase().includes('spain') ||
          league.name.includes('La Liga') ||
          league.name.includes('Copa del Rey')
        );
      
      case 'italy':
        return leagues.filter(league => 
          league.country.toLowerCase().includes('italy') ||
          league.name.includes('Serie A') ||
          league.name.includes('Coppa Italia')
        );
      
      case 'germany':
        return leagues.filter(league => 
          league.country.toLowerCase().includes('germany') ||
          league.name.includes('Bundesliga') ||
          league.name.includes('DFB Pokal')
        );
      
      case 'france':
        return leagues.filter(league => 
          league.country.toLowerCase().includes('france') ||
          league.name.includes('Ligue 1') ||
          league.name.includes('Coupe de France')
        );
      
      case 'europe':
        return leagues.filter(league => 
          league.name.includes('Champions League') ||
          league.name.includes('Europa League') ||
          league.name.includes('Conference League') ||
          league.name.includes('Super Cup')
        );
      
      case 'international':
        return leagues.filter(league => 
          league.name.includes('World Cup') ||
          league.name.includes('Euro') ||
          league.name.includes('Copa America') ||
          league.name.includes('Nations League') ||
          league.name.includes('African Cup')
        );
      
      default:
        return leagues.slice(0, 50); // Limit to first 50 leagues
    }
  };

  const handleViewStandings = (leagueId: number) => {
    navigate(`/standings/${leagueId}`);
  };

  const currentLeagues = getFilteredLeagues(selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-stadium">
        <Navbar />
        <div className="container py-20">
          <LoadingSpinner size="lg" text="Loading categories..." />
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
              <h1 className="text-3xl font-bold bg-gradient-field bg-clip-text text-transparent">
                League Categories
              </h1>
              <p className="text-muted-foreground">
                Explore leagues by country and competition type
              </p>
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-card/50 backdrop-blur border border-border/50">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex flex-col items-center space-y-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {/* Category Info */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-field rounded-full flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{category.label}</h2>
                        <p className="text-sm text-muted-foreground">
                          {currentLeagues.length} leagues available
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      Season 2023
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Leagues Grid */}
              {currentLeagues.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <category.icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No leagues found
                    </h3>
                    <p className="text-muted-foreground">
                      No leagues available in this category for the current season.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentLeagues.map((league, index) => (
                    <LeagueCard
                      key={league.id}
                      league={league}
                      onViewStandings={handleViewStandings}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Category Stats */}
              {currentLeagues.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-card/30 backdrop-blur border-border/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-lg font-bold text-primary">{currentLeagues.length}</p>
                      <p className="text-xs text-muted-foreground">Total Leagues</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/30 backdrop-blur border-border/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-lg font-bold text-accent">
                        {new Set(currentLeagues.map(l => l.country)).size}
                      </p>
                      <p className="text-xs text-muted-foreground">Countries</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/30 backdrop-blur border-border/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-lg font-bold text-foreground">
                        {currentLeagues.filter(l => l.season === 2023).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Current Season</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/30 backdrop-blur border-border/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-lg font-bold text-primary">
                        {currentLeagues.filter(l => 
                          l.name.includes('Premier') || l.name.includes('Liga') || 
                          l.name.includes('Serie') || l.name.includes('Bundesliga')
                        ).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Top Leagues</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}