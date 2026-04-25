document.addEventListener('DOMContentLoaded', function(){
  // ensure header height is available as CSS variable for offsets
  const headerEl = document.querySelector('.site-header');
  const computedHeaderHeight = headerEl ? headerEl.offsetHeight : 96;
  document.documentElement.style.setProperty('--header-height', computedHeaderHeight + 'px');

  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.12});
  reveals.forEach(r=>io.observe(r));

  const accordions = document.querySelectorAll('.accordion-toggle');
  accordions.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const open = btn.classList.contains('open');
      if(open){
        btn.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        btn.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      const href = anchor.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          const headerHeight = headerEl ? headerEl.offsetHeight : (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 96);
          const rect = target.getBoundingClientRect();
          const targetY = window.scrollY + rect.top - headerHeight;
          window.scrollTo({top: targetY, behavior: 'smooth'});
        }
      }
    });
  });

  // Scroll-spy: highlight nav item for section in view (use header bottom as reference)
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'))
    .filter(a => a.getAttribute('href') && a.getAttribute('href').startsWith('#'));
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if(navLinks.length && sections.length){
    const updateActiveByPosition = ()=>{
      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 96);
      const sectionsAbove = sections.filter(s => s.getBoundingClientRect().top <= headerBottom + 2);
      let current = sections[0];
      if(sectionsAbove.length){
        current = sectionsAbove[sectionsAbove.length - 1];
      } else {
        current = sections[0];
      }
      const id = '#' + current.id;
      navLinks.forEach(link=>{
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    };

    // ensure clicking a nav anchor updates active state promptly
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if(!href || !href.startsWith('#')) return;
        // after smooth scroll starts, refresh active state shortly after
        setTimeout(updateActiveByPosition, 300);
      });
    });

    // initial sync after layout settles
    setTimeout(updateActiveByPosition, 50);

    // efficient scroll handler using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', ()=>{
      if(!ticking){
        window.requestAnimationFrame(()=>{ updateActiveByPosition(); ticking = false; });
        ticking = true;
      }
    }, {passive:true});

    // update on resize (recalculate header height CSS var)
    window.addEventListener('resize', ()=>{
      const h = document.querySelector('.site-header')?.offsetHeight || (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 96);
      document.documentElement.style.setProperty('--header-height', h + 'px');
      updateActiveByPosition();
    });

    // ensure immediate state is correct
    updateActiveByPosition();
  }

  // Counter animation for stats section
  const aboutSection = document.getElementById('about');
  if(aboutSection){
    const counterIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting && !entry.target.dataset.counted){
          entry.target.dataset.counted = 'true';
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(elem=>{
            const target = parseInt(elem.dataset.target);
            const duration = 2000; // 2 seconds
            const start = Date.now();
            
            const animate = ()=>{
              const now = Date.now();
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.floor(progress * target);
              
              elem.textContent = current;
              
              if(progress < 1){
                requestAnimationFrame(animate);
              } else {
                elem.textContent = target + '+';
              }
            };
            animate();
          });
          counterIO.unobserve(entry.target);
        }
      });
    }, {threshold: 0.3});
    
    counterIO.observe(aboutSection);
  }

  // Companies logos animation - triggers when companies section comes into view
  const companiesSection = document.querySelector('.companies-section');
  if(companiesSection){
    const companiesIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting && !entry.target.dataset.animated){
          entry.target.dataset.animated = 'true';
          const logos = entry.target.querySelectorAll('.company-logo');
          logos.forEach((logo, index)=>{
            setTimeout(()=>{
              logo.classList.add('animate-in');
            }, index * 500); // 0s, 0.5s, 1s delay for 3 total seconds
          });
          companiesIO.unobserve(entry.target);
        }
      });
    }, {threshold: 0.5});
    
    companiesIO.observe(companiesSection);
  }
});
