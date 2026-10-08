const fs = require('fs');

function generateParticles() {
  let shadows1 = [];
  let shadows2 = [];
  for (let i = 0; i < 50; i++) {
    shadows1.push(`${Math.random() * 100}vw ${Math.random() * -100}vh rgba(212, 168, 67, ${Math.random() * 0.8 + 0.2})`);
    shadows2.push(`${Math.random() * 100}vw ${Math.random() * -100}vh rgba(212, 168, 67, ${Math.random() * 0.8 + 0.2})`);
  }
  return `
/* 11. CSS Particles (Hoa mai rơi) */
body[data-theme-level="25"]::before {
  content: '';
  position: fixed;
  top: 0; left: 0; width: 4px; height: 4px;
  background: transparent;
  z-index: -1;
  border-radius: 50%;
  box-shadow: ${shadows1.join(', ')};
  animation: royal-fall 15s linear infinite;
  pointer-events: none;
}

body[data-theme-level="25"]::after {
  /* This pseudo element is already used for the drum, so we can't use it for particles! */
}

@keyframes royal-fall {
  100% {
    transform: translateY(150vh);
  }
}
`;
}
fs.writeFileSync('particles.css', generateParticles());
