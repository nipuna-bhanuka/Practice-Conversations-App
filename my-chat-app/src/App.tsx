import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ScenarioLibraryPage from '@/pages/ScenarioLibraryPage';
import ScenarioBriefingPage from '@/pages/ScenarioBriefingPage';
import ChatPage from '@/pages/ChatPage';
import ResultsPage from '@/pages/ResultsPage';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter([
  { path: '/', element: <ScenarioLibraryPage /> },
  { path: '/scenarios/:id', element: <ScenarioBriefingPage /> },
  { path: '/scenarios/:id/chat', element: <ChatPage /> },
  { path: '/scenarios/:id/results', element: <ResultsPage /> },
  { path: '*', element: <NotFound /> },
]);

export default function App() {

  useEffect(() => router.subscribe(() => window.scrollTo(0, 0)), []);
  return <RouterProvider router={router} />;
}
