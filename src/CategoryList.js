import React, { useState } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const CategoryItem = ({ category, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem button onClick={() => onSelect(category)}>
        <ListItemText primary={category.name} />
        {category.subcategories && category.subcategories.length > 0 ? (
          open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />
        ) : null}
      </ListItem>
      {category.subcategories && category.subcategories.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.subcategories.map((subcat) => (
              <CategoryItem key={subcat.id} category={subcat} onSelect={onSelect} />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  );
};

const CategoryList = ({ categories, onSelect }) => {
  return (
    <Paper style={{ marginTop: 20 }}>
      <Typography variant="h6" style={{ padding: 16 }}>Kategorie bez opisów</Typography>
      <List>
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} onSelect={onSelect} />
        ))}
      </List>
    </Paper>
  );
};

export default CategoryList;
