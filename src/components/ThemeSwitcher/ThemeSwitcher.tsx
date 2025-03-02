import React, { useState } from 'react';
import { Box, IconButton, Tooltip, styled, Fade } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

const ThemeButton = styled(IconButton)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ThemePanel = styled(Box)`
  position: fixed;
  bottom: 80px;
  right: 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
`;

const ThemeOption = styled(Box)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.active {
    border-color: white;
  }
`;

const themes = [
  { class: 'theme-1', gradient: 'linear-gradient(-45deg, #6366f1, #ec4899, #6366f1)' },
  { class: 'theme-2', gradient: 'linear-gradient(-45deg, #22c55e, #6366f1, #22c55e)' },
  { class: 'theme-3', gradient: 'linear-gradient(-45deg, #ec4899, #22c55e, #ec4899)' },
];

const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(0);

  const handleThemeChange = (index: number) => {
    setActiveTheme(index);
    document.body.className = themes[index].class;
  };

  return (
    <>
      <ThemeButton
        onClick={() => setIsOpen(!isOpen)}
        className="animate-float-up"
      >
        <PaletteIcon sx={{ color: 'white' }} />
      </ThemeButton>

      <Fade in={isOpen}>
        <ThemePanel>
          {themes.map((theme, index) => (
            <Tooltip key={index} title={`Theme ${index + 1}`} placement="left">
              <ThemeOption
                className={activeTheme === index ? 'active' : ''}
                onClick={() => handleThemeChange(index)}
                style={{ background: theme.gradient }}
              />
            </Tooltip>
          ))}
        </ThemePanel>
      </Fade>
    </>
  );
};

export default ThemeSwitcher;
