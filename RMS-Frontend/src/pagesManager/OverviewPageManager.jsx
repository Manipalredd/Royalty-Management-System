import { useEffect, useState } from "react";
import { Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import ApiService from "../service/ApiService";
import StatCard from "../components/common/StatCard";
import Header from "../components/common/Header";
import BarChartArtists from "../components/componentsManager/BarChartArtists";
import TopArtistsRevenue from "../components/componentsManager/TopArtistsRevenue";

const OverviewPageManager= () => {
    const [stats, setStats] = useState({
        totalArtistSongs:0,
        totalArtistStreams:0,
        managerRevenue:0,
        artistTotalRevenue:0
    })

    const [error, setError] = useState(null);

    const BASE_URL = 'http://localhost:8080/insights';

    const managerId = ApiService.getManagerId()

    useEffect(() => {
        const fetchStats = async () => {
          try {
            const [totalSongs, totalStr, managerRev, totalRev] = await Promise.all([
              fetch(`${BASE_URL}/total-songs/${managerId}`,{headers: ApiService.getHeader(),}),
              fetch(`${BASE_URL}/total-streams/${managerId}`,{headers: ApiService.getHeader(),}),
              fetch(`${BASE_URL}/manager-revenue/${managerId}`,{headers: ApiService.getHeader(),}),
              fetch(`${BASE_URL}/total-revenue/${managerId}`,{headers: ApiService.getHeader(),}),{
                headers: ApiService.getHeader(),
              }
            ]);
    
            // Check if responses are ok
            if (!totalSongs.ok || !totalStr.ok || !managerRev.ok || !totalRev.ok) {
              throw new Error('One or more requests failed');
            }
    
            const totalArtistSongs = await totalSongs.json();
            const totalArtistStreams = await totalStr.json();
            const managerRevenue = await managerRev.json();
            const artistTotalRevenue = await totalRev.json();
    
            setStats({
                totalArtistSongs,
                totalArtistStreams,
                managerRevenue,
                artistTotalRevenue
            });
            setError(null);
          } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load statistics. Please try again later.');
          }
        };
    
        fetchStats();
      }, []);

      const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
      };
    
      const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(num);
      };
    
      return (
        <div className="flex-1 overflow-auto relative z-10">
          <Header title="Overview" />
          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
                {error}
              </div>
            )}
            {/* STATS */}
            <motion.div 
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard 
                name="Artist's Songs'" 
                icon={Users} 
                value={formatNumber(stats.totalArtistSongs)} 
                color="#6366F1" 
              />
              <StatCard 
                name="Songs Streams" 
                icon={Users} 
                value={formatNumber(stats.totalArtistStreams)} 
                color="#8B5CF6" 
              />
              <StatCard 
                name="My Revenue" 
                icon={DollarSign} 
                value={formatCurrency(stats.managerRevenue)} 
                color="#EC4899" 
              />
              <StatCard 
                name="Artits's Revenue" 
                icon={DollarSign} 
                value={formatCurrency(stats.artistTotalRevenue)} 
                color="#10B981" 
              />
            </motion.div>
    
            {/* CHARTS */}
            <TopArtistsRevenue/><br/>
            <BarChartArtists/>
          </main>
        </div>
      );
}

export default OverviewPageManager;