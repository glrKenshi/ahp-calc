import { useState } from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { addTask, selectAllTasks, removeTask } from './slices/tusksSlice';
import { useDispatch, useSelector } from 'react-redux';

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

function App() {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [criteria, setCriteria] = useState([
    { name: '', importance: 1 }, 
    { name: '', importance: 1 }
  ]);

  const dispatch = useDispatch()
  const tasks = useSelector(selectAllTasks)

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTaskName('');
    setCriteria([{ name: '', importance: 1 }, { name: '', importance: 1 }]);
  };

  const handleAddCriteria = () => {
    setCriteria([...criteria, { name: '', importance: 1 }]); // Новые критерии с важностью 1
  };

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
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
    const criteriaArr = criteria.map(el => el.name)
    dispatch(addTask({
      name : taskName,
      criteria : criteriaArr
    }))

    handleClose();
  };

  return (
    <CssBaseline>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Новая задача
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          {tasks.map(task => (
            <Card sx={{ position: 'relative', minWidth: 275, mb: 2 }}>
   
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Tooltip title="Удалить задачу" arrow>
                  <IconButton
                    aria-label="delete"
                    onClick={() => dispatch(removeTask(task.id))}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {task.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Критерии:
                    </Typography>
                    <List dense>
                      {task.criteria.map((item, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText primary={`• ${item}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
          
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  // onClick={onDetailsClick}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

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
                    value={criterion.name}
                    onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                  />
      
                  <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Степень важности</InputLabel>
                    <Select
                      value={criterion.importance}
                      label="Степень важности"
                      onChange={(e) => handleCriteriaChange(index, 'importance', e.target.value)}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                        <MenuItem key={num} value={num}>{num}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
      
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
                disabled={!taskName.trim() || criteria.some(c => !c.name.trim())}
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

      </div>
    </CssBaseline>
  );
}

export default App;