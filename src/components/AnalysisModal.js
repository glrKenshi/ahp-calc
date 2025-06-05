// components/AnalysisModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const AnalysisModal = ({ open, onClose, task, dispatch }) => {
  const [stage, setStage] = useState('criteria');
  const [criteriaComparisons, setCriteriaComparisons] = useState([]);
  const [itemComparisons, setItemComparisons] = useState({});
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [currentCriterion, setCurrentCriterion] = useState('');
  const [comparisonValue, setComparisonValue] = useState(1);
  const [isSwapped, setIsSwapped] = useState(false);

  // Генерация пар для сравнения
  const generatePairs = (items) => {
    const pairs = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        pairs.push([items[i], items[j]]);
      }
    }
    return pairs;
  };

  // Пары критериев
  const criteriaPairs = generatePairs(task.criteria);
  
  // Пары альтернатив по критериям
  const getItemPairs = () => {
    if (!currentCriterion) return [];
    return generatePairs(task.items);
  };

  // Обработчик изменения значения сравнения
  const handleValueChange = (e) => {
    setComparisonValue(parseFloat(e.target.value));
  };

  // Переключение элементов местами
  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  // Сохранение сравнения и переход к следующему
  const handleNext = () => {
    if (stage === 'criteria') {
      const newComparisons = [...criteriaComparisons];
      const [first, second] = criteriaPairs[currentPairIndex];
      const element1 = isSwapped ? second : first;
      const element2 = isSwapped ? first : second;
      
      newComparisons[currentPairIndex] = [element1, element2, comparisonValue];
      setCriteriaComparisons(newComparisons);

      if (currentPairIndex < criteriaPairs.length - 1) {
        setCurrentPairIndex(currentPairIndex + 1);
        setComparisonValue(1);
        setIsSwapped(false);
      } else {
        setStage('alternatives');
        setCurrentCriterion(task.criteria[0]);
        setCurrentPairIndex(0);
      }
    } else {
      const newItemComparisons = { ...itemComparisons };
      const pairs = getItemPairs();
      const [first, second] = pairs[currentPairIndex];
      const element1 = isSwapped ? second : first;
      const element2 = isSwapped ? first : second;
      
      if (!newItemComparisons[currentCriterion]) {
        newItemComparisons[currentCriterion] = [];
      }
      
      newItemComparisons[currentCriterion][currentPairIndex] = [element1, element2, comparisonValue];
      setItemComparisons(newItemComparisons);

      if (currentPairIndex < pairs.length - 1) {
        setCurrentPairIndex(currentPairIndex + 1);
        setComparisonValue(1);
        setIsSwapped(false);
      } else {
        const nextCriterionIndex = task.criteria.indexOf(currentCriterion) + 1;
        if (nextCriterionIndex < task.criteria.length) {
          setCurrentCriterion(task.criteria[nextCriterionIndex]);
          setCurrentPairIndex(0);
          setComparisonValue(1);
          setIsSwapped(false);
        } else {
          // Сохранение всех данных в Redux
          dispatch({
            type: 'tasks/setCriteriaComparison',
            payload: {
              taskId: task.id,
              value: criteriaComparisons.filter(Boolean)
            }
          });
          
          dispatch({
            type: 'tasks/setItemComparison',
            payload: {
              taskId: task.id,
              value: newItemComparisons
            }
          });
          

          dispatch({
              type: 'tasks/setAnalysisCompleted',
              payload: {
                  taskId: task.id,
                  completed: true
              }
          });
          
          onClose();
        }
      }
    }
  };

  // Сброс состояния при открытии
  useEffect(() => {
    if (open) {
      setStage('criteria');
      setCriteriaComparisons(task.criteriaComparisons || []);
      setItemComparisons(task.itemComparisons || {});
      setCurrentPairIndex(0);
      setComparisonValue(1);
      setIsSwapped(false);
    }
  }, [open, task]);

  // Получение текущих элементов для сравнения
  const getCurrentElements = () => {
    if (stage === 'criteria') {
      const [first, second] = criteriaPairs[currentPairIndex] || [];
      return {
        element1: isSwapped ? second : first,
        element2: isSwapped ? first : second
      };
    }
    
    const pairs = getItemPairs();
    const [first, second] = pairs[currentPairIndex] || [];
    return {
      element1: isSwapped ? second : first,
      element2: isSwapped ? first : second
    };
  };

  const { element1, element2 } = getCurrentElements();
  const isLastStep = stage === 'criteria' 
    ? currentPairIndex === criteriaPairs.length - 1
    : currentPairIndex === getItemPairs().length - 1 && 
      task.criteria.indexOf(currentCriterion) === task.criteria.length - 1;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {stage === 'criteria' ? 'Сравнение критериев' : `Сравнение альтернатив (${currentCriterion})`}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {element1 && element2 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                {element1}
              </Typography>
              
              <Tooltip title="Поменять местами">
                <IconButton onClick={handleSwap} color="primary">
                  <SwapHorizIcon />
                </IconButton>
              </Tooltip>
              
              <Typography variant="h6" sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                {element2}
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography gutterBottom>Во сколько раз важнее/лучше:</Typography>
              <Select
                value={comparisonValue}
                onChange={handleValueChange}
                fullWidth
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {stage === 'criteria'
                  ? `Шаг ${currentPairIndex + 1} из ${criteriaPairs.length}`
                  : `Критерий ${task.criteria.indexOf(currentCriterion) + 1}/${task.criteria.length}, Шаг ${currentPairIndex + 1} из ${getItemPairs().length}`}
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={!comparisonValue}
              >
                {isLastStep ? 'Завершить' : 'Далее'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AnalysisModal;

