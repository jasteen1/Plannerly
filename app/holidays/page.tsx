'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Calendar, MapPin } from 'lucide-react';
import { Holiday } from '../utils/types';
import { loadFromStorage, saveToStorage } from '../utils/helpers';
import HolidayBadge from '../components/HolidayBadge';
import AddHolidayForm from '../components/AddHolidayForm';

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'official' | 'custom'>('all');
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // Load custom holidays from localStorage
      const savedCustomHolidays = loadFromStorage<Holiday[]>('customHolidays', []);
      setCustomHolidays(savedCustomHolidays);

      // Fetch official holidays
      await fetchOfficialHolidays();
    };

    loadData();
  }, []);

  // Save custom holidays to localStorage when they change
  useEffect(() => {
    saveToStorage('customHolidays', customHolidays);
  }, [customHolidays]);

  const fetchOfficialHolidays = async (year?: number) => {
    setLoading(true);
    try {
      const targetYear = year || new Date().getFullYear();
      const response = await fetch(`/api/holidays?year=${targetYear}`);
      if (response.ok) {
        const data = await response.json();
        setHolidays(data.holidays || []);
      }
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine and filter holidays
  const allHolidays = [...holidays, ...customHolidays];
  const filteredHolidays = allHolidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' ||
                       (filterType === 'official' && holiday.isOfficial) ||
                       (filterType === 'custom' && !holiday.isOfficial);

    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const addCustomHoliday = (holidayData: Omit<Holiday, 'id' | 'isOfficial'>) => {
    const newHoliday: Holiday = {
      ...holidayData,
      id: `custom-${Date.now()}`,
      isOfficial: false,
    };
    setCustomHolidays(prev => [...prev, newHoliday]);
    setShowAddHoliday(false);
  };

  const updateCustomHoliday = (holidayData: Omit<Holiday, 'id' | 'isOfficial'>) => {
    if (!editingHoliday) return;

    setCustomHolidays(prev => prev.map(holiday =>
      holiday.id === editingHoliday.id
        ? { ...holiday, ...holidayData }
        : holiday
    ));
    setEditingHoliday(null);
  };

  const deleteCustomHoliday = (holidayId: string) => {
    setCustomHolidays(prev => prev.filter(h => h.id !== holidayId));
  };

  const startEditing = (holiday: Holiday) => {
    setEditingHoliday(holiday);
  };

  const stats = {
    total: allHolidays.length,
    official: holidays.length,
    custom: customHolidays.length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Holidays</h1>
            <button
              onClick={() => setShowAddHoliday(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Holiday
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Holidays</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.official}</p>
              <p className="text-sm text-gray-600">Official</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.custom}</p>
              <p className="text-sm text-gray-600">Custom</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search holidays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Holidays</option>
              <option value="official">Official Only</option>
              <option value="custom">Custom Only</option>
            </select>
          </div>
        </div>

        {/* Holidays List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading holidays...</p>
          </div>
        ) : filteredHolidays.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHolidays.map(holiday => (
              <div key={holiday.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {holiday.isOfficial ? (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    ) : (
                      <MapPin className="w-5 h-5 text-green-600" />
                    )}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      holiday.isOfficial ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {holiday.isOfficial ? 'Official' : 'Custom'}
                    </span>
                  </div>
                  {!holiday.isOfficial && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(holiday)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit holiday"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCustomHoliday(holiday.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete holiday"
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{holiday.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{holiday.type}</p>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {new Date(holiday.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {holiday.description && (
                  <p className="text-sm text-gray-600">{holiday.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No holidays found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No holidays available for the current year.'}
            </p>
          </div>
        )}

        {/* Modals */}
        {showAddHoliday && (
          <AddHolidayForm
            onAdd={addCustomHoliday}
            onClose={() => setShowAddHoliday(false)}
          />
        )}

        {editingHoliday && (
          <AddHolidayForm
            onAdd={updateCustomHoliday}
            onClose={() => setEditingHoliday(null)}
            initialData={editingHoliday}
          />
        )}
      </div>
    </div>
  );
}
