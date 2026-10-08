const fs = require('fs');

const polar = (r, deg) => {
  const a = (deg - 90) * (Math.PI / 180);
  return [r * Math.cos(a), r * Math.sin(a)];
};

const starPath = (rays, outer, inner) => {
  const pts = [];
  for (let i = 0; i < rays * 2; i++) {
    const [x, y] = polar(i % 2 === 0 ? outer : inner, (i * 180) / rays);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join(' L')}Z`;
};

const zigzagPath = (r, amp, segments) => {
  const pts = [];
  for (let i = 0; i <= segments * 2; i++) {
    const [x, y] = polar(i % 2 === 0 ? r - amp : r + amp, (i * 180) / segments);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join(' L')}Z`;
};

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" width="1000" height="1000" fill="none" stroke="#D4AF37">
    <circle r="197" stroke-width="2" />
    <circle r="189" stroke-width="0.8" />`;

for (let i = 0; i < 90; i++) {
    svg += `\n    <line x1="0" y1="-189" x2="0" y2="-180" stroke-width="0.7" transform="rotate(${i * 4})" />`;
}

svg += `\n    <circle r="180" stroke-width="0.8" />`;

for (let i = 0; i < 8; i++) {
    svg += `\n    <g transform="rotate(${i * 45}) translate(0 -152)">
        <path d="M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z" stroke-width="1" fill="#D4AF37" fill-opacity="0.18" />
        <path d="M-8 4 L-14 16 M2 4 L-2 15" stroke-width="0.8" />
        <circle cx="12" cy="-2.5" r="1.4" fill="#D4AF37" stroke="none" />
    </g>`;
}

svg += `\n    <circle r="124" stroke-width="0.8" />`;

for (let i = 0; i < 60; i++) {
    const [x, y] = polar(117, i * 6);
    svg += `\n    <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.6" fill="#D4AF37" stroke="none" />`;
}

svg += `\n    <circle r="110" stroke-width="0.8" />
    <path d="${zigzagPath(99, 6, 36)}" stroke-width="0.8" />
    <circle r="88" stroke-width="0.8" />`;

for (let i = 0; i < 24; i++) {
    svg += `\n    <g transform="rotate(${i * 15}) translate(0 -76)">
        <circle r="7" stroke-width="0.8" />
        <circle r="2.5" stroke-width="0.6" />
    </g>`;
}

svg += `\n    <circle r="64" stroke-width="0.8" />
    <path d="${starPath(14, 58, 17)}" fill="#D4AF37" fill-opacity="0.28" stroke-width="1" />
    <circle r="13" stroke-width="1" fill="#D4AF37" fill-opacity="0.4" />
</svg>`;

fs.writeFileSync('dongson-drum.svg', svg);
console.log('Saved dongson-drum.svg');
