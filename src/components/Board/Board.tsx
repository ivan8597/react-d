import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { updateTaskStatus } from '../../store/slices/taskSlice';
import TaskCard from '../TaskCard/TaskCard';
import zapIcon from '../../styles/zap.png';
import notepadIcon from '../../styles/notepad.png';
import plusIcon from '../../styles/plus.png';

interface BoardProps {
  openModalForStatus: (statusId: number) => void;
}

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(282px, 1fr));
  gap: 24px;
  margin: 0 auto;
  max-width: 1200px;
`;

const Column = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  padding: 24px 20px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const StatusBadge = styled.div<{ $status: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 116px;
  height: 24px;
  padding: 0 8px;
  background: ${({ $status }) => 
    $status === 0 ? '#D4F7F3' :
    $status === 1 ? '#F7F5D4' :
    '#D4E0F7'};
  border-radius: 4px;
`;

const StatusIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const ColumnTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

const TaskCount = styled.span`
  font-size: 14px;
  color: #000000;
`;

const TaskList = styled.div<{ $status: number }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ $status }) => 
    $status === 0 ? '#F5FAF9' :
    $status === 1 ? '#FAFAF5' :
    $status === 2 ? '#F5F7FA' :
    '#FFFFFF'};
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  flex-grow: 1;
`;

const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: none;
  border: 1px solid #B8B8B8;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: #555;
  margin-top: 16px; 
  font-size: 14px;

  img {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: #f0f0f0;
  }
`;

const Board = ({ openModalForStatus }: BoardProps) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const { statuses } = useAppSelector((state) => state.tasks.dictionary);

  const getTaskCountByStatus = (statusId: number) => {
    return tasks.filter(task => task.statusId === statusId).length;
  };

  const getStatusIcon = (statusId: number) => {
    return statusId === 2 ? zapIcon : notepadIcon;
  };

  const handleAddNewTaskClick = (statusId: number) => {
    openModalForStatus(statusId);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatusId = parseInt(result.destination.droppableId);
    dispatch(updateTaskStatus({ id: taskId, statusId: newStatusId }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BoardContainer>
        {Object.entries(statuses).map(([statusId, statusName]) => {
          const currentStatusId = parseInt(statusId);
          const tasksInStatus = tasks.filter(task => task.statusId === currentStatusId);
          const showAddTaskButtonAtBottom = tasksInStatus.length >= 3;

          return (
            <Droppable droppableId={statusId} key={statusId}>
              {(provided) => (
                <Column>
                  <ColumnHeader>
                    <StatusBadge $status={currentStatusId}>
                      <StatusIcon src={getStatusIcon(currentStatusId)} alt={statusName} />
                      <ColumnTitle>{statusName}</ColumnTitle>
                    </StatusBadge>
                    <TaskCount>{getTaskCountByStatus(currentStatusId)}</TaskCount>
                  </ColumnHeader>
                  <TaskList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    $status={currentStatusId}
                  >
                    {tasksInStatus.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(providedDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {!showAddTaskButtonAtBottom && (
                      <AddTaskButton onClick={() => handleAddNewTaskClick(currentStatusId)}>
                        <img src={plusIcon} alt="+" />
                        Новая задача
                      </AddTaskButton>
                    )}
                  </TaskList>
                  {showAddTaskButtonAtBottom && (
                     <AddTaskButton onClick={() => handleAddNewTaskClick(currentStatusId)} style={{ marginTop: '20px' }}>
                       <img src={plusIcon} alt="+" />
                       Новая задача
                     </AddTaskButton>
                  )}
                </Column>
              )}
            </Droppable>
          );
        })}
      </BoardContainer>
    </DragDropContext>
  );
};

export default Board;