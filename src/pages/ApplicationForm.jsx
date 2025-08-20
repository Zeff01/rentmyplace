import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import propertiesData from '@/data/properties.json';

const ApplicationForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: currentUser?.email || '',
    phone: '',
    monthlyIncome: '',
    moveInDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const foundProperty = propertiesData.find(p => p.id === propertyId);
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      toast.error('Property not found');
      navigate('/');
    }
  }, [propertyId, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = formData.phone.replace(/[^\d]/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        newErrors.phone = 'Phone number must be between 7-15 digits';
      }
    }

    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = 'Monthly income is required';
    } else if (parseInt(formData.monthlyIncome) < property?.rent * 3) {
      newErrors.monthlyIncome = `Monthly income should be at least 3x the rent ($${property?.rent * 3})`;
    }

    if (!formData.moveInDate) {
      newErrors.moveInDate = 'Move-in date is required';
    } else if (new Date(formData.moveInDate) < new Date()) {
      newErrors.moveInDate = 'Move-in date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting application for property:', property.id);
      
      const docRef = await addDoc(collection(db, 'applications'), {
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title,
        userId: currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      console.log('Application submitted with ID:', docRef.id);
      toast.success('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      console.error('Firestore error:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check Firestore rules.');
      } else if (error.code === 'unavailable') {
        toast.error('Firestore is unavailable. Please try again later.');
      } else if (error.code === 'not-found') {
        toast.error('Firestore database not found. Please check configuration.');
      } else {
        toast.error(`Failed to submit: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Apply for {property.title}</CardTitle>
              <CardDescription>
                ${property.rent}/month • {property.beds} beds • {property.baths} baths • {property.city}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'border-destructive' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                  <Input
                    id="monthlyIncome"
                    name="monthlyIncome"
                    type="number"
                    placeholder="5000"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className={errors.monthlyIncome ? 'border-destructive' : ''}
                  />
                  {errors.monthlyIncome && (
                    <p className="text-sm text-destructive">{errors.monthlyIncome}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Desired Move-in Date *</Label>
                  <Input
                    id="moveInDate"
                    name="moveInDate"
                    type="date"
                    value={formData.moveInDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.moveInDate ? 'border-destructive' : ''}
                  />
                  {errors.moveInDate && (
                    <p className="text-sm text-destructive">{errors.moveInDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Tell us a bit about yourself..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationForm;