import React, { useState, useEffect, useMemo } from 'react';
import { Box, styled, Paper, Typography, TextField, MenuItem } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const ChartContainer = styled(Paper)`
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(30, 30, 30, 0.4) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
  height: 450px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: linear-gradient(
      45deg,
      transparent 45%,
      rgba(99, 102, 241, 0.05) 50%,
      transparent 55%
    );
    animation: shine 10s infinite linear;
  }

  @keyframes shine {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StatsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const StatCard = styled(Paper)`
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(30, 30, 30, 0.4) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(99, 102, 241, 0.7),
      rgba(79, 70, 229, 0.7)
    );
    transform: scaleX(0.7);
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(99, 102, 241, 0.1) inset;

    &::before {
      transform: scaleX(1);
      opacity: 1;
    }
  }
`;

const StatTitle = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const StatValue = styled(Typography)`
  color: white;
  font-size: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  
  @keyframes pulse {
    0% {
      text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
    }
    50% {
      text-shadow: 0 2px 20px rgba(99, 102, 241, 0.5);
    }
    100% {
      text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
    }
  }
  
  animation: pulse 3s infinite ease-in-out;
`;

const StatChange = styled(Typography)<{ isPositive?: boolean }>`
  color: ${props => props.isPositive ? '#4ade80' : '#f87171'};
  font-size: 0.875rem;
  font-weight: 500;
`;

const DateRangeSelector = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 32px;

  .MuiTextField-root {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(30, 30, 30, 0.4) 100%);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    min-width: 200px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
    }

    .MuiOutlinedInput-root {
      color: white;
      
      fieldset {
        border-color: rgba(255, 255, 255, 0.1);
        transition: border-color 0.3s ease;
      }

      &:hover fieldset {
        border-color: rgba(99, 102, 241, 0.5);
      }

      &.Mui-focused fieldset {
        border-color: rgba(99, 102, 241, 0.8);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }
    }

    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

type RenderActiveShapeProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: CategoryData;
  percent: number;
  value: number;
};

interface Transaction {
  type: 'cashIn' | 'cashOut';
  amount: number;
  date: Date;
  category: string;
  receiverName: string;
  description: string;
}

const COLORS: Record<string, string> = {
  Bill: '#6366f1',
  Shopping: '#4ade80',
  Betting: '#f87171',
  Loan: '#facc15',
  EMIs: '#fb923c',
  Food: '#ec4899',
  Travel: '#8b5cf6',
  Others: '#64748b'
};

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  // Create gradient ID based on category
  const gradientId = `gradient-${payload.name.toLowerCase()}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.6} />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.5" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${gradientId})`}
        filter="url(#shadow)"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 15}
        fill={fill}
        filter="url(#glow)"
        opacity={0.3}
      />
      <path 
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} 
        stroke={fill} 
        strokeWidth={2}
        fill="none"
        filter="url(#glow)"
        opacity={0.8}
      />
      <circle 
        cx={ex} 
        cy={ey} 
        r={3} 
        fill={fill} 
        stroke="none"
        filter="url(#glow)"
      />
      <g filter="url(#glow)">
        <text 
          x={ex + (cos >= 0 ? 1 : -1) * 12} 
          y={ey} 
          textAnchor={textAnchor} 
          fill="#fff"
          style={{ 
            fontSize: '14px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}
        >
          {payload.name}
        </text>
        <text 
          x={ex + (cos >= 0 ? 1 : -1) * 12} 
          y={ey} 
          dy={20} 
          textAnchor={textAnchor} 
          fill="#fff"
          style={{ 
            fontSize: '12px',
            textShadow: '0 0 8px rgba(0,0,0,0.5)'
          }}
        >
          {`${formatCurrency(value)}`}
        </text>
        <text 
          x={ex + (cos >= 0 ? 1 : -1) * 12} 
          y={ey} 
          dy={36} 
          textAnchor={textAnchor} 
          fill="#fff"
          style={{ 
            fontSize: '11px',
            opacity: 0.8,
            textShadow: '0 0 8px rgba(0,0,0,0.5)'
          }}
        >
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    </g>
  );
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const mockTransactions: Transaction[] = Array.from({ length: 50 }, () => ({
      type: Math.random() > 0.3 ? 'cashOut' : 'cashIn',
      amount: Math.floor(Math.random() * 10000) + 500,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      category: Object.keys(COLORS)[Math.floor(Math.random() * Object.keys(COLORS).length)],
      receiverName: 'Mock Receiver',
      description: 'Mock Transaction'
    }));
    setTransactions(mockTransactions);
  }, []);

  const dateRangeInterval = useMemo(() => {
    const date = selectedDate.toDate();
    switch (dateRange) {
      case 'month':
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
      case 'quarter':
        return {
          start: startOfMonth(subMonths(date, 2)),
          end: endOfMonth(date)
        };
      case 'year':
        return {
          start: startOfMonth(subMonths(date, 11)),
          end: endOfMonth(date)
        };
    }
  }, [selectedDate, dateRange]);

  const categoryData = useMemo(() => {
    const filteredTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), dateRangeInterval)
    );

    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'cashOut') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: COLORS[name] || COLORS.Others
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, dateRangeInterval]);

  const stats = useMemo(() => {
    const filteredTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), dateRangeInterval)
    );

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'cashOut')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'cashIn')
      .reduce((sum, t) => sum + t.amount, 0);

    const topCategory = categoryData[0]?.name || 'N/A';
    const topCategoryPercentage = categoryData[0] 
      ? ((categoryData[0].value / totalExpenses) * 100).toFixed(1)
      : '0';

    return {
      totalExpenses,
      totalIncome,
      monthlyChange: ((totalIncome - totalExpenses) / totalExpenses * 100).toFixed(1),
      topCategory,
      topCategoryPercentage
    };
  }, [transactions, dateRangeInterval, categoryData]);

  const handlePieEnter = (event: React.MouseEvent<SVGSVGElement>, index: number) => {
    setActiveIndex(index);
  };

  return (
    <PageContainer>
      <Header>
        <DateRangeSelector>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => newDate && setSelectedDate(newDate)}
            slotProps={{
              textField: {
                fullWidth: true,
              }
            }}
          />
          <TextField
            select
            label="Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'month' | 'quarter' | 'year')}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="quarter">Quarterly</MenuItem>
            <MenuItem value="year">Yearly</MenuItem>
          </TextField>
        </DateRangeSelector>
      </Header>

      <ChartContainer>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Category-wise Expenses
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {Object.entries(COLORS).map(([category, color]) => (
                <linearGradient key={category} id={`gradient-${category.toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={handlePieEnter}
              startAngle={90}
              endAngle={450}
              animationDuration={1500}
              animationBegin={0}
              blendStroke
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={`url(#gradient-${entry.name.toLowerCase()})`}
                  stroke={entry.color}
                  strokeWidth={2}
                  style={{
                    filter: hoveredCategory === entry.name 
                      ? 'brightness(1.2) drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5))'
                      : 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3))',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCategory(entry.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CategoryData;
                  return (
                    <Box
                      sx={{
                        background: 'rgba(10, 10, 20, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        transform: 'scale(1)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        }
                      }}
                    >
                      <Typography sx={{ 
                        color: data.color, 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {data.name}
                      </Typography>
                      <Typography sx={{ 
                        color: 'white',
                        fontSize: '1rem',
                        mt: 0.5
                      }}>
                        {formatCurrency(data.value)}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <StatsGrid>
        <StatCard>
          <StatTitle>Total Expenses</StatTitle>
          <StatValue>{formatCurrency(stats.totalExpenses)}</StatValue>
          <StatChange isPositive={false}>
            Balance: {formatCurrency(stats.totalIncome - stats.totalExpenses)}
          </StatChange>
        </StatCard>

        <StatCard>
          <StatTitle>Total Income</StatTitle>
          <StatValue>{formatCurrency(stats.totalIncome)}</StatValue>
          <StatChange isPositive={true}>
            +{((stats.totalIncome / stats.totalExpenses - 1) * 100).toFixed(1)}% vs expenses
          </StatChange>
        </StatCard>

        <StatCard>
          <StatTitle>Monthly Change</StatTitle>
          <StatValue>{stats.monthlyChange}%</StatValue>
          <StatChange isPositive={parseFloat(stats.monthlyChange) > 0}>
            {parseFloat(stats.monthlyChange) > 0 ? 'Surplus' : 'Deficit'}
          </StatChange>
        </StatCard>

        <StatCard>
          <StatTitle>Top Category</StatTitle>
          <StatValue>{stats.topCategory}</StatValue>
          <StatChange>{stats.topCategoryPercentage}% of total expenses</StatChange>
        </StatCard>
      </StatsGrid>
    </PageContainer>
  );
};

export default DashboardPage;
