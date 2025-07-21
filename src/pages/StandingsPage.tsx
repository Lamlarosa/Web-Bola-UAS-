import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { footballApi, Standing } from '@/services/api';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search, ArrowLeft, Heart, Trophy, Target, TrendingUp, TrendingDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StandingsPage() {
  const { leagueId, season } = useParams<{ leagueId: string; season: string }>();
  const parsedSeason = parseInt(season || '2023');

  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [standings, setStandings] = useState<Standing[]>([]);
  const [filteredStandings, setFilteredStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [leagueName, setLeagueName] = useState('Liga');

  useEffect(() => {
    if (!leagueId || isNaN(Number(leagueId))) {
      toast({
        title: 'ID liga tidak valid',
        description: 'Mengarahkan Ke Beranda.',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }
    fetchStandings(Number(leagueId), parsedSeason);
  }, [leagueId, parsedSeason]);

  useEffect(() => {
    filterStandings();
  }, [searchQuery, standings]);

  const fetchStandings = async (id: number, season: number) => {
    try {
      setLoading(true);
      const data = await footballApi.getStandings(id, season);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Tidak ada klasemen yang ditemukan');
      }

      setStandings(data);
      setFilteredStandings(data);
      setLeagueName(data[0].group || 'League');
    } catch (error) {
      console.error('Kesalahan saat mengambil klasemen:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat klasemen. Silakan coba lagi.',
        variant: 'destructive'
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
    const filtered = standings.filter((s) =>
      s.team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.team.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStandings(filtered);
  };

  const handleFavoriteToggle = (standing: Standing) => {
    if (!isAuthenticated) {
      toast({
        title: 'Harus Masuk Dulu',
        description: 'Silakan masuk untuk menambahkan tim ke favorit.',
        variant: 'destructive'
      });
      return;
    }
    if (isFavorite(standing.team.id)) {
      removeFavorite(standing.team.id);
      toast({ title: 'Dihapus dari favorit', description: `${standing.team.name} dihapus.` });
    } else {
      addFavorite(standing.team);
      toast({ title: 'Ditambahkan ke favorit', description: `${standing.team.name} ditambahkan.` });
    }
  };

  const getPositionColor = (rank: number) => {
    if (rank <= 4) return 'text-green-600 dark:text-green-400';
    if (rank <= 6) return 'text-blue-600 dark:text-blue-400';
    if (rank >= standings.length - 2) return 'text-red-600 dark:text-red-400';
    return 'text-foreground';
  };

  const getFormIndicator = (form: string | null | undefined) => {
    const recent = form?.slice(-5) || '';
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="border-border/50 hover:bg-accent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{leagueName} Standings</h1>
              <p className="text-muted-foreground">Season {parsedSeason}</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary">
            <Trophy className="w-3 h-3 mr-1" />
            {filteredStandings.length} Teams
          </Badge>
        </div>

        <div className="overflow-x-auto border border-border/30 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-card/50 backdrop-blur text-muted-foreground">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">MP</th>
                <th className="px-4 py-2">W</th>
                <th className="px-4 py-2">D</th>
                <th className="px-4 py-2">L</th>
                <th className="px-4 py-2">GF</th>
                <th className="px-4 py-2">GA</th>
                <th className="px-4 py-2">GD</th>
                <th className="px-4 py-2">Pts</th>
                <th className="px-4 py-2">Form</th>
                <th className="px-4 py-2">Fav</th>
              </tr>
            </thead>
            <tbody>
              {filteredStandings.map((standing, index) => {
                const formData = getFormIndicator(standing.form);
                const isFav = isFavorite(standing.team.id);
                return (
                  <tr key={index} className="border-t border-border/20 hover:bg-accent/10">
                    <td className={cn("px-4 py-2 font-semibold", getPositionColor(standing.rank))}>
                      {standing.rank}
                    </td>
                    <td className="px-4 py-2 flex items-center space-x-2">
                      <img src={standing.team.logo} alt={standing.team.name} className="w-5 h-5 object-contain" />
                      <span className="truncate max-w-[120px]">{standing.team.name}</span>
                    </td>
                    <td className="px-4 py-2">{standing.all.played}</td>
                    <td className="px-4 py-2">{standing.all.win}</td>
                    <td className="px-4 py-2">{standing.all.draw}</td>
                    <td className="px-4 py-2">{standing.all.lose}</td>
                    <td className="px-4 py-2">{standing.all.goals.for}</td>
                    <td className="px-4 py-2">{standing.all.goals.against}</td>
                    <td className="px-4 py-2">{standing.goalsDiff}</td>
                    <td className="px-4 py-2 font-bold text-primary">{standing.points}</td>
                    <td className="px-4 py-2">
                      {formData?.icon && <formData.icon className={`w-4 h-4 ${formData.color}`} />}
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        size="icon"
                        variant={isFav ? "default" : "outline"}
                        onClick={() => handleFavoriteToggle(standing)}
                        className="w-8 h-8"
                      >
                        <Heart className={cn("w-4 h-4", isFav && "fill-primary text-primary")} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-4">
          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full" /><span>Champions League</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /><span>Europa League</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full" /><span>Relegation</span></div>
          <div className="flex items-center space-x-2"><span>MP: Matches Played</span></div>
          <div className="flex items-center space-x-2"><span>GF: Goals For</span></div>
          <div className="flex items-center space-x-2"><span>GA: Goals Against</span></div>
          <div className="flex items-center space-x-2"><span>GD: Goal Difference</span></div>
        </div>
      </main>
    </div>
  );
}
