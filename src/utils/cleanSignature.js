/**
 * Adobe Scan "Auto Color" style signature cleaner:
 * 1. Estimates local paper illumination (handling uneven shadows / phone flash)
 *    via a downsampled morphological max-envelope + smooth blur.
 * 2. Normalizes every pixel by dividing against the local paper color so
 *    shadowed grey/yellow paper becomes uniform pure white while preserving
 *    true black or blue pen ink hue.
 * 3. Applies crisp levels/contrast, anti-aliased background transparency,
 *    and tight auto-cropping into a clean PNG.
 */
export async function cleanSignatureImage(file) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = objectUrl;
    });

    const maxDim = 1200;
    const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return objectUrl;

    ctx.drawImage(img, 0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Skip color normalization if already a transparent PNG
    let transparentCount = 0;
    const totalPixels = width * height;
    const sampleStep = Math.max(1, Math.floor(totalPixels / 3500));
    let sampled = 0;
    for (let i = 0; i < totalPixels; i += sampleStep) {
      sampled++;
      if (data[i * 4 + 3] < 235) transparentCount++;
    }
    const alreadyTransparent = transparentCount > sampled * 0.15;

    if (!alreadyTransparent) {
      // 1. Build a coarse illumination map (~1/10 scale) so pen strokes vanish
      const coarseScale = Math.max(8, Math.round(Math.max(width, height) / 96));
      const cw = Math.max(4, Math.ceil(width / coarseScale));
      const ch = Math.max(4, Math.ceil(height / coarseScale));

      const coarseCanvas = document.createElement('canvas');
      coarseCanvas.width = cw;
      coarseCanvas.height = ch;
      const cCtx = coarseCanvas.getContext('2d', { willReadFrequently: true });

      if (cCtx) {
        cCtx.imageSmoothingEnabled = true;
        cCtx.drawImage(canvas, 0, 0, cw, ch);
        const cData = cCtx.getImageData(0, 0, cw, ch);
        const cp = cData.data;

        // 2-pass 3x3 max filter on coarse grid to erase ink strokes from background map
        const maxBuf = new Uint8ClampedArray(cp.length);
        for (let pass = 0; pass < 2; pass++) {
          const src = pass === 0 ? cp : maxBuf;
          const dst = pass === 0 ? maxBuf : cp;
          for (let y = 0; y < ch; y++) {
            for (let x = 0; x < cw; x++) {
              let mr = 0;
              let mg = 0;
              let mb = 0;
              for (let dy = -1; dy <= 1; dy++) {
                const ny = Math.min(ch - 1, Math.max(0, y + dy));
                for (let dx = -1; dx <= 1; dx++) {
                  const nx = Math.min(cw - 1, Math.max(0, x + dx));
                  const idx = (ny * cw + nx) * 4;
                  if (src[idx] > mr) mr = src[idx];
                  if (src[idx + 1] > mg) mg = src[idx + 1];
                  if (src[idx + 2] > mb) mb = src[idx + 2];
                }
              }
              const oIdx = (y * cw + x) * 4;
              dst[oIdx] = mr;
              dst[oIdx + 1] = mg;
              dst[oIdx + 2] = mb;
              dst[oIdx + 3] = 255;
            }
          }
        }
        cCtx.putImageData(cData, 0, 0);

        // Smoothly upscale coarse background illumination back to full resolution
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = width;
        bgCanvas.height = height;
        const bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true });

        if (bgCtx) {
          bgCtx.imageSmoothingEnabled = true;
          bgCtx.imageSmoothingQuality = 'high';
          bgCtx.filter = 'blur(4px)';
          bgCtx.drawImage(coarseCanvas, 0, 0, width, height);
          bgCtx.filter = 'none';
          const bgData = bgCtx.getImageData(0, 0, width, height).data;

          // 2. Divide pixel by local paper color (Adobe Scan Auto-Color normalization)
          for (let i = 0; i < data.length; i += 4) {
            const br = Math.max(48, bgData[i]);
            const bg = Math.max(48, bgData[i + 1]);
            const bb = Math.max(48, bgData[i + 2]);

            let nr = Math.min(255, (data[i] / br) * 255);
            let ng = Math.min(255, (data[i + 1] / bg) * 255);
            let nb = Math.min(255, (data[i + 2] / bb) * 255);

            const luma = 0.299 * nr + 0.587 * ng + 0.114 * nb;
            const sat = Math.max(nr, ng, nb) - Math.min(nr, ng, nb);

            // Paper pixels cluster near 232-255 after local division
            const effectiveWhite = luma - sat * 0.35;

            if (effectiveWhite >= 224) {
              data[i + 3] = 0;
            } else if (effectiveWhite > 194) {
              const t = (224 - effectiveWhite) / 30;
              data[i + 3] = Math.round(t * 255);
              // Crisp Auto-Color contrast stretch
              data[i] = Math.max(0, Math.min(255, Math.round((nr - 35) * 1.15)));
              data[i + 1] = Math.max(0, Math.min(255, Math.round((ng - 35) * 1.15)));
              data[i + 2] = Math.max(0, Math.min(255, Math.round((nb - 28) * 1.15)));
            } else {
              data[i + 3] = 255;
              data[i] = Math.max(0, Math.min(255, Math.round((nr - 42) * 1.18)));
              data[i + 1] = Math.max(0, Math.min(255, Math.round((ng - 42) * 1.18)));
              data[i + 2] = Math.max(0, Math.min(255, Math.round((nb - 32) * 1.18)));
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }
      }
    }

    // 3. Auto-crop tight around remaining non-transparent ink strokes
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 20) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < minX || maxY < minY) {
      return objectUrl;
    }

    const pad = 10;
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropW = Math.min(width - cropX, maxX - minX + 1 + pad * 2);
    const cropH = Math.min(height - cropY, maxY - minY + 1 + pad * 2);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = cropW;
    outCanvas.height = cropH;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return objectUrl;

    outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const cleanedDataUrl = outCanvas.toDataURL('image/png');
    URL.revokeObjectURL(objectUrl);
    return cleanedDataUrl;
  } catch (err) {
    console.warn('Signature cleanup skipped, using original image:', err);
    return objectUrl;
  }
}
