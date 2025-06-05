import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CreateTaskModal = ({ open, onClose }) => {
  const [taskName, setTaskName] = useState('');
  const [criteria, setCriteria] = useState(['', '']);
  const dispatch = useDispatch();

  const handleAddCriteria = () => {
    setCriteria([...criteria, '']);
  };

  const handleCriteriaChange = (index, value) => {
    const newCriteria = [...criteria];
    newCriteria[index] = value;
    setCriteria(newCriteria);
  };

  const handleRemoveCriteria = (index) => {
    if (criteria.length > 2) {
      const newCriteria = [...criteria];
      newCriteria.splice(index, 1);
      setCriteria(newCriteria);
    }
  };

  const handleCreateTask = () => {
    const validCriteria = criteria.filter(criterion => criterion.trim() !== '');
    
    dispatch(addTask({
      name: taskName,
      criteria: validCriteria
    }));

    handleClose();
  };

  const handleClose = () => {
    setTaskName('');
    setCriteria(['', '']);
    onClose();
  };

  const isCreateDisabled = () => {
    const filledCriteriaCount = criteria.filter(c => c.trim() !== '').length;
    return !taskName.trim() || filledCriteriaCount < 2;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
          Создание новой задачи
        </Typography>
  
        <TextField
          fullWidth
          label="Введите название задачи"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          sx={{ mb: 3 }}
        />
  
        <Typography variant="subtitle1" gutterBottom>
          Критерии оценки:
        </Typography>
  
        <Stack spacing={2} mb={3}>
          {criteria.map((criterion, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label={`Критерий ${index + 1}`}
                value={criterion}
                onChange={(e) => handleCriteriaChange(index, e.target.value)}
              />
  
              {criteria.length > 2 && (
                <IconButton
                  color="error"
                  onClick={() => handleRemoveCriteria(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Stack>
  
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddCriteria}
          sx={{ mb: 3 }}
        >
          Добавить критерий
        </Button>
  
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Button
            variant="contained"
            onClick={handleCreateTask}
            disabled={isCreateDisabled()}
          >
            Создать задачу
          </Button>
  
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            Закрыть
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;
