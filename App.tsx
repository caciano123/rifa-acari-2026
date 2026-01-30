
import React, { useState, useEffect, useRef } from 'react';
import { RaffleTable } from './components/RaffleTable';
import { StatsSection } from './components/Stats';
import { RaffleCell } from './types';

const STORAGE_KEY = 'rifa_macaiba_acari_2026_data';
const BG_STORAGE_KEY = 'rifa_macaiba_acari_2026_bg';

// Credenciais de administrador
const ADMIN_USERNAME = 'rifaacari';
const ADMIN_PASSWORD = 'isingA1';

const App: React.FC = () => {
  const [cells, setCells] = useState<RaffleCell[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 400 }, (_, i) => ({ id: i + 1, name: null }));
  });

  const [bgImage, setBgImage] = useState<string>(() => {
    return localStorage.getItem(BG_STORAGE_KEY) || '';
  });

  const [fullNameInput, setFullNameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cells));
  }, [cells]);

  useEffect(() => {
    localStorage.setItem(BG_STORAGE_KEY, bgImage);
  }, [bgImage]);

  const handlePickNumber = (id: number) => {
    const cell = cells.find(c => c.id === id);
    
    if (isAdmin && cell?.name) {
      if (confirm(`Deseja remover "${cell.name}" do número ${id}?`)) {
        setCells(prev => prev.map(c => c.id === id ? { ...c, name: null } : c));
      }
      return;
    }

    const trimmedName = fullNameInput.trim();
    if (!trimmedName) {
      setError('Por favor, digite seu nome e sobrenome antes de escolher um número.');
      return;
    }

    if (cell?.name) {
      setError('Este número já foi escolhido por outra pessoa.');
      return;
    }

    setCells(prev => prev.map(c => c.id === id ? { ...c, name: trimmedName } : c));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === ADMIN_USERNAME && adminPass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setLoginError('');
      setAdminUser('');
      setAdminPass('');
    } else {
      setLoginError('Usuário ou senha incorretos!');
    }
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowAdminModal(true);
    }
  };

  const chosenCount = cells.filter(c => c.name !== null).length;
  const availableCount = 400 - chosenCount;

  return (
    <div className="min-h-screen relative font-sans text-gray-900 flex flex-col bg-yellow-400">
      {/* Background Image overlay with 60% Opacity */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: bgImage ? `url("${bgImage}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.60
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {isAdmin && (
          <div className="bg-red-600 text-white text-center text-xs font-bold py-1 uppercase tracking-widest animate-pulse">
            Modo Administrador Ativo - Clique em um número ocupado para excluir o nome
          </div>
        )}
        
        <header className="pt-8 pb-6 text-center bg-white/40 backdrop-blur-md border-b border-black/10 relative">
          <h1 className="text-[32.4px] font-bold uppercase tracking-widest text-black">
            RIFA DESAFIO MACAÍBA-ACARI 2026
          </h1>
          <p className="text-[12px] mt-1 text-black font-semibold italic">
            Desenvolvido por Caciano Soares
          </p>
          <p 
            className="text-[18px] font-black mt-1 uppercase"
            style={{ 
              color: '#ef4444', 
              textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, -2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff' 
            }}
          >
            Equipe Amigos de Davi
          </p>
          <button 
            onClick={toggleAdmin}
            className={`absolute top-2 right-2 p-2 transition-all rounded-full ${isAdmin ? 'bg-red-500 text-white scale-110 shadow-lg' : 'text-black/30 hover:text-black hover:bg-white/50'}`}
            title={isAdmin ? "Sair do Modo Admin" : "Entrar como Admin"}
          >
            {isAdmin ? '🔓' : '🔒'}
          </button>
        </header>

        <main className="flex-grow max-w-[1400px] mx-auto px-4 py-8 w-full">
          <section className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-10 border-2 border-black">
            <h2 className="text-lg font-bold mb-6 text-center text-blue-900 uppercase tracking-tight">
              Digite seu nome e sobrenome, depois escolha seus números clicando neles 
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-lg">
                <label className="block text-xs font-black mb-1 text-gray-600 uppercase">Nome e Sobrenome</label>
                <input 
                  type="text" 
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full p-3 bg-white border-[3px] border-black rounded-lg shadow-sm focus:ring-0 outline-none transition-all text-sm font-bold text-black placeholder:text-gray-400"
                />
              </div>
            </div>
            {error && <div className="max-w-md mx-auto mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center text-sm font-black animate-bounce border border-red-200">{error}</div>}
          </section>

          <section className={`bg-white p-2 rounded-xl shadow-2xl border-2 overflow-hidden transition-all ${isAdmin ? 'border-red-600 ring-4 ring-red-600/20' : 'border-black'}`}>
            <RaffleTable cells={cells} onPick={handlePickNumber} isAdmin={isAdmin} />
          </section>

          <StatsSection 
            cells={cells} 
            chosenCount={chosenCount} 
            availableCount={availableCount} 
          />
        </main>

        <footer className="pb-12 pt-8 text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-4 px-4">
            {isAdmin && (
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg transition-all flex items-center gap-2 uppercase border-2 border-black"
                >
                  <span>🖼️ Alterar Imagem de Fundo</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <button 
                  onClick={() => { if(confirm('⚠️ ATENÇÃO: Isso apagará TODOS os nomes e números escolhidos. Deseja continuar?')) { localStorage.removeItem(STORAGE_KEY); window.location.reload(); } }}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-md border-2 border-black transition-all uppercase"
                >
                  🗑️ Zerar Tabela Completa
                </button>
              </>
            )}
            {!isAdmin && (
               <div className="text-black/40 text-[10px] uppercase font-bold">
                 Para gerenciar a rifa, acesse o modo administrador clicando no cadeado no topo.
               </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-black text-[10px] font-black uppercase tracking-widest bg-white/60 inline-block px-4 py-1 rounded-full border border-black/20">
              &copy; 2026 - Rifa Desafio Macaíba-Acari | 192KM
            </div>
          </div>
        </footer>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-center mb-6 uppercase tracking-tight">Administração</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-1 uppercase">Usuário</label>
                <input 
                  type="text" 
                  autoFocus
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full p-3 border-2 border-black rounded-xl font-bold focus:ring-0 outline-none"
                  placeholder="rifaacari"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-1 uppercase">Senha</label>
                <input 
                  type="password" 
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full p-3 border-2 border-black rounded-xl font-bold focus:ring-0 outline-none"
                  placeholder="••••••••"
                />
              </div>
              {loginError && (
                <p className="text-red-600 text-xs font-black text-center animate-pulse">{loginError}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-black uppercase text-sm border-2 border-black transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
