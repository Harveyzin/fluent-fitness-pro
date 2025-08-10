import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BioimpedanceForm } from '@/components/Bioimpedance/BioimpedanceForm';
import { BioimpedanceChart } from '@/components/Bioimpedance/BioimpedanceChart';

interface BioimpedanceSectionProps {
  studentId: string;
  allowAdd?: boolean;
}

const BioimpedanceSection: React.FC<BioimpedanceSectionProps> = ({ studentId, allowAdd = true }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card className="p-0 shadow-card animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bioimpedância</CardTitle>
        {allowAdd && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2" size="sm">
            <Plus size={16} />
            Nova Medição
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Nova Medição</CardTitle>
            </CardHeader>
            <CardContent>
              <BioimpedanceForm studentId={studentId} onSubmit={() => setShowForm(false)} />
            </CardContent>
          </Card>
        )}

        <BioimpedanceChart studentId={studentId} />
      </CardContent>
    </Card>
  );
};

export default BioimpedanceSection;
