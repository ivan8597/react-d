import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { updateTaskStatus } from '../../store/slices/taskSlice';
import TaskCard from '../TaskCard/TaskCard';
import zapIcon from '../../assets/img/zap.png';
import notepadIcon from '../../assets/img/notepad.png';
import plusIcon from '../../assets/img/plus.png';
import { RootState } from '../../store';

type BoardProps = {
  openModalForStatus: (statusId: number) => void;
}

const BoardWrapper = styled.div`
  // Обертка для доски и прогресс-бара
`;

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(282px, 1fr));
  gap: 16px;
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
  border-radius: 12px;
`;

const StatusIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const ColumnTitle = styled.h2`
  font-size: 14px;
  font-weight: 300;
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
  border-radius: 20px;
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
  font-size: 14px;

  img {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: #f0f0f0;
  }
`;


const ProgressSection = styled.section`
  margin-top: 24px;
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
`;

const ProgressContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProgressText = styled.span`
  font-size: 16px;
  color: #000000;
  white-space: nowrap;
`;


const PercentageHighlight = styled.span`
  color: #537BF3;
  font-weight: 700;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 12px;
  background-color: #E7E8EA;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBarFilled = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => $percentage}%;
  height: 100%;
  background-color: #537BF3;
  border-radius: 10px;
  transition: width 0.3s ease-in-out;
`;


const Board = ({ openModalForStatus }: BoardProps) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state: RootState) => state.tasks.tasks);
  const { statuses } = useAppSelector((state: RootState) => state.tasks.dictionary);

  const totalTasks = tasks.length;
  const doneStatusId = 2;
  const completedTasks = tasks.filter(task => task.statusId === doneStatusId).length;
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTaskCountByStatus = (statusId: number) => {
    return tasks.filter(task => task.statusId === statusId).length;
  };

  const getStatusIcon = (statusId: number) => {
    return statusId === 0 ? zapIcon : notepadIcon;
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
    <BoardWrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <BoardContainer>
          {Object.entries(statuses).map(([statusId, statusName]) => {
            const currentStatusId = parseInt(statusId);
            const tasksInStatus = tasks.filter(task => task.statusId === currentStatusId);

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
                      <AddTaskButton onClick={() => handleAddNewTaskClick(currentStatusId)}>
                        <img src={plusIcon} alt="+" />
                        Новая задача
                      </AddTaskButton>
                    </TaskList>
                  </Column>
                )}
              </Droppable>
            );
          })}
        </BoardContainer>
      </DragDropContext>

      <ProgressSection>
        <ProgressContent>
          <ProgressText>
            <PercentageHighlight>{completedPercentage}%</PercentageHighlight> выполненных задач
          </ProgressText>
          <ProgressBarWrapper>
            <ProgressBarFilled $percentage={completedPercentage} />
          </ProgressBarWrapper>
        </ProgressContent>
      </ProgressSection>
    </BoardWrapper>
  );
};

export default Board;