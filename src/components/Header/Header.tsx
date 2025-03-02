import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  IconButton, 
  InputBase, 
  Menu, 
  MenuItem, 
  Toolbar, 
  Typography,
  Avatar,
  ListItemIcon,
  styled 
} from '@mui/material';
import { 
  Search as SearchIcon,
  Menu as MenuIcon,
  RemoveCircleOutline as RemoveAdsIcon,
  Assessment as SummaryIcon,
  AccountBalance as AccountSummaryIcon,
  Receipt as TransactionIcon,
  AccountCircle as AccountsIcon,
  SwapHoriz as TransferIcon,
  BarChart as ReportIcon,
  CompareArrows as SwitchIcon,
  Settings as SettingsIcon,
  Calculate as CalculatorIcon,
  Help as HelpIcon,
  Share as ShareIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import ProfileMenu from './ProfileMenu';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)`
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
`;

const SearchBox = styled(Box)`
  position: relative;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 16px;
  margin-left: 16px;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIconWrapper = styled(Box)`
  padding: 0 16px;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
`;

const StyledInputBase = styled(InputBase)`
  color: white;
  width: 100%;
  
  & .MuiInputBase-input {
    padding: 8px 8px 8px 48px;
    width: 100%;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const MenuButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  margin-right: 8px;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px;
  border-radius: 24px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileName = styled(Typography)`
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin-left: 12px;
`;

const UserName = styled(Typography)`
  color: white;
  font-weight: 500;
  margin-right: 8px;
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-width: 250px;
    
    .MuiMenuItem-root {
      padding: 12px 24px;
      gap: 16px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .MuiListItemIcon-root {
        color: rgba(255, 255, 255, 0.7);
        min-width: 24px;
      }
    }
  }
`;

const UserSelector = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px 6px 6px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  margin-right: 20px;
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '▼';
    color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    margin-left: 4px;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    color: rgba(255, 255, 255, 1);
    transform: translateY(2px);
  }
`;

const UserAvatar = styled(Avatar)`
  width: 36px !important;
  height: 36px !important;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem !important;
  font-weight: 600;

  ${UserSelector}:hover & {
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.4);
  }
`;

const UserSelectorText = styled(Typography)`
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  white-space: nowrap;
`;

const StyledUserMenu = styled(Menu)`
  .MuiPaper-root {
    background: rgba(17, 17, 17, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.2),
      0 8px 32px rgba(99, 102, 241, 0.15);
    overflow: hidden;
    min-width: 240px;
    margin-top: 12px;
    padding: 8px;

    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 20px;
      width: 12px;
      height: 12px;
      background: rgba(17, 17, 17, 0.95);
      transform: rotate(45deg);
      border-left: 1px solid rgba(99, 102, 241, 0.3);
      border-top: 1px solid rgba(99, 102, 241, 0.3);
      z-index: 0;
    }

    .MuiMenuItem-root {
      border-radius: 12px;
      margin: 4px;
      padding: 12px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
      
      &:hover {
        background: rgba(99, 102, 241, 0.15);
      }

      .MuiAvatar-root {
        width: 36px !important;
        height: 36px !important;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
        font-size: 1rem !important;
        font-weight: 600;
      }

      .MuiTypography-root {
        font-weight: 500;
        margin-left: 12px;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.9);
      }

      &.selected {
        background: rgba(99, 102, 241, 0.2);
        
        .MuiAvatar-root {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
        }

        .MuiTypography-root {
          color: white;
          font-weight: 600;
        }
      }

      &:hover .MuiAvatar-root {
        transform: scale(1.05);
        border-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

const DashboardButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.9);
  margin-right: 12px;
  padding: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.5),
      rgba(79, 70, 229, 0.5),
      rgba(99, 102, 241, 0.5)
    );
    border-radius: 14px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%);
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 
      0 4px 20px rgba(99, 102, 241, 0.3),
      0 0 20px rgba(99, 102, 241, 0.15) inset;

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0.2;
    }

    .MuiSvgIcon-root {
      transform: rotate(360deg);
      color: white;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 10px rgba(99, 102, 241, 0.2),
      0 0 15px rgba(99, 102, 241, 0.1) inset;
  }

  .MuiSvgIcon-root {
    font-size: 1.5rem;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [leftMenuAnchor, setLeftMenuAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [userSelectorAnchor, setUserSelectorAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('Gopi Raju');

  // Mock user data - replace with actual user data from your auth system
  const userData = {
    name: selectedUser,
    email: 'gopi.raju@example.com'
  };

  const users = ['Gopi Raju', 'Srinivasulu'];

  const handleLeftMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLeftMenuAnchor(event.currentTarget);
  };

  const handleLeftMenuClose = () => {
    setLeftMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleUserSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserSelectorAnchor(event.currentTarget);
  };

  const handleUserSelectorClose = () => {
    setUserSelectorAnchor(null);
  };

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    handleUserSelectorClose();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDashboardClick = () => {
    navigate('/home/dashboard');
  };

  const leftMenuItems = [
    { text: 'Remove ads', icon: <RemoveAdsIcon /> },
    { text: 'Summary', icon: <SummaryIcon /> },
    { text: 'Account summary', icon: <AccountSummaryIcon /> },
    { text: 'Transactions - All accounts', icon: <TransactionIcon /> },
    { text: 'Accounts', icon: <AccountsIcon /> },
    { text: 'Transfer', icon: <TransferIcon /> },
    { text: 'Report - All Accounts', icon: <ReportIcon /> },
    { text: 'Switch to Cash in Cash out', icon: <SwitchIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
    { text: 'Cash calculator', icon: <CalculatorIcon /> },
    { text: 'Help', icon: <HelpIcon /> },
    { text: 'Share', icon: <ShareIcon /> }
  ];

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <MenuButton
          edge="start"
          aria-label="menu"
          onClick={handleLeftMenuOpen}
        >
          <MenuIcon />
        </MenuButton>

        <UserSelector onClick={handleUserSelectorClick}>
          <UserAvatar>
            {selectedUser.charAt(0).toUpperCase()}
          </UserAvatar>
          <UserSelectorText>
            {selectedUser}
          </UserSelectorText>
        </UserSelector>

        <StyledUserMenu
          anchorEl={userSelectorAnchor}
          open={Boolean(userSelectorAnchor)}
          onClose={handleUserSelectorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {users.map((user) => (
            <MenuItem 
              key={user} 
              onClick={() => handleUserSelect(user)}
              className={user === selectedUser ? 'selected' : ''}
            >
              <Avatar>
                {user.charAt(0).toUpperCase()}
              </Avatar>
              <Typography>{user}</Typography>
            </MenuItem>
          ))}
        </StyledUserMenu>

        <DashboardButton
          aria-label="dashboard"
          onClick={handleDashboardClick}
        >
          <DashboardIcon />
        </DashboardButton>

        <SearchBox>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </SearchBox>

        <Box sx={{ flexGrow: 1 }} />

        <ProfileName>
          Gopi Raju
        </ProfileName>

        <ProfileSection onClick={handleProfileMenuOpen}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.9rem',
            }}
          >
            {userData.name.charAt(0).toUpperCase()}
          </Avatar>
          <UserName variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {userData.name}
          </UserName>
        </ProfileSection>

        <StyledMenu
          anchorEl={leftMenuAnchor}
          open={Boolean(leftMenuAnchor)}
          onClose={handleLeftMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {leftMenuItems.map((item) => (
            <MenuItem key={item.text} onClick={handleLeftMenuClose}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              {item.text}
            </MenuItem>
          ))}
        </StyledMenu>

        <ProfileMenu
          anchorEl={profileMenuAnchor}
          onClose={handleProfileMenuClose}
          userName={userData.name}
          userEmail={userData.email}
        />
      </Toolbar>
    </StyledAppBar>
  );
};

export { Header };
