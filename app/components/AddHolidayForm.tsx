import React, { useState } from 'react';
import { X, Calendar, MapPin, FileText, Sparkles, Heart, GraduationCap, Star } from 'lucide-react';
import { Holiday } from '../utils/types';

interface AddHolidayFormProps {
  onAdd: (holiday: Omit<Holiday, 'id' | 'isOfficial'>) => void;
  onClose: () => void;
  initialData?: Partial<Holiday>;
}

export default function AddHolidayForm({ onAdd, onClose, initialData }: AddHolidayFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [type, setType] = useState(initialData?.type || 'Festival');
  const [description, setDescription] = useState(initialData?.description || '');

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      onAdd({ name, date, type, description });
      setName('');
      setDate('');
      setType('Festival');
      setDescription('');
      if (!initialData) onClose();
    }
  };

  const holidayTypes = [
    { value: 'Festival', label: 'Festival', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
    { value: 'School Event', label: 'School Event', icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
    { value: 'Personal', label: 'Personal', icon: Heart, color: 'text-pink-600 bg-pink-50' },
    { value: 'Religious', label: 'Religious', icon: Star, color: 'text-yellow-600 bg-yellow-50' },
    { value: 'National', label: 'National', icon: MapPin, color: 'text-red-600 bg-red-50' },
    { value: 'Other', label: 'Other', icon: Calendar, color: 'text-gray-600 bg-gray-50' },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {initialData ? 'Edit Holiday' : 'Add Custom Holiday'}
                </h2>
                <p className="text-green-100 text-sm">
                  {initialData ? 'Update your holiday details' : 'Create a special day to remember'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Holiday Name */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-green-500" />
              Holiday Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-900 placeholder-gray-400"
              required
              placeholder="Enter holiday name"
            />
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              required
            />
          </div>

          {/* Type Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4 text-purple-500" />
              Holiday Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {holidayTypes.map((hType) => {
                const Icon = hType.icon;
                const isSelected = type === hType.value;
                return (
                  <button
                    key={hType.value}
                    type="button"
                    onClick={() => setType(hType.value)}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      isSelected
                        ? `${hType.color} border-current shadow-md`
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{hType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
              placeholder="Add more details about this holiday (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {initialData ? 'Update Holiday' : 'Create Holiday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
