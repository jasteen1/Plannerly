'use client';

import React, { useState } from 'react';
import {
  Code,
  Palette,
  Zap,
  Calendar,
  CheckSquare,
  MapPin,
  Github,
  Mail,
  User,
  Star,
  Facebook,
  Instagram,
  Check
} from 'lucide-react';

export default function AboutPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = "justineluis.dasa@wvsu.edu.ph";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const techStack = [
    { name: 'Next.js 13+', description: 'React framework with App Router', icon: Zap },
    { name: 'TypeScript', description: 'Type-safe JavaScript', icon: Code },
    { name: 'TailwindCSS', description: 'Utility-first CSS framework', icon: Palette },
    { name: 'Lucide Icons', description: 'Beautiful icon library', icon: Star },
    { name: 'Calendarific API', description: 'Official Philippine holidays data', icon: Calendar },
  ];

  const features = [
    {
      name: 'Monthly Calendar',
      description: 'View tasks and holidays in a clean monthly grid',
      icon: Calendar,
    },
    {
      name: 'Task Management',
      description: 'Create, edit, and track your assignments and tasks',
      icon: CheckSquare,
    },
    {
      name: 'Holiday Tracking',
      description: 'Official Philippine holidays plus custom events',
      icon: MapPin,
    },
    {
      name: 'Local Storage',
      description: 'All data persists locally in your browser',
      icon: Code,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plannerly</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive planning tool designed specifically for students to manage their tasks,
            assignments, and stay on top of important dates and holidays.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div key={tech.name} className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                    <p className="text-gray-600">{tech.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* About the App */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">About This App</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Student Planner was built to help students stay organized and productive. Whether you're
              managing assignments, tracking deadlines, or keeping up with holidays, this app provides
              all the tools you need in one convenient location.
            </p>
            <p className="text-gray-600 mb-4">
              The app features a clean, intuitive interface built with modern web technologies.
              All your data is stored locally in your browser, ensuring privacy and fast access.
              No account required - just start planning!
            </p>
            <p className="text-gray-600">
              Official Philippine holidays are fetched from the <strong>Calendarific API</strong>, a reliable
              third-party service that provides accurate and up-to-date holiday information for the Philippines.
              This ensures you always have the correct dates for national holidays, religious observances,
              and special events. You can also add your own custom holidays and events to personalize your
              planning experience and include school-specific or personal important dates.
            </p>
          </div>
        </div>

        {/* APIs & Data Sources */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">APIs & Data Sources</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendarific API</h3>
                <p className="text-gray-600 mb-3">
                  Student Planner integrates with the Calendarific API to provide official Philippine holiday data.
                  This third-party service offers comprehensive holiday information including national holidays,
                  religious observances, and special events across the Philippines.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Features:</strong> Real-time holiday data, automatic updates, accurate dates,
                    multiple holiday types, free tier available for development
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Storage</h3>
                <p className="text-gray-600 mb-3">
                  All user data (tasks, custom holidays, preferences) is stored locally in your browser
                  using localStorage. This ensures your data remains private, loads instantly, and works
                  offline without requiring any account or server storage.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Benefits:</strong> Privacy-focused, instant loading, offline-capable,
                    no account required, data persists between sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">About the Developer</h2>
          <div className="text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Justine Luis Dasa</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Built with passion for helping students succeed. This app demonstrates modern web
              development practices using Next.js, TypeScript, and TailwindCSS.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={copyEmail}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                title="Click to copy email"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{copiedEmail ? 'Copied!' : 'Email'}</span>
              </button>
              <a
                href="https://facebook.com/justineluis.dasa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/jas.teen0/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://github.com/jasteen1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
       Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
