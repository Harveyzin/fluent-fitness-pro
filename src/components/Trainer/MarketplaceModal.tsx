import React, { useState } from 'react';
import { ShoppingBag, Star, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrainer } from '@/contexts/TrainerContext';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketplaceModal = ({ isOpen, onClose }: MarketplaceModalProps) => {
  const { workoutTemplates, stats } = useTrainer();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Visualização do Treino",
      description: "Abrindo detalhes do treino selecionado"
    });
  };

  const handleEditTemplate = (templateId: string) => {
    toast({
      title: "Editar Treino",
      description: "Função de edição será implementada em breve"
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    toast({
      title: "Treino Removido",
      description: "Treino removido do marketplace com sucesso",
      variant: "destructive"
    });
  };

  const marketplaceStats = [
    { label: 'Total de Vendas', value: `R$ ${(stats.monthlyRevenue * 12).toLocaleString()}`, color: 'text-green-600' },
    { label: 'Treinos Vendidos', value: '359', color: 'text-blue-600' },
    { label: 'Avaliação Média', value: `${stats.rating}★`, color: 'text-orange-600' },
    { label: 'Taxa de Conversão', value: '23%', color: 'text-purple-600' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="text-fitflow-green" size={24} />
            Marketplace de Treinos
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Meus Produtos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Marketplace Stats */}
            <div className="grid grid-cols-2 gap-4">
              {marketplaceStats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Atividade Recente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">HIIT Intenso</p>
                    <p className="text-sm text-muted-foreground">Vendido por R$ 29,99</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+R$ 29,99</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Força Funcional</p>
                    <p className="text-sm text-muted-foreground">Vendido por R$ 39,99</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+R$ 39,99</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Nova avaliação recebida</p>
                    <p className="text-sm text-muted-foreground">5 estrelas no HIIT Intenso</p>
                  </div>
                  <div className="flex text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Meus Treinos</h3>
              <Button size="sm">Adicionar Novo Treino</Button>
            </div>

            <div className="grid gap-4">
              {workoutTemplates.map((template) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{template.duration} min</span>
                        <span>{template.exercises} exercícios</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} fill="currentColor" className="text-orange-500" />
                          <span>{template.rating}</span>
                        </div>
                        <span>{template.sales} vendas</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 mb-2">
                        R$ {template.price.toFixed(2)}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleViewTemplate(template.id)}>
                          <Eye size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template.id)}>
                          <Edit size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Análise de Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Produto Mais Vendido</h4>
                    <p className="text-sm text-muted-foreground">Força Funcional - 203 vendas</p>
                  </div>
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Melhor Avaliação</h4>
                    <p className="text-sm text-muted-foreground">Força Funcional - 4.9★</p>
                  </div>
                  <Star className="text-orange-500" size={24} fill="currentColor" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Receita Total</h4>
                    <p className="text-sm text-muted-foreground">R$ 12.350 este mês</p>
                  </div>
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Metas e Objetivos</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Meta Mensal de Vendas</span>
                    <span>73% (R$ 10.950 / R$ 15.000)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-fitflow-green h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Novos Produtos</span>
                    <span>2 / 5 planejados</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceModal;