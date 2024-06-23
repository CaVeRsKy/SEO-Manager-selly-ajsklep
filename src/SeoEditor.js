import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const SeoEditor = ({ category, seoData, onGenerate, onSave, onCancel, onChange }) => {
  return (
    <Paper style={{ marginTop: 20, padding: 16 }}>
      <Typography variant="h6">Dane SEO dla kategorii {category.name}</Typography>
      <Box mt={2}>
        <TextField
          label="Generowany opis"
          fullWidth
          multiline
          margin="normal"
          value={seoData.description}
          onChange={(e) => onChange({ ...seoData, description: e.target.value })}
        />
        <TextField
          label="Generowany meta opis"
          fullWidth
          multiline
          margin="normal"
          value={seoData.meta_description}
          onChange={(e) => onChange({ ...seoData, meta_description: e.target.value })}
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={onSave}>
          Zapisz
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Anuluj
        </Button>
      </Box>
    </Paper>
  );
};

export default SeoEditor;
