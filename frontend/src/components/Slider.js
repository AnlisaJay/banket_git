import React, { useState, useEffect } from 'react';
import img1 from '../images/01.jpg';
import img2 from '../images/02.jpg';
import img3 from '../images/03.jpeg';
import img4 from '../images/04.jpg';

const images = [img1, img2, img3, img4];

function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  function prev() {
    setCurrent(prev => (prev - 1 + images.length) % images.length);
  }

  function next() {
    setCurrent(prev => (prev + 1) % images.length);
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto 24px auto',
      overflow: 'hidden',
      borderRadius: '8px',
      border: '1px solid #FFDAB9'
    }}>
      <img
        src={images[current]}
        alt={`Слайд ${current + 1}`}
        style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
      />
      <button
        onClick={prev}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(218,165,32,0.8)',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        &#8592;
      </button>
      <button
        onClick={next}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(218,165,32,0.8)',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        &#8594;
      </button>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px'
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i === current ? '#DC143C' : '#fff',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;