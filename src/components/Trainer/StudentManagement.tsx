import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, User, Mail, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTrainer, Student } from '@/contexts/TrainerContext';
import { useToast } from '@/hooks/use-toast';
import { StudentProfileModal } from './StudentProfileModal';

const StudentManagement = () => {
  const { students, addStudent, removeStudent, selectStudent, selectedStudent, updateStudentProgress } = useTrainer();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newStudentModal, setNewStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    plan: 'Basic'
  });
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    addStudent({
      ...newStudent,
      avatar: newStudent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      joinDate: new Date().toISOString().split('T')[0],
      lastWorkout: 'Never',
      progress: 0,
      status: 'pending'
    });

    setNewStudent({ name: '', email: '', plan: 'Basic' });
    setNewStudentModal(false);
    toast({
      title: "Sucesso",
      description: "Aluno adicionado com sucesso!"
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    removeStudent(studentId);
    toast({
      title: "Sucesso",
      description: "Aluno removido com sucesso!"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h2 className="text-2xl font-bold mb-1">Gerenciar Alunos</h2>
          <p className="text-muted-foreground">Acompanhe o progresso dos seus alunos</p>
        </div>
        <Dialog open={newStudentModal} onOpenChange={setNewStudentModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o email"
                />
              </div>
              <div>
                <Label htmlFor="plan">Plano</Label>
                <Select value={newStudent.plan} onValueChange={(value) => setNewStudent(prev => ({ ...prev, plan: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddStudent} className="flex-1">
                  Adicionar Aluno
                </Button>
                <Button variant="outline" onClick={() => setNewStudentModal(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 shadow-card animate-scale-in">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar alunos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <Filter size={16} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-3 animate-slide-up">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-4 shadow-card hover:shadow-card-hover transition-smooth">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-fitflow-green text-white font-bold">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{student.name}</h3>
                  <Badge className={`text-xs ${getStatusColor(student.status)}`}>
                    {getStatusText(student.status)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {student.plan}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Mail size={12} />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    Desde {new Date(student.joinDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress value={student.progress} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{student.progress}%</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedStudentProfile(student)}>
                    <User size={16} className="mr-2" />
                    Ver Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Criar Treino", description: "Criar treino personalizado para " + student.name })}>
                    <Target size={16} className="mr-2" />
                    Criar Treino
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStudentProgress(student.id, Math.min(100, student.progress + 10))}>
                    <TrendingUp size={16} className="mr-2" />
                    Atualizar Progresso
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Enviar Mensagem", description: "Funcionalidade de mensagem será implementada" })}>
                    <Mail size={16} className="mr-2" />
                    Enviar Mensagem
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-red-600"
                  >
                    Remover Aluno
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-8 text-center shadow-card">
          <User size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Nenhum aluno encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Tente ajustar os filtros de busca' 
              : 'Adicione seu primeiro aluno para começar'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button onClick={() => setNewStudentModal(true)}>
              Adicionar Primeiro Aluno
            </Button>
          )}
        </Card>
      )}

      <StudentProfileModal
        student={selectedStudentProfile}
        isOpen={!!selectedStudentProfile}
        onClose={() => setSelectedStudentProfile(null)}
      />
    </div>
  );
};

export default StudentManagement;