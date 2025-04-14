import styled from 'styled-components';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { deleteTask } from '../../store/slices/taskSlice';
import TaskModal from '../Modal/Modal';
import { Task } from '../../types';
import checkIcon from '../../styles/check.png';
import zapIcon from '../../styles/zap.png';
import notepadIcon from '../../styles/notepad.png';
import deleteIcon from '../../styles/delete.png';

const Card = styled.div`
  background: #FFFFFF;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const CheckCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #60A612;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.img`
  width: 10px;
  height: 10px;
`;

const TaskName = styled.h3`
  font-size: 14px;
  font-weight: 400;
  color: #000000;
`;

const TaskDescription = styled.p`
  font-size: 12px;
  color: #94A3B8;
  margin-bottom: 12px;
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #555;
  margin-left: 24px;
`;

const StatusBadge = styled.div<{ $status: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 116px;
  height: 24px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  background: ${({ $status }) => 
    $status === 0 ? '#D4F7F3' :
    $status === 1 ? '#F7F5D4' :
    '#D4E0F7'};
  margin-top: 8px;
  margin-left: 24px;
`;

const StatusIcon = styled.img`
  width: 12px;
  height: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  top: 15px;
  right: 15px;
  opacity: 0;
  transition: opacity 0.2s;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #94A3B8;
  transition: color 0.2s;

  &:hover {
    color: #565EEF;
  }
`;

const DateText = styled.span`
  font-size: 10px;
  color: #94A3B8;
`;

type TaskCardProps = {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useAppDispatch();
  const { statuses, assignees } = useAppSelector((state) => state.tasks.dictionary);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const getStatusIcon = (statusId: number) => {
    return statusId === 0 ? zapIcon : notepadIcon;
  };

  return (
    <>
      <Card>
        <TaskHeader>
          <CheckCircle>
            <CheckIcon src={checkIcon} alt="check" />
          </CheckCircle>
          <TaskName>{task.taskName}</TaskName>
        </TaskHeader>
        <AssigneeInfo>
          <span>{assignees[task.assigneeId] ?? 'Не назначен'}</span>
        </AssigneeInfo>
        <StatusBadge $status={task.statusId}>
          <StatusIcon src={getStatusIcon(task.statusId)} alt={statuses[task.statusId]} />
          <span>{statuses[task.statusId]}</span>
        </StatusBadge>
        <ButtonsContainer>
          <IconButton onClick={() => setIsModalOpen(true)} title="Редактировать">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.545 4.765L9.235 5.455L2.44 12.25H1.75V11.56L8.545 4.765ZM11.245 0.25C11.0575 0.25 10.8625 0.325 10.72 0.4675L9.3475 1.84L12.16 4.6525L13.5325 3.28C13.825 2.9875 13.825 2.515 13.5325 2.2225L11.7775 0.4675C11.6275 0.3175 11.44 0.25 11.245 0.25ZM8.545 2.6425L0.25 10.9375V13.75H3.0625L11.3575 5.455L8.545 2.6425Z" fill="currentColor"/>
            </svg>
          </IconButton>
          <IconButton onClick={handleDelete} title="Удалить">
            <img src={deleteIcon} alt="Удалить" width="12" height="14" />
          </IconButton>
        </ButtonsContainer>
      </Card>
      {isModalOpen && (
        <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default TaskCard;