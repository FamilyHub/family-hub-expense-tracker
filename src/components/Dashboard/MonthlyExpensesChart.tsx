import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface MonthlyExpense {
  month: string;
  expenses: number;
}

interface MonthlyExpensesChartProps {
  data: MonthlyExpense[];
  totalExpenses: number;
  averageExpenses: number;
}

const ChartHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 24px;
`;

const ChartTitle = styled(Typography)`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartSubtitle = styled(Typography)`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  gap: 16px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
    }
  }
`;

const ScrollContainer = styled(Box)`
  overflow-x: auto;
  position: relative;
  margin: 0;
  padding: 0;
  
  &::-webkit-scrollbar {
    height: 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    transition: background-color 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const ChartWrapper = styled(Box)`
  min-width: 2000px;
  height: 200px;
  position: relative;
  padding: 0 24px;
`;

const YearLabel = styled(Typography)`
  position: absolute;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  transform: translateX(-50%);
  bottom: -20px;
`;

const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({
  data,
  totalExpenses,
  averageExpenses
}) => {
  // Fix for TypeScript error by using Array.from instead of spread operator
  const years = Array.from(new Set(data.map(item => item.month.split(' ')[1])));
  const monthsPerYear = 12;

  return (
    <>
      <ChartHeader>
        <ChartTitle>
          <TrendingUpIcon /> Monthly Expenses
        </ChartTitle>
        <ChartSubtitle>
          <span>Total: ₹{totalExpenses.toLocaleString()}</span>
          <span>Avg: ₹{averageExpenses.toLocaleString()}</span>
        </ChartSubtitle>
      </ChartHeader>
      
      <ScrollContainer>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
            >
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
                <filter id="expenseShadow" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#ef4444" floodOpacity={0.5}/>
                </filter>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255, 255, 255, 0.03)" 
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="month" 
                stroke="rgba(255, 255, 255, 0.5)"
                tick={{ 
                  fill: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: 11,
                  fontWeight: 500
                }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                padding={{ left: 0, right: 0 }}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              
              <YAxis hide={true} />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.98)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  padding: '12px 16px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Expenses']}
                labelStyle={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  marginBottom: '4px'
                }}
                cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#expenseGradient)"
                fillOpacity={1}
                dot={{ 
                  fill: '#ef4444', 
                  stroke: 'rgba(239, 68, 68, 0.3)',
                  strokeWidth: 2, 
                  r: 4,
                  filter: 'url(#expenseShadow)'
                }}
                activeDot={{ 
                  r: 6, 
                  fill: '#ef4444',
                  stroke: '#fff',
                  strokeWidth: 2,
                  filter: 'url(#glow)'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Year labels */}
          {years.map((year, index) => (
            <YearLabel
              key={year}
              sx={{
                left: `${((index * monthsPerYear) + monthsPerYear/2) * (100/data.length)}%`
              }}
            >
              {year}
            </YearLabel>
          ))}
        </ChartWrapper>
      </ScrollContainer>
    </>
  );
};

export default MonthlyExpensesChart; 