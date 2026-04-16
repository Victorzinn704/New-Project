import { lazy, Suspense, useMemo } from 'react';
import { Users, DollarSign, Calculator } from 'lucide-react';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { Currency } from '../../types';
import { convertAmount, formatCurrency } from '../../utils/currency';
import { useAppContext } from '../../contexts/AppContext';

const DashboardCharts = lazy(() => import('./DashboardCharts').then(m => ({ default: m.DashboardCharts })));

export function DashboardTab() {
  const { employees, expenses, displayCurrency, rates, isDarkMode, setDisplayCurrency, exportData, importData } = useAppContext();

  const totalMonthlyExpenses = useMemo(
    () => expenses.reduce((acc, curr) => acc + convertAmount(curr.amount, curr.currency, displayCurrency, rates), 0),
    [expenses, displayCurrency, rates]
  );

  const totalSalaries = useMemo(
    () => employees.reduce((acc, curr) => acc + convertAmount(curr.salary, 'BRL', displayCurrency, rates), 0),
    [employees, displayCurrency, rates]
  );

  const statusData = useMemo(() => [
    { name: 'Na Empresa', value: employees.filter(e => e.status === 'Na Empresa').length },
    { name: 'Home Office', value: employees.filter(e => e.status === 'Home Office').length },
    { name: 'Afastados', value: employees.filter(e => ['Atestado', 'Tratamento de Saúde'].includes(e.status)).length },
    { name: 'Outros', value: employees.filter(e => !['Na Empresa', 'Home Office', 'Atestado', 'Tratamento de Saúde'].includes(e.status)).length },
  ], [employees]);

  const roleData = useMemo(() => [
    { name: 'Gerente', value: employees.filter(e => e.role === 'Gerente').length },
    { name: 'Senior', value: employees.filter(e => e.role === 'Senior').length },
    { name: 'Pleno', value: employees.filter(e => e.role === 'Pleno').length },
    { name: 'Junior', value: employees.filter(e => e.role === 'Junior').length },
  ], [employees]);

  const opexData = useMemo(() => [
    { name: 'API', value: expenses.filter(ex => ex.type === 'API').reduce((a, c) => a + convertAmount(c.amount, c.currency, displayCurrency, rates), 0) },
    { name: 'Cloud', value: expenses.filter(ex => ex.type === 'Cloud').reduce((a, c) => a + convertAmount(c.amount, c.currency, displayCurrency, rates), 0) },
    { name: 'Utilidades', value: expenses.filter(ex => ['Luz', 'Água', 'Internet'].includes(ex.type)).reduce((a, c) => a + convertAmount(c.amount, c.currency, displayCurrency, rates), 0) },
    { name: 'Licença', value: expenses.filter(ex => ex.type === 'Licença').reduce((a, c) => a + convertAmount(c.amount, c.currency, displayCurrency, rates), 0) },
  ], [expenses, displayCurrency, rates]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Painel de Controle</h2>
          <div className="flex items-center gap-4 mt-2">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Inteligência de dados e monitoramento em tempo real.</p>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={exportData}
                className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
                title="Exportar Backup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Exportar
              </button>
              <label className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`} title="Importar Backup">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                Importar
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 ml-2" />
            <div className={`flex p-1 rounded-lg border ml-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
              {(['BRL', 'USD', 'EUR'] as Currency[]).map(c => (
                <button
                  key={c}
                  onClick={() => setDisplayCurrency(c)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                    displayCurrency === c
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-500 font-bold">Status do Sistema: Online</p>
          <p className="font-mono text-sm opacity-50 capitalize">{format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Capital Humano', value: employees.length, icon: Users, color: 'emerald', sub: 'Colaboradores ativos' },
          { label: 'Folha Mensal', value: formatCurrency(totalSalaries, displayCurrency), icon: DollarSign, color: 'blue', sub: 'Comprometimento salarial' },
          { label: 'OPEX Operacional', value: formatCurrency(totalMonthlyExpenses, displayCurrency), icon: Calculator, color: 'orange', sub: 'Gastos correntes' },
        ].map((stat, i) => (
          <div key={i} className={`p-8 rounded-[32px] border transition-all hover:scale-[1.02] ${
            isDarkMode ? 'bg-zinc-900/50 border-zinc-800 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${
                stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                'bg-orange-500/10 text-orange-500'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>{stat.label}</p>
            <h3 className={`text-3xl font-black tracking-tighter mb-1 ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>{stat.value}</h3>
            <p className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`p-8 rounded-[40px] border h-80 flex items-center justify-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ))}
        </div>
      }>
        <DashboardCharts statusData={statusData} roleData={roleData} opexData={opexData} isDarkMode={isDarkMode} />
      </Suspense>
    </div>
  );
}
