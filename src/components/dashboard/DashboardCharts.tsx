import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { COLORS } from '../../utils/currency';

interface ChartData {
  name: string;
  value: number;
}

interface ChartsProps {
  statusData: ChartData[];
  roleData: ChartData[];
  opexData: ChartData[];
  isDarkMode: boolean;
}

export function DashboardCharts({ statusData, roleData, opexData, isDarkMode }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
        <h4 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
          Status da Equipe
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value"
              >
                {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
        <h4 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
          Distribuição por Cargo
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f1f5f9'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#a1a1aa' : '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#a1a1aa' : '#64748b' }} />
              <Tooltip
                cursor={{ fill: isDarkMode ? '#18181b' : '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDarkMode ? '#18181b' : '#fff', color: isDarkMode ? '#fff' : '#000', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
        <h4 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
          OPEX por Categoria
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={opexData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f1f5f9'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#a1a1aa' : '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#a1a1aa' : '#64748b' }} />
              <Tooltip
                cursor={{ fill: isDarkMode ? '#18181b' : '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDarkMode ? '#18181b' : '#fff', color: isDarkMode ? '#fff' : '#000', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
