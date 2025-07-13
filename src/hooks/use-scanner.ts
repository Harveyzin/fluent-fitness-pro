import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface ScannedProduct {
  barcode: string
  name: string
  brand: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  category: string
}

// Database simulado de produtos
const PRODUCT_DATABASE: Record<string, ScannedProduct> = {
  '7891000100103': {
    barcode: '7891000100103',
    name: 'Leite Integral Parmalat',
    brand: 'Parmalat',
    calories_per_100g: 60,
    protein_per_100g: 3.2,
    carbs_per_100g: 4.5,
    fat_per_100g: 3.5,
    category: 'Laticínios'
  },
  '7891000100110': {
    barcode: '7891000100110',
    name: 'Iogurte Natural Danone',
    brand: 'Danone',
    calories_per_100g: 45,
    protein_per_100g: 4.1,
    carbs_per_100g: 3.8,
    fat_per_100g: 1.5,
    category: 'Laticínios'
  },
  '7891000100127': {
    barcode: '7891000100127',
    name: 'Pão de Forma Integral Wickbold',
    brand: 'Wickbold',
    calories_per_100g: 250,
    protein_per_100g: 8.5,
    carbs_per_100g: 45,
    fat_per_100g: 4,
    category: 'Panificados'
  },
  '7891000100134': {
    barcode: '7891000100134',
    name: 'Banana Prata',
    brand: 'Fruta Natural',
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 23,
    fat_per_100g: 0.3,
    category: 'Frutas'
  }
}

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const scanBarcode = async (): Promise<ScannedProduct | null> => {
    setIsScanning(true)
    
    try {
      // Simula o processo de scan com delay realista
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simula 80% de chance de sucesso
      if (Math.random() > 0.2) {
        // Retorna um produto aleatório do database
        const barcodes = Object.keys(PRODUCT_DATABASE)
        const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)]
        const product = PRODUCT_DATABASE[randomBarcode]
        
        toast({
          title: "Produto encontrado!",
          description: `${product.name} foi escaneado com sucesso.`,
          variant: "default"
        })
        
        return product
      } else {
        toast({
          title: "Produto não encontrado",
          description: "Não foi possível identificar este código de barras.",
          variant: "destructive"
        })
        return null
      }
    } catch (error) {
      toast({
        title: "Erro no scanner",
        description: "Houve um problema ao escanear o código.",
        variant: "destructive"
      })
      return null
    } finally {
      setIsScanning(false)
    }
  }

  const searchByBarcode = async (barcode: string): Promise<ScannedProduct | null> => {
    if (barcode.length < 8) {
      toast({
        title: "Código inválido",
        description: "O código deve ter pelo menos 8 dígitos.",
        variant: "destructive"
      })
      return null
    }

    setIsSearching(true)
    
    try {
      // Simula busca na API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verifica se existe no database
      const product = PRODUCT_DATABASE[barcode]
      
      if (product) {
        toast({
          title: "Produto encontrado!",
          description: `${product.name} foi encontrado.`,
          variant: "default"
        })
        return product
      } else {
        // Cria um produto genérico se não existe
        const genericProduct: ScannedProduct = {
          barcode: barcode,
          name: 'Produto Genérico',
          brand: 'Marca Desconhecida',
          calories_per_100g: 250,
          protein_per_100g: 8,
          carbs_per_100g: 30,
          fat_per_100g: 12,
          category: 'Alimentos Processados'
        }
        
        toast({
          title: "Produto genérico criado",
          description: "Produto não encontrado no banco, criado registro genérico.",
          variant: "default"
        })
        
        return genericProduct
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Houve um problema ao buscar o produto.",
        variant: "destructive"
      })
      return null
    } finally {
      setIsSearching(false)
    }
  }

  return {
    isScanning,
    isSearching,
    scanBarcode,
    searchByBarcode
  }
}