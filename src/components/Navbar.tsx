import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, LogOut, User, Heart, Trophy, Home, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/categories', label: 'Categories', icon: Filter },
    ...(isAuthenticated 
      ? [
          { path: '/standings', label: 'Standings', icon: Trophy },
          { path: '/favorites', label: 'Favorites', icon: Heart },
        ]
      : []
    ),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-field rounded-full flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
            <div className="w-3 h-3 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl bg-gradient-field bg-clip-text text-transparent">
            FootballApp
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant={isActive(path) ? "default" : "ghost"}
              asChild
              className={cn(
                "transition-all duration-200",
                isActive(path) 
                  ? "bg-primary text-primary-foreground shadow-field" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Link to={path} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-accent/50 rounded-full">
                <User className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">{user?.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 hover:bg-destructive hover:text-destructive-foreground border-destructive/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button variant="default" asChild className="bg-gradient-field hover:shadow-field">
              <Link to="/login" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-background/95 backdrop-blur">
        <div className="container py-2">
          <div className="flex items-center justify-around">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                asChild
                className={cn(
                  "flex-1 mx-1 transition-all duration-200",
                  isActive(path) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                )}
              >
                <Link to={path} className="flex flex-col items-center space-y-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};