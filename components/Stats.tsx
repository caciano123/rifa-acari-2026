
import React, { useMemo } from 'react';
import { RaffleCell, ParticipantStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatsSectionProps {
  cells: RaffleCell[];
  chosenCount: number;
  availableCount: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ cells, chosenCount, availableCount }) => {
  const uniqueNames = useMemo(() => {
    const namesSet = new Set<string>();
    cells.forEach(c => {
      if (c.name) namesSet.add(c.name);
    });
    return Array.from(namesSet).sort();
  }, [cells]);

  const ranking = useMemo(() => {
    const counts: Record<string, number> = {};
    cells.forEach(c => {
      if (c.name) {
        counts[c.name] = (counts[c.name] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [cells]);

  const chartData = [
    { name: 'Escolhidos', value: chosenCount, color: '#3b82f6' }, // Blue
    { name: 'Disponíveis', value: availableCount, color: '#ef4444' } // Red
  ];

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Unique Names Column */}
      <div className="bg-white/90 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Lista de Participantes</h3>
        <ul className="space-y-1 max-h-80 overflow-y-auto">
          {uniqueNames.length > 0 ? (
            uniqueNames.map((name, idx) => (
              <li key={idx} className="text-sm py-1 px-2 hover:bg-gray-50 rounded">
                {name}
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic text-sm">Nenhum participante ainda.</li>
          )}
        </ul>
      </div>

      {/* Ranking Column */}
      <div className="bg-white/90 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Ranking de Compras</h3>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {ranking.length > 0 ? (
            ranking.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm py-1 px-2 bg-blue-50/50 rounded">
                <span className="font-medium truncate mr-2">{item.name}</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {item.count} {item.count === 1 ? 'número' : 'números'}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic text-sm">Ranking vazio.</li>
          )}
        </ul>
      </div>

      {/* Pie Chart Column */}
      <div className="bg-white/90 p-6 rounded-xl shadow-lg flex flex-col items-center">
        <h3 className="text-lg font-bold mb-4 border-b w-full text-center pb-2">Status da Rifa</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold">Total: 400 números</p>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="text-xs text-blue-600 font-bold">{chosenCount} Reservados ({( (chosenCount/400)*100 ).toFixed(1)}%)</span>
            <span className="text-xs text-red-600 font-bold">{availableCount} Livres ({( (availableCount/400)*100 ).toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
