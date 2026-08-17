import { useState, useEffect, useCallback } from 'react';
import { CustomerRecord, AdminAnalyticsData } from '../types/customer';
import { ApiService } from '../services/api';

export const useAdminDashboard = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('ALL');

  const fetchData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [customersData, analyticsData] = await Promise.all([
        ApiService.getCustomers(),
        ApiService.getAdminAnalytics(),
      ]);
      setCustomers(customersData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Could not load admin dashboard data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter customers by search term and selected color
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.favoriteRainbowColor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.notes && customer.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesColor =
      selectedColorFilter === 'ALL' ||
      customer.favoriteRainbowColor.toLowerCase() === selectedColorFilter.toLowerCase();

    return matchesSearch && matchesColor;
  });

  return {
    customers,
    filteredCustomers,
    analytics,
    isLoading,
    isRefreshing,
    error,
    searchTerm,
    selectedColorFilter,
    setSearchTerm,
    setSelectedColorFilter,
    refreshData: () => fetchData(true),
  };
};
