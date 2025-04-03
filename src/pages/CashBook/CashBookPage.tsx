import React from 'react';
import { Box, styled } from '@mui/material';
import CashBook from '../../components/CashBook';

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
`;

const MainSection = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0; // Prevents flex child from overflowing
`;

const CashBookPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <MainSection>
          <CashBook />
        </MainSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default CashBookPage;
