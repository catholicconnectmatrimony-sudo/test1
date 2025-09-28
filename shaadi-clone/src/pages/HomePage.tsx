import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Favorite,
  Security,
  Verified,
  Star,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchData, setSearchData] = useState({
    lookingFor: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    motherTongue: '',
    country: '',
  });

  const handleSearch = () => {
    navigate('/search', { state: searchData });
  };

  const successStories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=200&fit=crop',
      names: 'Priya & Rahul',
      story: 'Found love through Shaadi.com after 6 months of search. Perfect match!',
      location: 'Mumbai, India',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop',
      names: 'Anita & Vikram',
      story: 'Connected across continents and now happily married for 2 years.',
      location: 'Delhi, India',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1544308664-6ac5e5b4b4a5?w=300&h=200&fit=crop',
      names: 'Shreya & Amit',
      story: 'Professional compatibility led to a beautiful life partnership.',
      location: 'Bangalore, India',
    },
  ];

  const features = [
    {
      icon: <Search color="primary" sx={{ fontSize: 40 }} />,
      title: 'Advanced Search',
      description: 'Find your perfect match with our detailed search filters',
    },
    {
      icon: <Security color="primary" sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Your privacy and security are our top priorities',
    },
    {
      icon: <Verified color="primary" sx={{ fontSize: 40 }} />,
      title: 'Verified Profiles',
      description: 'All profiles are manually verified for authenticity',
    },
  ];

  const stats = [
    { number: '35 Million+', label: 'Registered Users' },
    { number: '50 Lakhs+', label: 'Success Stories' },
    { number: '300+', label: 'Communities' },
    { number: '200+', label: 'Countries' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F3426A 0%, #FF7A9D 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                Find Your Perfect Life Partner
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join millions of people who found their soulmate on Shaadi.com.
                The most trusted matrimony service for finding your perfect match.
              </Typography>
              
              {/* Quick Search */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderRadius: 2 
                }}
              >
                <Typography 
                  variant="h6" 
                  color="primary" 
                  fontWeight="bold" 
                  gutterBottom
                >
                  Quick Search
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Looking for</InputLabel>
                      <Select
                        value={searchData.lookingFor}
                        label="Looking for"
                        onChange={(e) => setSearchData({ ...searchData, lookingFor: e.target.value })}
                      >
                        <MenuItem value="Bride">Bride</MenuItem>
                        <MenuItem value="Groom">Groom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Age From"
                      type="number"
                      value={searchData.ageFrom}
                      onChange={(e) => setSearchData({ ...searchData, ageFrom: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Age To"
                      type="number"
                      value={searchData.ageTo}
                      onChange={(e) => setSearchData({ ...searchData, ageTo: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Religion</InputLabel>
                      <Select
                        value={searchData.religion}
                        label="Religion"
                        onChange={(e) => setSearchData({ ...searchData, religion: e.target.value })}
                      >
                        <MenuItem value="Hindu">Hindu</MenuItem>
                        <MenuItem value="Muslim">Muslim</MenuItem>
                        <MenuItem value="Christian">Christian</MenuItem>
                        <MenuItem value="Sikh">Sikh</MenuItem>
                        <MenuItem value="Buddhist">Buddhist</MenuItem>
                        <MenuItem value="Jain">Jain</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Mother Tongue</InputLabel>
                      <Select
                        value={searchData.motherTongue}
                        label="Mother Tongue"
                        onChange={(e) => setSearchData({ ...searchData, motherTongue: e.target.value })}
                      >
                        <MenuItem value="Hindi">Hindi</MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Tamil">Tamil</MenuItem>
                        <MenuItem value="Telugu">Telugu</MenuItem>
                        <MenuItem value="Bengali">Bengali</MenuItem>
                        <MenuItem value="Marathi">Marathi</MenuItem>
                        <MenuItem value="Gujarati">Gujarati</MenuItem>
                        <MenuItem value="Punjabi">Punjabi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<Search />}
                      onClick={handleSearch}
                      sx={{ mt: 1 }}
                    >
                      Let's Begin
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=600&h=400&fit=crop"
                alt="Happy Couple"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 6, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {stat.number}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Why Choose Shaadi.com?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            India's most trusted matrimony service with millions of verified profiles
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={2}
                  sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Real stories of love found on Shaadi.com
          </Typography>
          
          <Grid container spacing={4}>
            {successStories.map((story) => (
              <Grid item xs={12} md={4} key={story.id}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={story.image}
                    alt={story.names}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Favorite color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {story.names}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {story.story}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {story.location}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
            >
              View More Stories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Find Your Soulmate?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join millions of happy couples who found love on Shaadi.com
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 4 }}
            >
              Register Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;