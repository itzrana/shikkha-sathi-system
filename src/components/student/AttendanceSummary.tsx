
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const AttendanceSummary: React.FC = () => {
  // Mock data - in real app, this would come from API
  const attendanceStats = {
    totalDays: 166,
    presentDays: 156,
    absentDays: 7,
    lateDays: 3,
    percentage: 94.0,
    weeklyAverage: 4.8,
    monthlyTrend: 'increasing'
  };

  const pieData = [
    { name: 'Present', value: attendanceStats.presentDays, color: '#10B981' },
    { name: 'Absent', value: attendanceStats.absentDays, color: '#EF4444' },
    { name: 'Late', value: attendanceStats.lateDays, color: '#F59E0B' },
  ];

  const trendData = [
    { week: 'Week 1', attendance: 95 },
    { week: 'Week 2', attendance: 92 },
    { week: 'Week 3', attendance: 96 },
    { week: 'Week 4', attendance: 94 },
    { week: 'Week 5', attendance: 97 },
    { week: 'Week 6', attendance: 93 },
  ];

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 95) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 85) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 75) return { level: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(attendanceStats.percentage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Attendance Summary / সংক্ষিপ্ত রিপোর্ট
        </h2>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Overall Performance / সামগ্রিক কর্মক্ষমতা
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-blue-600">{attendanceStats.percentage}%</div>
              <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${performance.bg} ${performance.color}`}>
                {performance.level}
              </div>
              <Progress value={attendanceStats.percentage} className="h-3" />
              <p className="text-gray-600">
                You've attended <strong>{attendanceStats.presentDays}</strong> out of <strong>{attendanceStats.totalDays}</strong> total days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-green-600">{attendanceStats.weeklyAverage}/5</div>
              <p className="text-green-700 text-sm">Days per week</p>
              <div className="text-xs text-gray-600">
                {attendanceStats.monthlyTrend === 'increasing' ? '↗️ Improving' : '↘️ Declining'} trend
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Present Days</p>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.presentDays}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Absent Days</p>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absentDays}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Late Days</p>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.lateDays}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Days</p>
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.totalDays}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Attendance Distribution / উপস্থিতির বিতরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Trend / সাপ্তাহিক প্রবণতা</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals & Achievements */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Goals & Achievements / লক্ষ্য ও অর্জন
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-800">Monthly Goal</h3>
              <p className="text-sm text-gray-600">95% attendance</p>
              <div className="mt-2">
                <Progress value={94} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">94% achieved</p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold text-gray-800">Perfect Week</h3>
              <p className="text-sm text-gray-600">5/5 days attended</p>
              <p className="text-xs text-green-600 mt-1">Achieved 3 times!</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-gray-800">Improvement</h3>
              <p className="text-sm text-gray-600">vs last month</p>
              <p className="text-xs text-blue-600 mt-1">+2.5% better</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummary;
