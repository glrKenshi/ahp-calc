import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledResultContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const StyledResultItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
});

const StyledLabel = styled(Typography)({
  width: '120px',
  marginRight: '16px',
  fontWeight: 'bold',
});

const StyledBarContainer = styled(Box)({
  flexGrow: 1,
  position: 'relative',
  height: '24px',
  backgroundColor: '#f0f0f0',
  borderRadius: '12px',
  overflow: 'hidden',
});

const StyledBar = styled(Box)({
  height: '100%',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #4a90e2, #6a5acd)',
  transition: 'width 0.5s ease',
});

const StyledPercentage = styled(Typography)({
  width: '60px',
  textAlign: 'right',
  marginLeft: '16px',
  fontWeight: 'bold',
  color: '#333',
});

const StyledYear = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '0.75rem',
  color: '#666',
  zIndex: 1,
}));

const AhpResults = ({ task }) => {
  const theme = useTheme();

  if (!task.analysisCompleted) {
    return null;
  }

  // Функция для создания матрицы парных сравнений
  const createComparisonMatrix = (items, comparisons) => {
    const n = items.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(1));
    
    for (let i = 0; i < n; i++) {
      matrix[i][i] = 1;
    }
    
    comparisons.forEach(([item1, item2, value]) => {
      const i = items.indexOf(item1);
      const j = items.indexOf(item2);
      matrix[i][j] = value;
      matrix[j][i] = 1 / value;
    });
    
    return matrix;
  };

  // Функция для вычисления весов методом среднего геометрического
  const calculateWeights = (matrix) => {
    const n = matrix.length;
    const weights = [];
    
    // Вычисляем среднее геометрическое каждой строки
    for (let i = 0; i < n; i++) {
      let product = 1;
      for (let j = 0; j < n; j++) {
        product *= matrix[i][j];
      }
      weights.push(Math.pow(product, 1 / n));
    }
    
    // Нормализуем веса
    const sum = weights.reduce((acc, val) => acc + val, 0);
    return weights.map(w => w / sum);
  };

  // Вычисляем веса критериев
  const criteriaMatrix = createComparisonMatrix(task.criteria, task.criteriaComparisons);
  const criteriaWeights = calculateWeights(criteriaMatrix);
  const criteriaWeightMap = task.criteria.reduce((acc, criterion, index) => {
    acc[criterion] = criteriaWeights[index];
    return acc;
  }, {});

  // Вычисляем веса альтернатив для каждого критерия
  const alternativeWeightsPerCriterion = {};
  task.criteria.forEach((criterion, index) => {
    const comparisons = task.itemComparisons[criterion] || [];
    const matrix = createComparisonMatrix(task.items, comparisons);
    const weights = calculateWeights(matrix);
    alternativeWeightsPerCriterion[criterion] = weights;
  });

  // Вычисляем итоговые веса альтернатив
  const finalAlternativeWeights = task.items.map((_, altIndex) => {
    return task.criteria.reduce((sum, criterion, critIndex) => {
      return sum + criteriaWeightMap[criterion] * alternativeWeightsPerCriterion[criterion][altIndex];
    }, 0);
  });

  // Преобразуем веса в проценты (сумма = 100%)
  const totalWeight = finalAlternativeWeights.reduce((sum, w) => sum + w, 0);
  const percentageWeights = finalAlternativeWeights.map(w => (w / totalWeight) * 100);

  // Создаем массив данных для отображения
  const resultData = task.items.map((item, index) => ({
    name: item,
    value: finalAlternativeWeights[index],
    percentage: percentageWeights[index],
  }));

  // Сортируем по убыванию значимости
  resultData.sort((a, b) => b.percentage - a.percentage);

  return (
    <StyledResultContainer>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Результаты сравнения
      </Typography>
      
      {resultData.map((item, index) => (
        <StyledResultItem key={index}>
          <StyledLabel variant="body1">{item.name}</StyledLabel>
          
          <StyledBarContainer>
            <StyledBar style={{ width: `${item.percentage}%` }} />
          </StyledBarContainer>
          
          <StyledPercentage variant="body1">
            {Math.round(item.percentage)}%
          </StyledPercentage>
        </StyledResultItem>
      ))}
    
    </StyledResultContainer>
  );
};

export default AhpResults;