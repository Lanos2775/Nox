const fs = require('fs');

const svg = fs.readFileSync('dongson-drum.svg', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const injection = `
  <div id="royal-loading-svg" style="display:none; width: 80px; height: 80px; margin: 0 auto 20px auto;">
    ${svg.replace('width="1000" height="1000"', 'width="100%" height="100%"')}
  </div>
`;

const updatedHtml = html.replace(
  '<div class="app-loading-text">Nox</div>',
  `${injection}\n  <div class="app-loading-text">Nox</div>`
);

fs.writeFileSync('index.html', updatedHtml);
console.log('Injected SVG into index.html');
