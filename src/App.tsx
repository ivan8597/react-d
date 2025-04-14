import { useState } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { store } from './store';
import Board from './components/Board/Board';
import TaskModal from './components/Modal/Modal';
import { GlobalStyles } from './styles/GlobalStyles';

const AppWrapper = styled.div`
  min-height: 100vh;
  background: #F1F1F1;
  padding: 16px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
`;

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalData, setInitialModalData] = useState<{ statusId: number | null } | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setInitialModalData(null);
  };

  const openModalForStatus = (statusId: number) => {
    setInitialModalData({ statusId });
    setIsModalOpen(true);
  };

  const openModalDefault = () => {
    setInitialModalData(null);
    setIsModalOpen(true);
  };

  return (
    <Provider store={store}>
      <GlobalStyles />
      <AppWrapper>
        <Header>   
        </Header>
        <Board openModalForStatus={openModalForStatus} />
        {isModalOpen && <TaskModal onClose={closeModal} initialData={initialModalData} />}
      </AppWrapper>
    </Provider>
  );
};

export default App;