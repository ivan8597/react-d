import { useState } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { store } from './store';
import Board from './components/Board/Board';
import TaskModal from './components/Modal/Modal';
import { GlobalStyles } from './styles/GlobalStyles';

const AppWrapper = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 24px;
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

const AppContent = () => {
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

  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <Header>
         
        </Header>
        <Board openModalForStatus={openModalForStatus} />
        {isModalOpen && <TaskModal onClose={closeModal} initialData={initialModalData} />}
      </AppWrapper>
    </>
  );
}

const App = () => {
  return (
    <Provider store={store}>
     <AppContent />
    </Provider>
  );
};

export default App;