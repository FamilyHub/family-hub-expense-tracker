import React from 'react';
import { Box, styled } from '@mui/material';
import Summary from '../../components/CashBook/Summary';
import TransactionList from '../../components/CashBook/TransactionList';

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  min-height: calc(100vh - 128px);
  
  @media (min-width: 600px) {
    padding: 32px;
  }
`;

const ContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  
  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const MainSection = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0; // Prevents flex child from overflowing
`;

const SideSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  
  @media (min-width: 900px) {
    width: 320px;
    position: sticky;
    top: 24px;
  }
`;

const CashBookPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <MainSection>
          <TransactionList />
        </MainSection>
        <SideSection className="animate-slide-in">
          <Summary />
        </SideSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default CashBookPage;
