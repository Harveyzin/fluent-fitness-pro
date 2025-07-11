import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, HelpCircle, Download, Trash2, RotateCcw, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';

const SettingsScreen = () => {
  const { notifications, privacy, preferences, updateNotifications, updatePrivacy, updatePreferences, resetToDefaults, exportData, deleteAccount } = useSettings();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    updateNotifications({ [key]: value });
    toast({
      title: "Configuração atualizada",
      description: "Suas preferências de notificação foram salvas.",
    });
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    updatePrivacy({ [key]: value });
    toast({
      title: "Privacidade atualizada",
      description: "Suas configurações de privacidade foram salvas.",
    });
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    updatePreferences({ [key]: value });
    toast({
      title: "Preferências atualizadas",
      description: "Suas configurações foram salvas.",
    });
  };

  const handleReset = () => {
    resetToDefaults();
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para o padrão.",
    });
  };

  const handleExport = () => {
    exportData();
    toast({
      title: "Dados exportados",
      description: "Seus dados foram baixados com sucesso.",
    });
  };

  const faqItems = [
    {
      question: "Como alterar minha meta de calorias?",
      answer: "Vá para a tela de Nutrição e clique em 'Definir Metas' para personalizar suas metas calóricas e de macronutrientes."
    },
    {
      question: "Como criar um treino personalizado?",
      answer: "Na tela de Treinos, clique em 'Novo Treino' e depois em 'Criar Personalizado' para montar seu próprio treino."
    },
    {
      question: "Como ativar o modo Personal Trainer?",
      answer: "Vá para o seu Perfil e ative o switch 'Modo Personal Trainer' para acessar ferramentas profissionais."
    },
    {
      question: "Como fazer backup dos meus dados?",
      answer: "Use a opção 'Exportar Dados' nas configurações para baixar um arquivo com todas as suas informações."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Configurações</h2>
        <p className="text-muted-foreground">Personalize sua experiência no FitFlow Pro</p>
      </div>

      {/* Notifications */}
      <Card className="p-6 shadow-card animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-fitflow-green" size={24} />
          <h3 className="text-lg font-semibold">Notificações</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Lembretes de Treino</h4>
              <p className="text-sm text-muted-foreground">Receba notificações para não perder seus treinos</p>
            </div>
            <Switch
              checked={notifications.workoutReminders}
              onCheckedChange={(value) => handleNotificationChange('workoutReminders', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Lembretes de Refeição</h4>
              <p className="text-sm text-muted-foreground">Alertas para registrar suas refeições</p>
            </div>
            <Switch
              checked={notifications.mealReminders}
              onCheckedChange={(value) => handleNotificationChange('mealReminders', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Atualizações de Progresso</h4>
              <p className="text-sm text-muted-foreground">Notificações sobre suas conquistas</p>
            </div>
            <Switch
              checked={notifications.progressUpdates}
              onCheckedChange={(value) => handleNotificationChange('progressUpdates', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Relatórios Semanais</h4>
              <p className="text-sm text-muted-foreground">Resumo semanal do seu progresso</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(value) => handleNotificationChange('weeklyReports', value)}
            />
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-blue-500" size={24} />
          <h3 className="text-lg font-semibold">Privacidade</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Visibilidade do Perfil</label>
            <Select
              value={privacy.profileVisibility}
              onValueChange={(value: 'public' | 'friends' | 'private') => handlePrivacyChange('profileVisibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="friends">Apenas Amigos</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Compartilhar Treinos</h4>
              <p className="text-sm text-muted-foreground">Permitir que outros vejam seus treinos</p>
            </div>
            <Switch
              checked={privacy.shareWorkouts}
              onCheckedChange={(value) => handlePrivacyChange('shareWorkouts', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Compartilhar Progresso</h4>
              <p className="text-sm text-muted-foreground">Mostrar seu progresso para outros usuários</p>
            </div>
            <Switch
              checked={privacy.shareProgress}
              onCheckedChange={(value) => handlePrivacyChange('shareProgress', value)}
            />
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="text-purple-500" size={24} />
          <h3 className="text-lg font-semibold">Preferências</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tema</label>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Idioma</label>
            <Select
              value={preferences.language}
              onValueChange={(value: 'pt' | 'en' | 'es') => handlePreferenceChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unidades</label>
            <Select
              value={preferences.units}
              onValueChange={(value: 'metric' | 'imperial') => handlePreferenceChange('units', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Métrico (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lb, ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer animate-slide-up">
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogTrigger asChild>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-orange-500" size={20} />
                <span className="font-medium">Ajuda & Suporte</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Central de Ajuda</DialogTitle>
              <DialogDescription>
                Encontre respostas para as perguntas mais frequentes sobre o FitFlow Pro
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Perguntas Frequentes</h3>
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{item.question}</h4>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Ainda precisa de ajuda?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Entre em contato conosco através do email: suporte@fitflowpro.com
                </p>
                <Button variant="outline" size="sm">
                  Enviar Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Data Management */}
      <Card className="p-6 shadow-card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-slate-500" size={24} />
          <h3 className="text-lg font-semibold">Gerenciamento de Dados</h3>
        </div>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            Exportar Meus Dados
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleReset}
          >
            <RotateCcw size={16} className="mr-2" />
            Resetar Configurações
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 size={16} className="mr-2" />
                Excluir Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Conta</DialogTitle>
                <DialogDescription>
                  Confirme a exclusão permanente da sua conta e todos os dados associados
                </DialogDescription>
              </DialogHeader>
              <Alert>
                <AlertDescription>
                  Esta ação é irreversível. Todos os seus dados, treinos, progressos e configurações serão permanentemente excluídos.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteAccount();
                    setShowDeleteDialog(false);
                    toast({
                      title: "Solicitação enviada",
                      description: "Sua solicitação de exclusão foi processada.",
                      variant: "destructive"
                    });
                  }}
                >
                  Confirmar Exclusão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-muted-foreground animate-slide-up">
        FitFlow Pro v1.0.0 - Configurações
      </div>
    </div>
  );
};

export default SettingsScreen;