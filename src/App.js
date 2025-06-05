import { useState, useEffect } from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,    
  Card,
  CardContent,  
  CardActions,
  Tooltip,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container
} from '@mui/material'; 
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { green } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, removeTask } from './slices/tasksSlice';
import CreateTaskModal from './components/CreateTaskModal';
import CreateItemModal from './components/CreateItemModal';
import AnalysisModal from './components/AnalysisModal';
import AhpResults from './components/AhpResults';
import LoginModal from './components/LoginModal';

function App() {
  const [openCriteriaModal, setOpenCriteriaModal] = useState(false);
  const [openItemsModal, setOpenItemsModal] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const currentTask = useSelector(state => 
    currentTaskId ? state.tasks.entities[currentTaskId] : null
  );

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const onOpenCriteriaModal = () => setOpenCriteriaModal(true);
  const onCloseCriteriaModal = () => setOpenCriteriaModal(false);

  const onOpenItemsModal = () => setOpenItemsModal(true);
  const onCloseItemsModal = () => setOpenItemsModal(false);

  const handleOpenAnalysis = (taskId) => {
    setCurrentTaskId(taskId);
    setAnalysisModalOpen(true);
  };

  const handleCloseAnalysis = () => {
    setAnalysisModalOpen(false);
    setCurrentTaskId(null);
  };

  if (!isAuthenticated) {
    return (
      <CssBaseline>
        <AppBar position="static">
          <Container maxWidth="lg">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Task Manager
              </Typography>
              <Button color="inherit" onClick={() => setLoginModalOpen(true)}>
                Войти
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column'
        }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Добро пожаловать
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Пожалуйста, авторизуйтесь для продолжения
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => setLoginModalOpen(true)}
          >
            Войти в систему
          </Button>
        </Box>

        <LoginModal 
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      </CssBaseline>
    );
  }

  return (
    <CssBaseline>
      <div className="App">
        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Task Manager
              </Typography>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={onOpenCriteriaModal}
              >
                Новая задача
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                Выйти
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          {tasks.map(task => (
            <div key={task.id}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                      {task.name}
                    </Typography>
                    {task.analysisCompleted && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 10, color: green[500] }}>
                        <DoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          Анализ завершен 
                        </Typography>
                      </Box>
                    )}
                  </Box>
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
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Альтернативы:
                      </Typography>
                      <List dense>
                        {task.items.map((item, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemText primary={`• ${item}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{ ml: 1, mb: 1 }}
                    onClick={onOpenItemsModal}
                  >
                    Добавить альтернативы
                  </Button>
              
                  <Button
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                    onClick={() => handleOpenAnalysis(task.id)}
                    disabled={task.criteria.length < 2 || task.items.length < 2}
                  >
                    Провести анализ
                  </Button>
                </CardActions>

                {task.analysisCompleted && <AhpResults task={task} />}
              </Card>

              <CreateItemModal 
                open={openItemsModal} 
                onClose={onCloseItemsModal} 
                taskName={task.name}
                taskId={task.id}
              />
            </div>
          ))}
        </Box>

        <CreateTaskModal 
          open={openCriteriaModal} 
          onClose={onCloseCriteriaModal} 
        />
        
        {currentTask && (
          <AnalysisModal
            open={analysisModalOpen}
            onClose={handleCloseAnalysis}
            task={currentTask}
            dispatch={dispatch}
          />
        )}
      </div>
    </CssBaseline>
  );
}

export default App;