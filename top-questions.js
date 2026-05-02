document.addEventListener('DOMContentLoaded', async function() {
  const root = document.getElementById('top-questions-root');
  if (!root) return;

  const renderLists = (lists) => {
    if (!Array.isArray(lists) || !lists.length) {
      root.innerHTML = '<p class="note">No question lists are available yet. Please check back soon.</p>';
      return;
    }

    root.innerHTML = lists.map((list, listIndex) => {
      const rows = Array.isArray(list.items) ? list.items.map((item, itemIndex) => {
        const safeDifficulty = String(item.difficulty || '').toLowerCase();
        const rowTitle = item.title || 'Untitled Problem';
        const videoUrl = item.videoUrl || '#';

        return `
          <tr>
            <td class="col-sno">${itemIndex + 1}</td>
            <td class="col-problem"><a class="table-link problem-link" href="${videoUrl}" target="_blank" rel="noopener">${rowTitle}</a></td>
            <td><span class="difficulty-pill ${safeDifficulty}">${item.difficulty}</span></td>
            <td>${item.domain || 'General'}</td>
            <td class="col-watch"><a class="table-link watch-link" href="${videoUrl}" target="_blank" rel="noopener">Watch <i class="fa-brands fa-youtube"></i></a></td>
          </tr>
        `;
      }).join('') : '';

      return `
        <article class="list-block reveal" id="list-${listIndex}">
          <div class="container">
            <h2 class="list-title">${list.title}</h2>
            <p class="lead list-copy">${list.description}</p>
            <div class="table-frame">
              <table class="topic-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Problem Name</th>
                    <th>Difficulty</th>
                    <th>Domain</th>
                    <th>Code Compass Solution</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows || '<tr><td colspan="5">No problems added yet.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      `;
    }).join('');

    root.querySelectorAll('.reveal').forEach(el => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const listIndex = btn.dataset.list;
        const targetList = document.getElementById(`list-${listIndex}`);
        if (targetList) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 96;
          const targetY = window.scrollY + targetList.getBoundingClientRect().top - headerHeight - 20;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });
  };

  try {
    const module = await fetch('./assets/top-questions.json');
    const data = await module.json();
    renderLists(Array.isArray(data.lists) ? data.lists : []);
  } catch (error) {
    console.error('Unable to load top questions JSON:', error);
    root.innerHTML = '<p class="note">Unable to load the Top Questions data right now. Please try again later.</p>';
  }
});
