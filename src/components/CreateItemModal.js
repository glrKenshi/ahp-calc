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
import { setItemsToTask } from '../slices/tasksSlice';

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

const CreateItemModal = ({open, onClose, taskName, taskId}) => {
    const [items, setItems] = useState(['', '']);
    const dispatch = useDispatch();

    const handleItemChange = (index, value) => {
        const newItems = [...items];
        newItems[index] = value
        setItems(newItems)
    }

    const handleAddItem = () => {   
        setItems([...items, ''])
    }

    const handleRemoveItem = (index) => {
        if (items.length > 2) {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
        }
    };

    const handleClose = () => {
        setItems(['', '']);
        onClose();
    };

    const handleCreateItems = () => {
        const validItems = items.filter(item => item.trim() !== '');

        dispatch(setItemsToTask({
            taskId,
            items: validItems
        }))

        handleClose();
    };

    const isCreateDisabled = () => {
        const filledCriteriaCount = items.filter(item => item.trim() !== '').length;
        return filledCriteriaCount < 2;
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
          {taskName}
        </Typography>
  
        <Typography variant="subtitle1" gutterBottom>
          Критерии оценки:
        </Typography>
  
        <Stack spacing={2} mb={3}>
          {items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label={`Альтернатива ${index + 1}`}
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
              />
  
              {items.length > 2 && (
                <IconButton
                  color="error"
                  onClick={() => handleRemoveItem(index)}
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
          onClick={handleAddItem}
          sx={{ mb: 3 }}
        >
          Добавить критерий
        </Button>
  
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Button
            variant="contained"
            onClick={handleCreateItems}
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
  )
}

export default CreateItemModal
