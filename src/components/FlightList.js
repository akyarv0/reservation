// src/components/FlightList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const API_URL = 'https://api.schiphol.nl/public-flights/flights';

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [date, setDate] = useState('');
  const [direction, setDirection] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'resourceversion': 'v4',
          'app_id': '[app_id]',
          'app_key': '[app_key]'
        },
        params: {
          date,
          direction,
          ...filters
        }
      });
      setFlights(response.data.flights || []);
    } catch (err) {
      setError('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchFlights({ date, direction });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Flight List
      </Typography>
      <TextField
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Direction"
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      {loading && <Typography variant="body1">Loading...</Typography>}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <List>
        {flights.map((flight) => (
          <ListItem key={flight.id}>
            <ListItemText
              primary={`Flight Number: ${flight.flightNumber}`}
              secondary={`Date: ${flight.date}, Direction: ${flight.direction}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FlightList;
