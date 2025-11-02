import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Info,
  Business,
  DateRange,
  QrCode,
} from '@mui/icons-material';
import {
  formatDate,
  parseDrugName,
  getCompanyInitials,
} from '../utils/helpers';
import type { Drug } from '../types';

interface DrugCardProps {
  drug: Drug;
  onEdit?: (drug: Drug) => void;
  onDelete?: (drug: Drug) => void;
  onView?: (drug: Drug) => void;
}

const DrugCard: React.FC<DrugCardProps> = ({
  drug,
  onEdit,
  onDelete,
  onView,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const { genericName, brandName } = parseDrugName(drug.name);
  const companyInitials = getCompanyInitials(drug.company);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        minWidth: { xs: '100%', sm: 280 },
        maxWidth: '100%',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          pb: 1,
          px: { xs: 2, sm: 2 },
          pt: { xs: 2, sm: 2 },
        }}
      >
        {/* Header with company avatar and menu */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              flexShrink: 0,
            }}
          >
            {companyInitials}
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.5,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {genericName}
            </Typography>

            {brandName && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontStyle: 'italic',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {brandName}
              </Typography>
            )}
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              ml: 1,
              flexShrink: 0,
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Company */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            minWidth: 0,
          }}
        >
          <Business
            sx={{
              fontSize: { xs: 14, sm: 16 },
              mr: 1,
              color: 'text.secondary',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {drug.company}
          </Typography>
        </Box>

        {/* Drug Code */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            minWidth: 0,
          }}
        >
          <QrCode
            sx={{
              fontSize: { xs: 14, sm: 16 },
              mr: 1,
              color: 'text.secondary',
              flexShrink: 0,
            }}
          />
          <Chip
            label={drug.code}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 24, sm: 28 },
            }}
          />
        </Box>

        {/* Launch Date */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          <DateRange
            sx={{
              fontSize: { xs: 14, sm: 16 },
              mr: 1,
              color: 'text.secondary',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(drug.launchDate)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          p: { xs: 1, sm: 2 },
          pt: 0,
          justifyContent: { xs: 'space-around', sm: 'flex-start' },
          gap: { xs: 0, sm: 1 },
        }}
      >
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onView?.(drug)}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            <Info />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit Drug">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => onEdit?.(drug)}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            <Edit />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Drug">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete?.(drug)}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleAction(() => onView?.(drug))}>
          <ListItemIcon>
            <Info fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(() => onEdit?.(drug))}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Drug</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(() => onDelete?.(drug))}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Drug</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default DrugCard;
