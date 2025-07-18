import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeagueCard } from '@/components/LeagueCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { footballApi, League } from '@/services/api';
import { Search, Trophy, Globe, Star, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    filterLeagues();
  }, [searchQuery, selectedCountry, leagues]);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await footballApi.getLeagues();
      
      // Filter for popular leagues and current season
      const popularLeagues = data.filter(league => 
        league.season >= 2023 && 
        [
          'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 
          'Ligue 1', 'Champions League', 'Europa League',
          'World Cup', 'Euro Championship', 'Copa America'
        ].some(popular => league.name.includes(popular))
      ).slice(0, 20);

      setLeagues(popularLeagues);
      setFilteredLeagues(popularLeagues);
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

  const filterLeagues = () => {
    let filtered = leagues;

    if (searchQuery) {
      filtered = filtered.filter(league =>
        league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        league.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(league => league.country === selectedCountry);
    }

    setFilteredLeagues(filtered);
  };

  const handleViewStandings = (leagueId: number) => {
    navigate(`/standings/${leagueId}`);
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(leagues.map(league => league.country))];
    return countries.sort();
  };

  const getFeaturedLeagues = () => {
    return filteredLeagues.filter(league => 
      ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'].some(featured => 
        league.name.includes(featured)
      )
    ).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-stadium">
        <Navbar />
        <div className="container py-20">
          <LoadingSpinner size="lg" text="Loading football leagues..." />
        </div>
      </div>
    );
  }

  const featuredLeagues = getFeaturedLeagues();
  const countries = getUniqueCountries();

  return (
    <div className="min-h-screen bg-gradient-stadium">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-field bg-clip-text text-transparent animate-fade-in">
              Football Universe
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in">
              Discover leagues, track standings, and follow your favorite teams across the globe
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 animate-scale-in">
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Globe className="w-3 h-3 mr-1" />
              200+ Leagues
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Trophy className="w-3 h-3 mr-1" />
              Live Standings
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <Star className="w-3 h-3 mr-1" />
              Favorites
            </Badge>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leagues or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 backdrop-blur border-border/50 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Country Filter */}
            <div className="flex gap-2">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 bg-card/50 backdrop-blur border border-border/50 rounded-md text-sm focus:border-primary transition-all duration-200"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <Button 
                variant="outline" 
                onClick={() => navigate('/categories')}
                className="border-border/50 hover:bg-accent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Categories
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Leagues */}
        {featuredLeagues.length > 0 && !searchQuery && !selectedCountry && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Featured Leagues</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLeagues.map((league, index) => (
                <LeagueCard
                  key={league.id}
                  league={league}
                  onViewStandings={handleViewStandings}
                  className={`animate-scale-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Leagues */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                {searchQuery || selectedCountry ? 'Search Results' : 'All Leagues'}
              </h2>
              <Badge variant="outline" className="border-primary/20 text-primary">
                {filteredLeagues.length}
              </Badge>
            </div>
          </div>

          {filteredLeagues.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No leagues found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCountry('');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLeagues.map((league, index) => (
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
        </section>
      </main>
    </div>
  );
}