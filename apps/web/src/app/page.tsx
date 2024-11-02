import Discover from '@/components/landing/Discover';
import Filter from '@/components/landing/Filter';
import Hero from '@/components/landing/Hero';
import Wrapper from '@/components/wrapper';

export default function Home() {
  return (
    <Wrapper>
      <Hero />
      <Filter />
      <Discover />
    </Wrapper>
  );
}
