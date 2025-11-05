import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import geohash from "geohash";
import { MongoClient } from "mongodb";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin }));
app.use(morgan("dev"));
app.use(express.json());

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
let db;
let mongoClient;
let favoritesStore = []; // In-memory storage as fallback

async function connectToMongoDB() {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
  db = mongoClient.db("Ticketmaster");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Using in-memory storage for favorites');
  }
}

// Initialize MongoDB connection
connectToMongoDB();

// Helper function to make Ticketmaster API calls
async function callTicketmasterAPI(endpoint, params = {}) {
  const url = new URL(`${TICKETMASTER_BASE_URL}${endpoint}`);
  url.searchParams.append('apikey', TICKETMASTER_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ticketmaster API call failed:', error);
    throw error;
  }
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

// Ticketmaster Suggest API proxy
app.get("/api/suggest", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword parameter is required" });
    }

    const data = await callTicketmasterAPI('/suggest', { keyword });
    res.json(data);
  } catch (error) {
    console.error('Suggest API error:', error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// Ticketmaster Events Search API proxy
app.get("/api/events", async (req, res) => {
  try {
    const { keyword, category, distance, lat, lng, radius } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: "Keyword parameter is required" });
    }

    const params = {
      keyword,
      size: 20, // Max 20 results as per requirements
      sort: 'date,asc' // Sort by date ascending
    };

    // Add category filter if specified
    if (category && category !== 'All') {
      const categoryMap = {
        'Music': 'KZFzniwnSyZfZ7v7nE',
        'Sports': 'KZFzniwnSyZfZ7v7nJ',
        'Arts & Theatre': 'KZFzniwnSyZfZ7v7n1',
        'Film': 'KZFzniwnSyZfZ7v7n1',
        'Miscellaneous': 'KZFzniwnSyZfZ7v7n1'
      };
      if (categoryMap[category]) {
        params.segmentId = categoryMap[category];
      }
    }

    // Add location-based search if coordinates provided
    if (lat && lng) {
      params.latlong = `${lat},${lng}`;
      params.radius = radius || distance || 10;
      params.unit = 'miles';
    }

    const data = await callTicketmasterAPI('/events', params);
    res.json(data);
  } catch (error) {
    console.error('Events API error:', error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Ticketmaster Event Details API proxy
app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const data = await callTicketmasterAPI(`/events/${id}`);
    res.json(data);
  } catch (error) {
    console.error('Event details API error:', error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

// Spotify API endpoints
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Spotify token error:', error);
    throw error;
  }
}

// Spotify Search API
app.get("/api/spotify/search", async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q || !type) {
      return res.status(400).json({ error: "Query and type parameters are required" });
    }

    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Spotify search error:', error);
    res.status(500).json({ error: "Failed to search Spotify" });
  }
});

// Spotify Albums API
app.get("/api/spotify/albums/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    if (!artistId) {
      return res.status(400).json({ error: "Artist ID is required" });
    }

    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=8`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Spotify albums error:', error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

// Favorites API endpoints
app.get("/api/favorites", async (req, res) => {
  try {
    console.log('Favorites GET - db status:', !!db, 'mongoClient status:', !!mongoClient);
    if (db) {
      const favorites = await db.collection('favourites').find({}).toArray();
      console.log('Found favorites from MongoDB:', favorites.length);
      res.json(favorites);
    } else {
      // Use in-memory storage
      console.log('Using in-memory storage, count:', favoritesStore.length);
      res.json(favoritesStore);
    }
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { eventId, eventName, eventDate, eventTime, eventVenue, eventImage, eventUrl } = req.body;
    
    if (db) {
      // Check if already exists
      const existing = await db.collection('favourites').findOne({ eventId });
      if (existing) {
        return res.status(400).json({ error: "Event already in favorites" });
      }

      const favorite = {
        eventId,
        eventName,
        eventDate,
        eventTime,
        eventVenue,
        eventImage,
        eventUrl,
        createdAt: new Date()
      };

      await db.collection('favourites').insertOne(favorite);
      res.status(201).json(favorite);
    } else {
      // Use in-memory storage
      const existing = favoritesStore.find(fav => fav.eventId === eventId);
      if (existing) {
        return res.status(400).json({ error: "Event already in favorites" });
      }

      const favorite = {
        _id: Date.now().toString(),
        eventId,
        eventName,
        eventDate,
        eventTime,
        eventVenue,
        eventImage,
        eventUrl,
        createdAt: new Date()
      };

      favoritesStore.push(favorite);
      res.status(201).json(favorite);
    }
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

app.delete("/api/favorites/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    
    if (db) {
      const result = await db.collection('favourites').deleteOne({ eventId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      
      res.json({ message: "Favorite removed successfully" });
    } else {
      // Use in-memory storage
      const index = favoritesStore.findIndex(fav => fav.eventId === eventId);
      if (index === -1) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      
      favoritesStore.splice(index, 1);
      res.json({ message: "Favorite removed successfully" });
    }
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Static serving for built frontend (client/dist) when available
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api).*/, (req, res) => {
  const indexPath = path.join(clientDist, "index.html");
  res.sendFile(indexPath, err => {
    if (err) res.status(404).send("Not found");
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
