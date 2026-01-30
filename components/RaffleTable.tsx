
import React from 'react';
import { RaffleCell } from '../types';

interface RaffleTableProps {
  cells: RaffleCell[];
  onPick: (id: number) => void;
  isAdmin?: boolean;
}

export const RaffleTable: React.FC<RaffleTableProps> = ({ cells, onPick, isAdmin }) => {
  return (
    <div className="grid-20">
      {cells.map((cell) => (
        <button
          key={cell.id}
          onClick={() => onPick(cell.id)}
          className={`
            raffle-cell relative group overflow-hidden
            ${cell.name 
              ? `bg-blue-600 border-blue-700 ${isAdmin ? 'cursor-pointer hover:bg-red-500' : 'cursor-default'}` 
              : 'bg-white hover:bg-yellow-50 cursor-pointer active:scale-95'}
          `}
        >
          {cell.name ? (
            <div className="flex flex-col items-center justify-center h-full w-full px-0.5">
              <span className="text-[6.5px] leading-[7px] md:text-[8px] md:leading-[9px] text-white font-black uppercase text-center break-words w-full line-clamp-2">
                {isAdmin ? (
                  <span className="group-hover:hidden">{cell.name}</span>
                ) : cell.name}
              </span>
              <span className="text-[9px] md:text-[11px] text-blue-200 font-bold leading-none mt-0.5">
                {isAdmin ? (
                  <span className="group-hover:hidden">{cell.id}</span>
                ) : cell.id}
              </span>
              {isAdmin && (
                <span className="hidden group-hover:block text-white text-[9px] font-black uppercase animate-pulse">
                  Remover
                </span>
              )}
            </div>
          ) : (
            <span className="text-black font-black text-xs md:text-sm">
              {cell.id}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
