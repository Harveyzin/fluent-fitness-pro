
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/components/Dashboard/Dashboard';
import NutritionScreen from '@/components/Nutrition/NutritionScreen';
import WorkoutsScreen from '@/components/Workouts/WorkoutsScreen';
import ProgressScreen from '@/components/Progress/ProgressScreen';
import ProfileScreen from '@/components/Profile/ProfileScreen';
import { NutritionProvider } from '@/contexts/NutritionContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'nutrition':
        return <NutritionScreen />;
      case 'workouts':
        return <WorkoutsScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <NutritionProvider>
      <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </MainLayout>
    </NutritionProvider>
  );
};

export default Index;
