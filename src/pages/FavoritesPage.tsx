import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/Navbar';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart, Edit, Trash2, Plus, Calendar, FileText, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const { favorites, removeFavorite, updateFavorite } = useFavorites();
  const { toast } = useToast();
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFavorites = favorites.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.notes && team.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditNotes = (teamId: number, currentNotes: string = '') => {
    setEditingTeam(teamId);
    setEditNotes(currentNotes);
  };

  const handleSaveNotes = () => {
    if (editingTeam) {
      updateFavorite(editingTeam, editNotes);
      toast({
        title: "Notes updated",
        description: "Your team notes have been saved successfully.",
      });
      setEditingTeam(null);
      setEditNotes('');
    }
  };

  const handleRemoveFavorite = (teamId: number, teamName: string) => {
    removeFavorite(teamId);
    toast({
      title: "Removed from favorites",
      description: `${teamName} has been removed from your favorites.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-stadium">
      <Navbar />
      
      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-field rounded-full flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-field bg-clip-text text-transparent">
              My Favorite Teams
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your favorite football teams and keep notes about their performance, transfer news, and more.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-gradient-field rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-primary">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Favorite Teams</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <p className="text-2xl font-bold text-accent">
                {favorites.filter(team => team.notes && team.notes.trim()).length}
              </p>
              <p className="text-sm text-muted-foreground">With Notes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 bg-gradient-energy rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {new Set(favorites.map(team => team.country)).size}
              </p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        {favorites.length > 0 && (
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search your favorite teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card/50 backdrop-blur border-border/50 focus:border-primary"
            />
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur border-border/50 shadow-card-hover">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No favorite teams yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your collection by adding teams from the standings pages.
              </p>
              <Button 
                onClick={() => window.history.back()}
                className="bg-gradient-field hover:shadow-field"
              >
                <Plus className="w-4 h-4 mr-2" />
                Explore Teams
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search Results Info */}
            {searchQuery && (
              <Alert className="bg-accent-muted border-accent/20">
                <AlertDescription>
                  Showing {filteredFavorites.length} of {favorites.length} teams matching "{searchQuery}"
                </AlertDescription>
              </Alert>
            )}

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((team, index) => (
                <Card 
                  key={team.id}
                  className={cn(
                    "group bg-card/50 backdrop-blur border-border/50 hover:shadow-card-hover transition-all duration-300",
                    "hover:scale-105 hover:-translate-y-1 animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={team.logo} 
                          alt={`${team.name} logo`}
                          className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(
                              '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
                            )}`;
                          }}
                        />
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {team.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{team.country}</p>
                        </div>
                      </div>
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </div>
                  </CardHeader>

                  <CardContent className="py-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>Added {formatDate(team.dateAdded)}</span>
                    </div>

                    {team.notes ? (
                      <div className="bg-accent-muted rounded-lg p-3 border border-accent/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-3 h-3 text-accent" />
                          <span className="text-xs font-medium text-accent">Notes</span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-3">{team.notes}</p>
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                        <p className="text-sm text-muted-foreground italic">No notes added yet</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2 flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-border/50 hover:bg-accent"
                          onClick={() => handleEditNotes(team.id, team.notes)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          {team.notes ? 'Edit' : 'Add'} Notes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card/95 backdrop-blur border-border/50">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <img 
                              src={team.logo} 
                              alt={`${team.name} logo`}
                              className="w-6 h-6 object-contain"
                            />
                            <span>{team.name} Notes</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Add your notes about this team... (transfers, performance, news, etc.)"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={4}
                            className="bg-background/50 border-border/50 focus:border-primary"
                          />
                          <div className="flex space-x-2">
                            <Button 
                              onClick={handleSaveNotes}
                              className="flex-1 bg-gradient-field hover:shadow-field"
                            >
                              Save Notes
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingTeam(null)}
                              className="border-border/50"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveFavorite(team.id, team.name)}
                      className="border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredFavorites.length === 0 && searchQuery && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No teams found matching your search.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 border-border/50"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}