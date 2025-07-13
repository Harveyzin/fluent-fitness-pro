
import React, { useState } from 'react';
import { Camera, X, Zap, Search, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNutrition } from '@/contexts/NutritionContext';
import { useScanner } from '@/hooks/use-scanner';
import { toast } from '@/hooks/use-toast';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose }) => {
  const [barcode, setBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [selectedMeal, setSelectedMeal] = useState<string>('snack');
  const { addFood } = useNutrition();
  const { isScanning, isSearching, scanBarcode, searchByBarcode } = useScanner();

  const handleScan = async () => {
    const product = await scanBarcode();
    if (product) {
      setScannedProduct(product);
    }
  };

  const handleBarcodeSearch = async () => {
    const product = await searchByBarcode(barcode);
    if (product) {
      setScannedProduct(product);
    }
  };

  const handleAddToMeal = () => {
    if (scannedProduct) {
      const foodItem = {
        id: Date.now().toString(),
        name: scannedProduct.name,
        calories_per_100g: scannedProduct.calories_per_100g,
        protein_per_100g: scannedProduct.protein_per_100g,
        carbs_per_100g: scannedProduct.carbs_per_100g,
        fat_per_100g: scannedProduct.fat_per_100g,
        category: scannedProduct.category || 'Escaneados'
      };
      
      addFood(selectedMeal as any, foodItem, 100);
      
      toast({
        title: "Produto adicionado!",
        description: `${scannedProduct.name} foi adicionado ao ${selectedMeal === 'breakfast' ? 'café da manhã' : selectedMeal === 'lunch' ? 'almoço' : selectedMeal === 'dinner' ? 'jantar' : 'lanche'}.`,
        variant: "default"
      });
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-background w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Scanner de Código</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {!scannedProduct ? (
          <div className="space-y-6">
            {/* Camera View */}
            <Card className="p-8 bg-muted/30 border-2 border-dashed border-muted-foreground/30 text-center">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                  <div className="space-y-2">
                    <Zap size={48} className="mx-auto text-primary animate-pulse" />
                    <p className="font-medium text-foreground">Escaneando produto...</p>
                    <p className="text-sm text-muted-foreground">Mantenha o código visível</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera size={48} className="mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Aponte para o código de barras</p>
                    <p className="text-sm text-muted-foreground">
                      Posicione o código dentro do quadro
                    </p>
                  </div>
                  <Button 
                    onClick={handleScan} 
                    className="bg-primary hover:bg-primary/90"
                    disabled={isScanning}
                  >
                    <Camera className="mr-2" size={16} />
                    Escanear Código
                  </Button>
                </div>
              )}
            </Card>

            {/* Manual Input */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Ou digite o código manualmente</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: 7891000100103"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1"
                  disabled={isSearching}
                />
                <Button 
                  variant="outline" 
                  onClick={handleBarcodeSearch}
                  disabled={barcode.length < 8 || isSearching}
                >
                  {isSearching ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search size={16} />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Códigos suportados: 7891000100103, 7891000100110, 7891000100127, 7891000100134
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 bg-success/10 border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Produto encontrado!</span>
              </div>
              <h4 className="font-semibold text-lg text-foreground">{scannedProduct.name}</h4>
              <p className="text-sm text-muted-foreground">{scannedProduct.brand}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Código: {scannedProduct.barcode}
              </p>
            </Card>

            <Card className="p-4">
              <h5 className="font-medium mb-3 text-foreground">Informações Nutricionais (100g)</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calorias:</span>
                  <span className="font-medium text-foreground">{scannedProduct.calories_per_100g} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proteínas:</span>
                  <span className="font-medium text-foreground">{scannedProduct.protein_per_100g}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carboidratos:</span>
                  <span className="font-medium text-foreground">{scannedProduct.carbs_per_100g}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gorduras:</span>
                  <span className="font-medium text-foreground">{scannedProduct.fat_per_100g}g</span>
                </div>
              </div>
            </Card>

            {/* Meal Selection */}
            <Card className="p-4">
              <h5 className="font-medium mb-3 text-foreground">Adicionar à refeição</h5>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'breakfast', label: 'Café da manhã' },
                  { id: 'lunch', label: 'Almoço' },
                  { id: 'snack', label: 'Lanche' },
                  { id: 'dinner', label: 'Jantar' }
                ].map((meal) => (
                  <Button
                    key={meal.id}
                    variant={selectedMeal === meal.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMeal(meal.id)}
                    className="text-xs"
                  >
                    {meal.label}
                  </Button>
                ))}
              </div>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setScannedProduct(null)} className="flex-1">
                Escanear Outro
              </Button>
              <Button onClick={handleAddToMeal} className="flex-1 bg-primary hover:bg-primary/90">
                Adicionar à Refeição
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerModal;
