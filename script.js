document.addEventListener('DOMContentLoaded', function(){
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
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
});
