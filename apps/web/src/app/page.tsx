'use client';
import { useGeolocation } from '@/components/geolocation/GeoUtils';
import Discover from '@/components/landing/Discover';
import Filter from '@/components/landing/Filter';
import Hero from '@/components/landing/Hero';
import Wrapper from '@/components/wrapper';
import { useEffect } from 'react';

export default function Home() {
  const { location, address } = useGeolocation();
  
  return (
    <Wrapper>
      <Hero />
      <Filter />
      <Discover />
    </Wrapper>
  );
}
