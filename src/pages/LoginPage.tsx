import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Eye, EyeOff, User, Lock, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Silakan isi semua kolom');
      return;
    }

    const success = await login(username, password);

    if (success) {
      toast({
        title: "Selamat Datang",
        description: "Anda telah berhasil login.",
      });
    } else {
      setError('Nama pengguna atau kata sandi tidak valid');
      toast({
        title: "Login Gagal",
        description: "Silakan periksa kredensial Anda dan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-stadium p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-card-hover border-border/50 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-field rounded-full flex items-center justify-center shadow-glow">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-field bg-clip-text text-transparent">
                Dunia Bola
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Masuk untuk Mengakses Semua Fitur
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-primary focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 transition-all duration-200 focus:ring-primary focus:border-primary"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-field hover:shadow-field transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <div className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Akun Demo</span>
                </div>
              </div>

              <div className="text-center space-y-2 p-4 bg-accent-muted rounded-lg border border-accent/20">
                <p className="text-sm font-medium text-accent-foreground">Coba Akun Demo Berikut:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Username:</span>
                    <p className="font-mono font-bold text-accent">demo</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Password:</span>
                    <p className="font-mono font-bold text-accent">12345</p>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Tombol kembali ke beranda */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mt-6 text-sm text-primary hover:underline mx-auto block"
        >
          ← Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
