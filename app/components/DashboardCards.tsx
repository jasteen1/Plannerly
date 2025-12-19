import React from 'react';
import Link from 'next/link';
import { Calendar, CheckSquare, MapPin, Info, ArrowRight } from 'lucide-react';

const cards = [
  {
    name: 'Planner',
    href: '/planner',
    description: 'View monthly calendar with tasks and holidays',
    icon: Calendar,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Tasks',
    href: '/tasks',
    description: 'Manage your tasks and assignments',
    icon: CheckSquare,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Holidays',
    href: '/holidays',
    description: 'View official and custom holidays',
    icon: MapPin,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'About',
    href: '/about',
    description: 'Learn about the Student Planner app',
    icon: Info,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.name}
            href={card.href}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.name}
              </h3>
              <p className="text-sm text-gray-600">
                {card.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
