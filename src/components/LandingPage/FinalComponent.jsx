import React from 'react';
import { motion, useInView } from 'framer-motion';
import Hero from './Hero';
import Gallery from './Gallery';
import Heading from './Heading';
import Feature from './Feature';
import Footer from '../Footer';

function FinalComponent() {
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  };

  return (
    <>
      <InViewWrapper>
        <Hero />
      </InViewWrapper>

      <InViewWrapper delay={0.2}>
        <Gallery />
      </InViewWrapper>

      <InViewWrapper delay={0.4}>
        <Heading />
      </InViewWrapper>

      <InViewWrapper delay={0.6}>
        <Feature />
      </InViewWrapper>

      <InViewWrapper delay={0.8}>
        <Footer />
      </InViewWrapper>
    </>
  );
}

// Custom wrapper to animate each component on scroll
function InViewWrapper({ children, delay = 0 }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={{
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export default FinalComponent;
