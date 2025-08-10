import { Express } from 'express';
import { globalCityDatabase } from './global-city-database';

export function registerCityRoutes(app: Express) {
  // Global city search with worldwide coverage
  app.get("/api/cities/search", async (req, res) => {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      // Use global city database for worldwide coverage
      const results = await globalCityDatabase.searchCitiesGlobal(query, 20);
      
      res.json({
        cities: results,
        total: results.length,
        coverage: 'Global - All Continents',
        apiStatus: results.length > 0 ? 'Active' : 'Fallback'
      });
    } catch (error) {
      console.error("Global city search error:", error);
      res.status(500).json({ error: "Failed to search global cities" });
    }
  });

  // Get cities by country
  app.get("/api/cities/country/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      const results = await globalCityDatabase.getCitiesByCountry(countryCode.toUpperCase(), 100);
      
      res.json({
        cities: results,
        country: countryCode,
        total: results.length
      });
    } catch (error) {
      console.error("Country city search error:", error);
      res.status(500).json({ error: "Failed to get cities by country" });
    }
  });

  // Get major cities worldwide
  app.get("/api/cities/major", async (req, res) => {
    try {
      const { minPopulation = '100000' } = req.query;
      const results = await globalCityDatabase.getMajorCitiesWorldwide(parseInt(minPopulation as string));
      
      res.json({
        cities: results,
        total: results.length,
        minPopulation: parseInt(minPopulation as string),
        coverage: 'Global Major Cities'
      });
    } catch (error) {
      console.error("Major cities error:", error);
      res.status(500).json({ error: "Failed to get major cities" });
    }
  });

  // Get global database statistics
  app.get("/api/cities/stats", async (req, res) => {
    try {
      const stats = await globalCityDatabase.getGlobalStats();
      res.json(stats);
    } catch (error) {
      console.error("City stats error:", error);
      res.status(500).json({ error: "Failed to get city statistics" });
    }
  });
}