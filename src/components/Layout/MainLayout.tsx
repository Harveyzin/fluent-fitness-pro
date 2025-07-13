
import React, { useState } from 'react';
import { Home, Apple, Dumbbell, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout = ({ children, activeTab, onTabChange }: MainLayoutProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'nutrition', label: 'Nutrição', icon: Apple },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell },
    { id: 'progress', label: 'Progresso', icon: TrendingUp },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-foreground">FitFlow Pro</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 px-safe">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-50 pb-safe">
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-smooth px-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={20} className={cn(isActive && "scale-110")} />
                <span className="text-xs font-medium truncate">{tab.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
