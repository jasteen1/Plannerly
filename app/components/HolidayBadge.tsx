import React from 'react';
import { Star, MapPin, X } from 'lucide-react';
import { Holiday } from '../utils/types';

interface HolidayBadgeProps {
  holiday: Holiday;
  onDelete?: () => void;
  compact?: boolean;
}

export default function HolidayBadge({ holiday, onDelete, compact = false }: HolidayBadgeProps) {
  const bgColor = holiday.isOfficial ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  const icon = holiday.isOfficial ? <Star className="w-3 h-3" /> : <MapPin className="w-3 h-3" />;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} mr-1 mb-1`}>
        {icon}
        <span className="truncate max-w-16">{holiday.name}</span>
        {!holiday.isOfficial && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="ml-1 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className={`p-1 rounded-full ${bgColor}`}>
            {icon}
          </div>
          <div>
            <h5 className="font-medium text-gray-900">{holiday.name}</h5>
            <p className="text-sm text-gray-600">{holiday.type}</p>
            {holiday.description && (
              <p className="text-sm text-gray-500 mt-1">{holiday.description}</p>
            )}
          </div>
        </div>
        {!holiday.isOfficial && onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
