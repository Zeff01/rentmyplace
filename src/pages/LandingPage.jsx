import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bed, Bath, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import propertiesData from '@/data/properties.json';

const LandingPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    beds: ''
  });
  const [imageErrors, setImageErrors] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [approvedProperties, setApprovedProperties] = useState(new Set());

  useEffect(() => {
    setProperties(propertiesData);
    setFilteredProperties(propertiesData);
    fetchApprovedApplications();
  }, []);

  const fetchApprovedApplications = async () => {
    try {
      const q = query(
        collection(db, 'applications'),
        where('status', '==', 'approved')
      );
      const querySnapshot = await getDocs(q);
      const approved = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        approved.add(data.propertyId);
      });
      setApprovedProperties(approved);
    } catch (error) {
      console.error('Error fetching approved applications:', error);
    }
  };

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(property =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.rent >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.rent <= parseInt(filters.maxPrice));
    }

    if (filters.beds) {
      filtered = filtered.filter(property => property.beds >= parseInt(filters.beds));
    }

    setFilteredProperties(filtered);
  }, [searchTerm, filters, properties]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleImageError = (propertyId) => {
    setImageErrors(prev => ({ ...prev, [propertyId]: true }));
  };

  const handleImageLoad = (propertyId) => {
    setImagesLoaded(prev => ({ ...prev, [propertyId]: true }));
  };

  const getUniqueCity = () => {
    return [...new Set(properties.map(p => p.city))].sort();
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Find Your Perfect Home
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Discover amazing rental properties in your area
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-card p-6 rounded-lg shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by property name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
              >
                <option value="">All Cities</option>
                {getUniqueCity().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
              <Input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <Input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
              <Input
                type="number"
                name="beds"
                placeholder="Min Beds"
                value={filters.beds}
                onChange={handleFilterChange}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Available Properties</h2>
          
          <AnimatePresence mode="wait">
            {filteredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <p className="text-xl text-gray-600 font-medium">No properties found matching your criteria.</p>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ y: -5 }}
                    style={{ opacity: 1 }}
                  >
                    <Card className={cn(
                      "overflow-hidden h-full flex flex-col bg-white border-2 shadow-lg hover:shadow-xl transition-shadow",
                      approvedProperties.has(property.id) ? "border-red-300 opacity-75" : "border-gray-300"
                    )} style={{ backgroundColor: '#ffffff' }}>
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {!imagesLoaded[property.id] && (
                          <Skeleton className="absolute inset-0 bg-gray-200" />
                        )}
                        <img
                          src={imageErrors[property.id] 
                            ? `https://source.unsplash.com/800x600/?house,home,${property.id}` 
                            : property.img}
                          alt={property.title}
                          className={cn(
                            "w-full h-full object-cover transition-all duration-300",
                            !approvedProperties.has(property.id) && "hover:scale-110",
                            !imagesLoaded[property.id] && "opacity-0",
                            approvedProperties.has(property.id) && "filter grayscale"
                          )}
                          loading="lazy"
                          onLoad={() => handleImageLoad(property.id)}
                          onError={() => handleImageError(property.id)}
                        />
                        {approvedProperties.has(property.id) && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                              RENTED
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-lg">
                          <span className="flex items-center gap-1 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {property.rent}/mo
                          </span>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 flex-1 bg-white">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{property.title}</h3>
                        <p className="text-gray-600 mb-4 flex items-center gap-1 font-medium">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {property.city}
                        </p>
                        
                        <div className="flex gap-4 text-sm text-gray-700">
                          <span className="flex items-center gap-1 font-medium">
                            <Bed className="h-4 w-4 text-gray-500" />
                            {property.beds} beds
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Bath className="h-4 w-4 text-gray-500" />
                            {property.baths} baths
                          </span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 pt-0">
                        {approvedProperties.has(property.id) ? (
                          <Button className="w-full" disabled variant="secondary">
                            Not Available
                          </Button>
                        ) : (
                          <Link to={`/apply/${property.id}`} className="w-full">
                            <Button className="w-full">Apply Now</Button>
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;