'use client';

import React, { useState } from 'react';
import { Mail, Github, Facebook, Instagram, Heart, Check, Copy } from 'lucide-react';

export default function Footer() {
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

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <p className="text-sm text-gray-500">
              © 2025 Plannerly.
              by students, for students.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:flex md:items-center md:justify-end">
            <div className="flex space-x-6">
              <button
                onClick={copyEmail}
                className="text-gray-400 hover:text-gray-500 flex items-center transition-colors"
                title="Click to copy email"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <Mail className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">{copiedEmail ? 'Copied!' : 'Email'}</span>
              </button>
              <a
                href="https://facebook.com/justineluis.dasa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 flex items-center"
              >
                <Facebook className="w-4 h-4 mr-1" />
                <span className="text-sm">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/jas.teen0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 flex items-center"
              >
                <Instagram className="w-4 h-4 mr-1" />
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://github.com/jasteen1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 flex items-center"
              >
                <Github className="w-4 h-4 mr-1" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-400">
            Built with Next.js, TailwindCSS, and Lucide icons by Justine Luis Dasa
          </p>
        </div>
      </div>
    </footer>
  );
}
