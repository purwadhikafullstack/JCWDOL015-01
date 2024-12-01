'use client';
import { useGeolocation } from '@/components/geolocation/GeoUtils';
import Discover from '@/components/landing/Discover';
import JobList from '@/components/landing/Filtered';
import Hero from '@/components/landing/Hero';
import Wrapper from '@/components/wrapper';


export default function Home() {
  useGeolocation();
  
  return (
    <Wrapper>
      <Hero />
      <JobList />
    </Wrapper>
  );
}
