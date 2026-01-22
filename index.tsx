
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(container);

// Simple error boundary wrapper
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-10 text-center">
          <div>
            <h1 className="text-4xl font-bangers mb-4">Cosmic Disruption</h1>
            <p className="mb-6 opacity-70">The timeline encountered a fatal error. Please refresh the nebula.</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 px-6 py-2 rounded-full uppercase text-xs font-bold tracking-widest">Re-initialize</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
