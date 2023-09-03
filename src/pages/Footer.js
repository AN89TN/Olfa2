import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='Footer'>
      Made by An89Tn, Copyright ⓒ {year}
    </footer>
  );
}

export default Footer;