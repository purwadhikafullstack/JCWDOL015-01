'use client';
import { useState, useEffect } from 'react';
import { fetchLocations, fetchJobsByFilter } from '@/lib/job'; // Import the functions
import { JobFilters } from '@/types/job';

export default function Filter({
  onFilterChange,
}: {
  onFilterChange: (filters: JobFilters) => void;
}) {
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [remoteOption, setRemoteOption] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string>('');

  // Fetch locations when the component mounts
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const fetchedLocations = await fetchLocations(); // Use the fetchLocations function
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    };

    loadLocations();
  }, []);

  // Handle filter changes
  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLocation(event.target.value);
  };

  const handleRemoteOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRemoteOption(event.target.checked);
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTags(event.target.value);
  };

  const handleSubmit = async () => {
    const filters: JobFilters = {
      location: selectedLocation,
      remoteOption,
      tags: selectedTags,
    };

    // Call the onFilterChange passed from the parent component
    onFilterChange(filters);

    try {
      const filteredJobs = await fetchJobsByFilter(filters); // Fetch jobs based on the filters
      console.log('Filtered Jobs:', filteredJobs);
    } catch (error) {
      console.error('Error fetching filtered jobs:', error);
    }
  };

  return (
    <div className="filter-section">
      <label>
        Location:
        <select value={selectedLocation} onChange={handleLocationChange}>
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <label>
        Remote:
        <input
          type="checkbox"
          checked={remoteOption}
          onChange={handleRemoteOptionChange}
        />
      </label>

      <label>
        Tags:
        <input
          type="text"
          value={selectedTags}
          onChange={handleTagsChange}
          placeholder="Enter tags separated by commas"
        />
      </label>

      <button onClick={handleSubmit}>Apply Filters</button>
    </div>
  );
}
