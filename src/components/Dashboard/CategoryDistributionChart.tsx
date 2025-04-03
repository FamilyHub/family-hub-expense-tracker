import React, { useState, useMemo } from 'react';
import { Box, styled, Typography, Fade, Tooltip as MuiTooltip, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import PieChartIcon from '@mui/icons-material/PieChart';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
}

const ChartContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const ChartTitle = styled(Typography)`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 32px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartWrapper = styled(Box)`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const LegendContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }
`;

const LegendItem = styled(Box)<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 220px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &::before {
      transform: translateX(100%);
    }
  }
`;

const ColorBox = styled(Box)<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.color};
  box-shadow: 0 0 12px ${props => props.color};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: translateX(100%);
  }
`;

const LegendLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
`;

const LegendValue = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CategoryInfo = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

const TotalAmount = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
`;

const TotalLabel = styled(Typography)`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const COLORS = [
  '#6366f1', '#4ade80', '#f87171', '#facc15', 
  '#fb923c', '#ec4899', '#8b5cf6', '#64748b'
];

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalAmount = useMemo(() => 
    data.reduce((sum, item) => sum + item.amount, 0),
    [data]
  );

  const handlePieEnter = (_: React.MouseEvent<SVGSVGElement>, index: number) => {
    setActiveIndex(index);
    setHoveredIndex(index);
  };

  const handlePieLeave = () => {
    setHoveredIndex(null);
  };

  const handleLegendClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ChartContainer>
      <ChartTitle>
        <PieChartIcon /> Category Distribution
        <MuiTooltip 
          title="Click on categories to highlight and compare distributions"
          arrow
          TransitionComponent={Fade}
        >
          <InfoIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)', cursor: 'help' }} />
        </MuiTooltip>
      </ChartTitle>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={160}
              paddingAngle={2}
              startAngle={90}
              endAngle={450}
              animationDuration={1500}
              animationBegin={0}
              onMouseEnter={handlePieEnter}
              onMouseLeave={handlePieLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  style={{ 
                    filter: activeIndex === index ? 'brightness(1.2)' : 'brightness(1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center center'
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [`${name}: ${value.toFixed(1)}%`, '']}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
              labelStyle={{ 
                color: '#6366f1', 
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
              itemStyle={{
                color: 'white',
                fontSize: '0.875rem'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <CategoryInfo>
          <TotalAmount>₹{totalAmount.toLocaleString()}</TotalAmount>
          <TotalLabel>Total Expenses</TotalLabel>
        </CategoryInfo>
      </ChartWrapper>
      <LegendContainer>
        {data.map((entry, index) => (
          <LegendItem 
            key={entry.category}
            color={COLORS[index % COLORS.length]}
            onClick={() => handleLegendClick(index)}
            sx={{
              opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
              transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
              border: activeIndex === index ? `1px solid ${COLORS[index % COLORS.length]}` : 'none'
            }}
          >
            <ColorBox color={COLORS[index % COLORS.length]} />
            <Box>
              <LegendLabel>{entry.category}</LegendLabel>
              <LegendValue>
                ₹{entry.amount.toLocaleString()} ({entry.percentage.toFixed(1)}%)
                {entry.percentage > 50 ? (
                  <TrendingUpIcon sx={{ fontSize: 14, color: '#4ade80' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 14, color: '#f87171' }} />
                )}
              </LegendValue>
            </Box>
          </LegendItem>
        ))}
      </LegendContainer>
    </ChartContainer>
  );
};

export default CategoryDistributionChart; 