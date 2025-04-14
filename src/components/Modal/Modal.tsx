import { useForm, SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { addTask, updateTask } from '../../store/slices/taskSlice';
import { Task } from '../../types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  padding: 25px;
  border-radius: 10px;
  width: 100%;
  max-width: 630px;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #000000;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #DFE3E6;
  border-radius: 5px;
  font-size: 14px;
  color: #000000;

  &:focus {
    border-color: #565EEF;
    outline: none;
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #DFE3E6;
  border-radius: 5px;
  font-size: 14px;
  color: #000000;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #565EEF;
    outline: none;
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #DFE3E6;
  border-radius: 5px;
  font-size: 14px;
  color: #000000;
  background: #FFFFFF;

  &:focus {
    border-color: #565EEF;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = 'primary' }) =>
    variant === 'primary'
      ? `
    background: #565EEF;
    color: white;
    border: none;
    &:hover {
      background: #4348B5;
    }
  `
      : `
    background: white;
    color: #565EEF;
    border: 1px solid #565EEF;
    &:hover {
      background: #F1F1F1;
    }
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #94A3B8;
  transition: color 0.2s;

  &:hover {
    color: #565EEF;
  }
`;

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  initialData?: { statusId: number | null } | null;
}

interface FormInputs {
  taskName: string;
  description: string;
  assigneeId: number;
  statusId: number;
}

const TaskModal = ({ task, onClose, initialData }: TaskModalProps) => {
  const dispatch = useAppDispatch();
  const { assignees, statuses } = useAppSelector(
    (state) => state.tasks.dictionary
  );
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
    defaultValues: task
      ? {
          taskName: task.taskName,
          description: task.description,
          assigneeId: task.assigneeId,
          statusId: task.statusId,
        }
      : initialData?.statusId !== null && initialData?.statusId !== undefined
        ? { statusId: initialData.statusId, description: '', taskName: '', assigneeId: 0 }
        : { description: '', taskName: '', assigneeId: 0 },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const statusId = parseInt(String(data.statusId), 10);
    const assigneeId = parseInt(String(data.assigneeId), 10);

    const newTask: Task = {
      id: task ? task.id : `task-${Date.now()}`,
      createdAt: task ? task.createdAt : new Date().toISOString(),
      statusId: isNaN(statusId) ? (initialData?.statusId ?? 0) : statusId,
      assigneeId: isNaN(assigneeId) ? 0 : assigneeId,
      taskName: data.taskName,
      description: data.description,
    };
    if (task) {
      dispatch(updateTask(newTask));
    } else {
      dispatch(addTask(newTask));
    }
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{task ? 'Редактировать задачу' : 'Создать задачу'}</ModalTitle>
        <CloseButton onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        </CloseButton>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Название задачи</Label>
            <Input
              {...register('taskName', { required: 'Название задачи обязательно' })}
              placeholder="Введите название задачи"
            />
            {errors.taskName && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.taskName.message}</span>}
          </FormGroup>
          <FormGroup>
            <Label>Описание задачи</Label>
            <Textarea
              {...register('description')}
              placeholder="Введите описание задачи"
            />
          </FormGroup>
          <FormGroup>
            <Label>Исполнитель</Label>
            <Select {...register('assigneeId')} defaultValue={task?.assigneeId ?? ""}>
              <option value="" disabled>Выберите исполнителя</option>
              {Object.entries(assignees).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Статус</Label>
            <Select {...register('statusId')} defaultValue={task?.statusId ?? initialData?.statusId ?? ""}>
              <option value="" disabled>Выберите статус</option>
              {Object.entries(statuses).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <ButtonGroup>
            <Button type="submit" variant="primary">
              {task ? 'Сохранить' : 'Создать задачу'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskModal;