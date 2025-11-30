import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Robot } from '../App';

interface PerformanceChartsProps {
  robots: Robot[];
}

export function PerformanceCharts({ robots }: PerformanceChartsProps) {
  const batteryData = robots.map(robot => ({
    name: robot.name,
    battery: robot.battery,
  }));

  const efficiencyData = robots.map(robot => ({
    name: robot.name,
    efficiency: robot.efficiency,
  }));

  const statusData = [
    { name: 'Active', value: robots.filter(r => r.status === 'active').length },
    { name: 'Idle', value: robots.filter(r => r.status === 'idle').length },
    { name: 'Maintenance', value: robots.filter(r => r.status === 'maintenance').length },
    { name: 'Offline', value: robots.filter(r => r.status === 'offline').length },
  ].filter(item => item.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Battery Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Battery Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={batteryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="battery" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Robot Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Temperature */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={robots.map(r => ({ name: r.name, temperature: r.temperature }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="temperature" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
