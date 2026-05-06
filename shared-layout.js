const buildNav = () => {
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  const isHome = currentPage === '' || currentPage === 'index.html';
  const isTopQuestions = currentPage === 'top-questions.html';

  const navItems = [
    {
      label: 'Home',
      icon: 'fa-regular fa-house',
      href: isHome ? '#top' : 'index.html#top',
      active: isHome,
    },
    {
      label: 'Mentorship',
      icon: 'fa-solid fa-person-chalkboard',
      href: isHome ? '#connect' : 'index.html#connect',
      active: false,
    },
    {
      label: 'About Me',
      icon: 'fa-regular fa-address-card',
      href: isHome ? '#about' : 'index.html#about',
      active: false,
    },
    {
      label: 'Top Questions',
      icon: 'fa-solid fa-laptop-code',
      href: 'top-questions.html',
      active: isTopQuestions,
    },
  ];

  return `
    <header class="site-header">
      <div class="container nav-inner">
        <a class="brand" href="index.html">
          <img src="assets/logo.png" alt="Code Compass logo" class="logo">
          <div class="brand-text">
            <span class="brand-title">Code Compass <i class="fa-regular fa-compass"></i></span>
            <span class="brand-sub">Your roadmap to structured preparation</span>
          </div>
        </a>
        <nav class="site-nav">
          ${navItems.map(item => `
            <a href="${item.href}"${item.active ? ' class="active"' : ''}>
              <i class="${item.icon}"></i> &nbsp ${item.label}
            </a>
          `).join('')}
        </nav>
      </div>
    </header>
  `;
};

const buildFooter = () => `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-connect">Connect with us</div>
      <div class="footer-links">
        <a href="https://www.youtube.com/@CodeCompassHQ" target="_blank" rel="noopener">
          <i class="fa-brands fa-youtube"></i> Youtube <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <a href="https://www.linkedin.com/in/varun-kashyap-b0967411b/" target="_blank" rel="noopener">
          <i class="fa-brands fa-linkedin"></i> LinkedIn <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <a href="https://topmate.io/varun_kashyap12" target="_blank" rel="noopener">
          Topmate <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
      <div class="copyright">© 2026 Code Compass. All rights reserved</div>
    </div>
  </footer>
`;

const renderSharedLayout = () => {
  const headerContainer = document.getElementById('site-header-placeholder');
  const footerContainer = document.getElementById('site-footer-placeholder');

  if (headerContainer) {
    headerContainer.innerHTML = buildNav();
  }

  if (footerContainer) {
    footerContainer.innerHTML = buildFooter();
  }
};

document.addEventListener('DOMContentLoaded', renderSharedLayout);
