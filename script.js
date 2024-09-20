window.onload = function () {
  const canvas = document.getElementById("flowerCanvas");
  const ctx = canvas.getContext("2d");

  let flowersDrawn = 0;
  let heartCompleted = false;
  let flowerPositions = [];
  let growthFactor = 0.01;
  let heartRadius = 100;
  let maxAdditionalFlowers = 50; // Fewer additional flowers

  // Define positions using parametric equations to form a heart shape
  function defineHeartShape() {
    const scale = 10;
    const xOffset = canvas.width / 2;
    const yOffset = canvas.height / 2 + 50;

    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
      let x = scale * (16 * Math.sin(t) ** 3);
      let y =
        -scale *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t));

      flowerPositions.push({
        x: xOffset + x,
        y: yOffset + y,
      });
    }
  }

  // Populate remaining canvas with fewer flowers outside the heart
  function populateFieldWithFlowers() {
    for (let i = 0; i < maxAdditionalFlowers; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;

      if (!isInsideHeart(x, y)) {
        flowerPositions.push({ x, y });
      }
    }
  }

  // Check if a point is inside the heart
  function isInsideHeart(x, y) {
    const xOffset = canvas.width / 2;
    const yOffset = canvas.height / 2 + 50;
    const dx = x - xOffset;
    const dy = y - yOffset;
    return Math.sqrt(dx * dx + dy * dy) < heartRadius;
  }

  // Draw hearts as clouds in the sky
  function drawCloudHearts() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    for (let i = 0; i < 10; i++) {
      // Number of cloud hearts
      let x = Math.random() * canvas.width;
      let y = (Math.random() * canvas.height) / 2; // Top half of the canvas
      drawHeart(x, y, 0.5 + Math.random() * 0.5); // Random size
    }
  }

  // Function to draw a flower
  function drawFlower(x, y, growth) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 40 * growth);
    ctx.strokeStyle = "#228B22"; // Stem color
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FFD700"; // Petal color
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        10 * growth,
        20 * growth,
        (i * Math.PI) / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, 7 * growth, 0, Math.PI * 2);
    ctx.fillStyle = "#FFA500"; // Center color
    ctx.fill();
  }

  // Animate flowers
  function animateFlowers() {
    if (flowersDrawn < flowerPositions.length) {
      let growth = Math.min(1, growthFactor);
      let pos = flowerPositions[flowersDrawn];
      drawFlower(pos.x, pos.y, growth);

      if (growthFactor >= 1) {
        flowersDrawn++;
        growthFactor = 0.01;
      } else {
        growthFactor += 0.05;
      }
    } else if (!heartCompleted) {
      heartCompleted = true;
      drawCloudHearts(); // Draw cloud hearts after completing the heart
    }
    requestAnimationFrame(animateFlowers);
  }

  // Initialize and start
  defineHeartShape();
  populateFieldWithFlowers();
  animateFlowers();
};
