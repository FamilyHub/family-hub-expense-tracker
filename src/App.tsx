import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import MoneyManager from './components/MoneyManager';

function App() {
  return (
    <div className="app bg-gray-900 min-h-screen">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home/cashbook" replace />} />
          <Route path="/home" element={<Navigate to="/home/cashbook" replace />} />
          <Route path="/home/*" element={<MoneyManager />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
