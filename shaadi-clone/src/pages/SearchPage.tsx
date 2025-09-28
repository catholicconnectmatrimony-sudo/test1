import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from '@mui/material';
import {
  Favorite,
  Message,
  ExpandMore,
  FilterList,
  Search,
  LocationOn,
  Work,
  Star,
} from '@mui/icons-material';

const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState({
    ageRange: [25, 35],
    religion: '',
    motherTongue: '',
    education: '',
    occupation: '',
    location: '',
  });

  // Mock data for demonstration
  const profiles = [
    {
      id: 1,
      name: 'Priya Sharma',
      age: 28,
      location: 'Mumbai, Maharashtra',
      education: 'MBA',
      occupation: 'Software Engineer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=300&h=300&fit=crop',
      isOnline: true,
      membershipType: 'Premium',
    },
    {
      id: 2,
      name: 'Anjali Patel',
      age: 26,
      location: 'Bangalore, Karnataka',
      education: 'B.Tech',
      occupation: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      isOnline: false,
      membershipType: 'Free',
    },
    {
      id: 3,
      name: 'Kavya Reddy',
      age: 30,
      location: 'Hyderabad, Telangana',
      education: 'MS',
      occupation: 'Data Scientist',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
      isOnline: true,
      membershipType: 'Premium Plus',
    },
    {
      id: 4,
      name: 'Deepika Singh',
      age: 27,
      location: 'Delhi, NCR',
      education: 'CA',
      occupation: 'Chartered Accountant',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
      isOnline: false,
      membershipType: 'Premium',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FilterList color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Search Filters
              </Typography>
            </Box>

            {/* Age Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
              </Typography>
              <Slider
                value={filters.ageRange}
                onChange={(_, newValue) => setFilters({ ...filters, ageRange: newValue as number[] })}
                valueLabelDisplay="auto"
                min={18}
                max={50}
                marks={[
                  { value: 18, label: '18' },
                  { value: 30, label: '30' },
                  { value: 50, label: '50' },
                ]}
              />
            </Box>

            {/* Basic Filters */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Basic Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Religion</InputLabel>
                      <Select
                        value={filters.religion}
                        label="Religion"
                        onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                      >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="Hindu">Hindu</MenuItem>
                        <MenuItem value="Muslim">Muslim</MenuItem>
                        <MenuItem value="Christian">Christian</MenuItem>
                        <MenuItem value="Sikh">Sikh</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Mother Tongue</InputLabel>
                      <Select
                        value={filters.motherTongue}
                        label="Mother Tongue"
                        onChange={(e) => setFilters({ ...filters, motherTongue: e.target.value })}
                      >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="Hindi">Hindi</MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Tamil">Tamil</MenuItem>
                        <MenuItem value="Telugu">Telugu</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Education & Career */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Education & Career
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Education"
                      value={filters.education}
                      onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Occupation"
                      value={filters.occupation}
                      onChange={(e) => setFilters({ ...filters, occupation: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Location */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Location
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  size="small"
                  label="City, State"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </AccordionDetails>
            </Accordion>

            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              sx={{ mt: 3 }}
            >
              Search
            </Button>
          </Paper>
        </Grid>

        {/* Search Results */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Matches Found ({profiles.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Profiles matching your preferences
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {profiles.map((profile) => (
              <Grid item xs={12} sm={6} lg={4} key={profile.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 4 
                    }
                  }}
                >
                  {/* Online Status */}
                  {profile.isOnline && (
                    <Chip
                      label="Online"
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Membership Badge */}
                  <Chip
                    label={profile.membershipType}
                    color={profile.membershipType === 'Free' ? 'default' : 'primary'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                    }}
                  />

                  <CardMedia
                    component="img"
                    height="250"
                    image={profile.image}
                    alt={profile.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {profile.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.age} years
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {profile.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Work sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {profile.occupation}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {profile.education}
                    </Typography>
                    
                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Favorite />}
                      >
                        Interest
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Message />}
                      >
                        Message
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Load More */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button variant="outlined" size="large">
              Load More Profiles
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;