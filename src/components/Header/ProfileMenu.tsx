import React from 'react';
import {
  Box,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  styled
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    min-width: 320px;
    margin-top: 8px;
  }
`;

const ProfileHeader = styled(Box)`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 12px 24px;
  gap: 16px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .MuiSvgIcon-root {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const MenuDivider = styled(Divider)`
  border-color: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
`;

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  userName: string;
  userEmail: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl,
  onClose,
  userName,
  userEmail
}) => {
  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <ProfileHeader>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            fontSize: '1.2rem',
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>
        <UserInfo>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {userName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {userEmail}
          </Typography>
        </UserInfo>
      </ProfileHeader>

      <Box sx={{ py: 1 }}>
        <StyledMenuItem onClick={onClose}>
          <PersonIcon />
          <Typography>My Profile</Typography>
        </StyledMenuItem>
        <StyledMenuItem onClick={onClose}>
          <NotificationsIcon />
          <Typography>Notifications</Typography>
        </StyledMenuItem>
        <StyledMenuItem onClick={onClose}>
          <SecurityIcon />
          <Typography>Privacy & Security</Typography>
        </StyledMenuItem>

        <MenuDivider />

        <StyledMenuItem onClick={onClose}>
          <LanguageIcon />
          <Typography>Language</Typography>
        </StyledMenuItem>
        <StyledMenuItem onClick={onClose}>
          <SettingsIcon />
          <Typography>Settings</Typography>
        </StyledMenuItem>

        <MenuDivider />

        <StyledMenuItem onClick={onClose}>
          <LogoutIcon />
          <Typography>Sign Out</Typography>
        </StyledMenuItem>
      </Box>
    </StyledMenu>
  );
};

export default ProfileMenu;
