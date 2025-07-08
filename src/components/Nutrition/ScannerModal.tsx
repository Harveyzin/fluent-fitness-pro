
import React, { useState } from 'react';
import { Camera, X, Zap, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNutrition } from '@/contexts/NutritionContext';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const { searchFoods } = useNutrition();

  const mockScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simular resultado do scan
      const mockProduct = {
        barcode: '7891000100103',
        name: 'Leite Integral Parmalat',
        brand: 'Parmalat',
        calories_per_100g: 60,
        protein_per_100g: 3.2,
        carbs_per_100g: 4.5,
        fat_per_100g: 3.5,
        category: 'Laticínios'
      };
      setScannedProduct(mockProduct);
    }, 2000);
  };

  const searchByBarcode = () => {
    if (barcode.length >= 8) {
      // Simular busca por código de barras
      const mockProduct = {
        barcode: barcode,
        name: 'Producto Escaneado',
        brand: 'Marca Genérica',
        calories_per_100g: 250,
        protein_per_100g: 8,
        carbs_per_100g: 30,
        fat_per_100g: 12,
        category: 'Alimentos Processados'
      };
      setScannedProduct(mockProduct);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md h-[80vh] rounded-t-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Scanner de Código</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {!scannedProduct ? (
          <div className="space-y-6">
            {/* Camera View */}
            <Card className="p-8 bg-gray-100 border-2 border-dashed border-gray-300 text-center">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <Zap size={48} className="mx-auto text-fitflow-green" />
                  </div>
                  <p className="text-sm text-muted-foreground">Escaneando...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera size={48} className="mx-auto text-gray-400" />
                  <div>
                    <p className="font-medium">Aponte para o código de barras</p>
                    <p className="text-sm text-muted-foreground">
                      Posicione o código dentro do quadro
                    </p>
                  </div>
                  <Button 
                    onClick={mockScan} 
                    className="bg-fitflow-green hover:bg-fitflow-green/90"
                    disabled={isScanning}
                  >
                    {isScanning ? 'Escaneando...' : 'Simular Scan'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Manual Input */}
            <div className="space-y-3">
              <h4 className="font-medium">Ou digite o código manualmente</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: 7891000100103"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={searchByBarcode}
                  disabled={barcode.length < 8}
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Produto encontrado!</span>
              </div>
              <h4 className="font-semibold text-lg">{scannedProduct.name}</h4>
              <p className="text-sm text-muted-foreground">{scannedProduct.brand}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Código: {scannedProduct.barcode}
              </p>
            </Card>

            <Card className="p-4">
              <h5 className="font-medium mb-2">Informações Nutricionais (100g)</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Calorias: <span className="font-medium">{scannedProduct.calories_per_100g} kcal</span></div>
                <div>Proteínas: <span className="font-medium">{scannedProduct.protein_per_100g}g</span></div>
                <div>Carboidratos: <span className="font-medium">{scannedProduct.carbs_per_100g}g</span></div>
                <div>Gorduras: <span className="font-medium">{scannedProduct.fat_per_100g}g</span></div>
              </div>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setScannedProduct(null)} className="flex-1">
                Escanear Outro
              </Button>
              <Button onClick={onClose} className="flex-1 bg-fitflow-green hover:bg-fitflow-green/90">
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
