import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  telegramClicks: number;
  phoneClicks: number;
  whatsappClicks: number;
  emailClicks: number;
  totalClicks: number;
  dailyData: Array<{
    date: string;
    telegram: number;
    phone: number;
    whatsapp: number;
    email: number;
  }>;
  modelViews: Array<{
    modelName: string;
    views: number;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    telegramClicks: 0,
    phoneClicks: 0,
    whatsappClicks: 0,
    emailClicks: 0,
    totalClicks: 0,
    dailyData: [],
    modelViews: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Simulated data - replace with real API call
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      const dailyData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        dailyData.push({
          date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
          telegram: Math.floor(Math.random() * 15) + 5,
          phone: Math.floor(Math.random() * 20) + 8,
          whatsapp: Math.floor(Math.random() * 25) + 10,
          email: Math.floor(Math.random() * 8) + 2
        });
      }

      const telegramClicks = dailyData.reduce((sum, day) => sum + day.telegram, 0);
      const phoneClicks = dailyData.reduce((sum, day) => sum + day.phone, 0);
      const whatsappClicks = dailyData.reduce((sum, day) => sum + day.whatsapp, 0);
      const emailClicks = dailyData.reduce((sum, day) => sum + day.email, 0);

      return {
        telegramClicks,
        phoneClicks,
        whatsappClicks,
        emailClicks,
        totalClicks: telegramClicks + phoneClicks + whatsappClicks + emailClicks,
        dailyData,
        modelViews: [
          { modelName: 'Mia', views: 145 },
          { modelName: 'Kimberly', views: 132 },
          { modelName: 'Teresa', views: 98 },
          { modelName: 'Elena', views: 87 },
          { modelName: 'Alicia', views: 76 },
          { modelName: 'Silvia', views: 65 },
          { modelName: 'Yaiza', views: 54 },
          { modelName: 'Paula (VIP)', views: 43 },
          { modelName: 'Naty', views: 38 },
          { modelName: 'Erika', views: 32 },
          { modelName: 'Lana', views: 28 },
          { modelName: 'Luna', views: 25 },
          { modelName: 'Carla', views: 22 },
          { modelName: 'Estefany', views: 18 },
          { modelName: 'Claudia (VIP)', views: 15 }
        ]
      };
    };

    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const COLORS = ['#c2b2a3', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const contactData = [
    { name: 'Telegram', value: data.telegramClicks, color: '#0088cc' },
    { name: 'Teléfono', value: data.phoneClicks, color: '#10b981' },
    { name: 'WhatsApp', value: data.whatsappClicks, color: '#25d366' },
    { name: 'Email', value: data.emailClicks, color: '#f59e0b' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c2b2a3] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-gray-400">Seguimiento de clics en tiempo real</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8 flex gap-4">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              timeRange === range
                ? 'bg-[#c2b2a3] text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            {range === '7d' ? 'Últimos 7 días' : range === '30d' ? 'Últimos 30 días' : 'Últimos 90 días'}
          </button>
        ))}
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
          <p className="text-3xl font-bold">{data.telegramClicks}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">📞 Teléfono</h3>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">📞</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.phoneClicks}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">💬 WhatsApp</h3>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">💬</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.whatsappClicks}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">✉️ Email</h3>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">✉️</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.emailClicks}</p>
          <p className="text-sm text-gray-400">clics totales</p>
        </div>
      </div>

      {/* Total Clicks */}
      <div className="bg-gradient-to-r from-[#c2b2a3] to-[#8b5cf6] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">🎯 Total de Clics</h2>
        <p className="text-4xl font-bold">{data.totalClicks}</p>
        <p className="text-sm opacity-80">en los últimos {timeRange === '7d' ? '7 días' : timeRange === '30d' ? '30 días' : '90 días'}</p>
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
            <LineChart data={data.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="telegram" stroke="#0088cc" strokeWidth={2} name="Telegram" />
              <Line type="monotone" dataKey="phone" stroke="#10b981" strokeWidth={2} name="Teléfono" />
              <Line type="monotone" dataKey="whatsapp" stroke="#25d366" strokeWidth={2} name="WhatsApp" />
              <Line type="monotone" dataKey="email" stroke="#f59e0b" strokeWidth={2} name="Email" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Views */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Vistas por Modelo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.modelViews.map((model, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
              <span className="font-medium">{model.modelName}</span>
              <span className="text-[#c2b2a3] font-bold">{model.views}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            const csvContent = `Método,Clics\nTelegram,${data.telegramClicks}\nTeléfono,${data.phoneClicks}\nWhatsApp,${data.whatsappClicks}\nEmail,${data.emailClicks}`;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="px-8 py-3 bg-[#c2b2a3] text-black font-semibold rounded-lg hover:bg-[#d4c4b0] transition-colors"
        >
          📥 Exportar Datos (CSV)
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
