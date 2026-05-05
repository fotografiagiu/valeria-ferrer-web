import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface LocalAnalyticsData {
  clicks: {
    Telegram: number;
    Phone: number;
    WhatsApp: number;
    Email: number;
  };
  daily: Record<string, {
    Telegram: number;
    Phone: number;
    WhatsApp: number;
    Email: number;
  }>;
  recent: Array<{
    type: string;
    url: string;
    timestamp: string;
    page: string;
  }>;
}

const LocalAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<LocalAnalyticsData>({
    clicks: { Telegram: 0, Phone: 0, WhatsApp: 0, Email: 0 },
    daily: {},
    recent: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const localData = JSON.parse(localStorage.getItem('local-analytics') || '{}');
        
        // Ensure data structure
        const analyticsData: LocalAnalyticsData = {
          clicks: localData.clicks || { Telegram: 0, Phone: 0, WhatsApp: 0, Email: 0 },
          daily: localData.daily || {},
          recent: localData.recent || []
        };

        setData(analyticsData);
      } catch (error) {
        console.error('Error loading local analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Update data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearData = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los datos locales?')) {
      localStorage.removeItem('local-analytics');
      setData({
        clicks: { Telegram: 0, Phone: 0, WhatsApp: 0, Email: 0 },
        daily: {},
        recent: []
      });
    }
  };

  const exportData = () => {
    const csvContent = `Tipo,Clics\nTelegram,${data.clicks.Telegram}\nTeléfono,${data.clicks.Phone}\nWhatsApp,${data.clicks.WhatsApp}\nEmail,${data.clicks.Email}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Prepare chart data
  const totalClicks = Object.values(data.clicks).reduce((sum, val) => sum + val, 0);
  
  const contactData = [
    { name: 'Telegram', value: data.clicks.Telegram, color: '#0088cc' },
    { name: 'Teléfono', value: data.clicks.Phone, color: '#10b981' },
    { name: 'WhatsApp', value: data.clicks.WhatsApp, color: '#25d366' },
    { name: 'Email', value: data.clicks.Email, color: '#f59e0b' }
  ];

  // Prepare daily data for line chart
  const dailyData = Object.entries(data.daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7) // Last 7 days
    .map(([date, clicks]) => ({
      date: new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      Telegram: clicks.Telegram,
      Phone: clicks.Phone,
      WhatsApp: clicks.WhatsApp,
      Email: clicks.Email
    }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c2b2a3] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Cargando analytics locales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Analytics Locales (Sin Cookies)</h1>
        <p className="text-gray-400">Datos almacenados localmente - 100% privado y sin cookies</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">📱 Telegram</h3>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">📱</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.clicks.Telegram}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">📞 Teléfono</h3>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">📞</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.clicks.Phone}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">💬 WhatsApp</h3>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">💬</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.clicks.WhatsApp}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">✉️ Email</h3>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">✉️</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.clicks.Email}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>
      </div>

      {/* Total Clicks */}
      <div className="bg-gradient-to-r from-[#c2b2a3] to-[#8b5cf6] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">🎯 Total de Clics (Locales)</h2>
        <p className="text-4xl font-bold">{totalClicks}</p>
        <p className="text-sm opacity-80">almacenados sin cookies</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contact Methods Chart */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Métodos de Contacto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contactData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contactData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} clics`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Trends Chart */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Tendencias Diarias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Telegram" stroke="#0088cc" strokeWidth={2} name="Telegram" />
              <Line type="monotone" dataKey="Phone" stroke="#10b981" strokeWidth={2} name="Teléfono" />
              <Line type="monotone" dataKey="WhatsApp" stroke="#25d366" strokeWidth={2} name="WhatsApp" />
              <Line type="monotone" dataKey="Email" stroke="#f59e0b" strokeWidth={2} name="Email" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data.recent.slice(0, 20).map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{activity.type}</span>
                <span className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
              <span className="text-xs text-gray-400">{activity.page}</span>
            </div>
          ))}
          {data.recent.length === 0 && (
            <p className="text-center text-gray-400 py-4">No hay actividad reciente</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={exportData}
          className="px-8 py-3 bg-[#c2b2a3] text-black font-semibold rounded-lg hover:bg-[#d4c4b0] transition-colors"
        >
          📥 Exportar Datos (CSV)
        </button>
        <button
          onClick={clearData}
          className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          🗑️ Borrar Datos Locales
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📖 Cómo Ver los Datos</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• <strong>Consola del Navegador:</strong> Abre F12 y verás los clics en tiempo real</p>
          <p>• <strong>Este Dashboard:</strong> Datos actualizados cada 5 segundos</p>
          <p>• <strong>LocalStorage:</strong> Datos guardados en el navegador del usuario</p>
          <p>• <strong>100% Privado:</strong> Sin cookies, sin servidores externos</p>
          <p>• <strong>Export CSV:</strong> Descarga los datos para análisis externos</p>
        </div>
      </div>
    </div>
  );
};

export default LocalAnalyticsDashboard;
