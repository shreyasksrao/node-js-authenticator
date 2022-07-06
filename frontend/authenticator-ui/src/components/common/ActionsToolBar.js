import React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

function ActionsToolBar() {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button variant="outlined" startIcon={<SendIcon />}>
        Send
      </Button>
    </Stack>
  )
}

export default ActionsToolBar
