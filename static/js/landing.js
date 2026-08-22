/**
 * Lumina AI - Landing Page Interactive Features
 * Before/After Slider & FAQ Accordion Controllers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Before / After Slider Logic
  const sliderContainer = document.getElementById('slider-container');
  const beforeLayer = document.getElementById('slider-before-layer');
  const handleBtn = document.getElementById('slider-handle-btn');

  if (sliderContainer && beforeLayer && handleBtn) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = sliderContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeLayer.style.width = `${percentage}%`;
      handleBtn.style.left = `${percentage}%`;
    }

    // Mouse Events
    handleBtn.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch Events for Mobile / Tablets
    handleBtn.addEventListener('touchstart', (e) => {
      isDragging = true;
    }, { passive: true });

    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches.length) {
        setSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches.length) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
});
