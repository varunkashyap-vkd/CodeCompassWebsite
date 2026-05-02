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
            <td>${itemIndex + 1}</td>
            <td><a class="table-link" href="${videoUrl}" target="_blank" rel="noopener">${rowTitle}</a></td>
            <td><span class="difficulty-pill ${safeDifficulty}">${item.difficulty}</span></td>
            <td>${item.domain || 'General'}</td>
            <td><a class="table-link" href="${videoUrl}" target="_blank" rel="noopener">Watch <i class="fa-brands fa-youtube"></i></a></td>
          </tr>
        `;
      }).join('') : '';

      return `
        <article class="list-block reveal">
          <div class="list-meta">
            <span class="list-chip">List ${listIndex + 1}</span>
            <h2>${list.title}</h2>
          </div>
          <p class="lead list-copy">${list.description}</p>
          <div class="table-frame">
            <table class="topic-table">
              <thead>
                <tr>
                  <th>S. No.</th>
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
        </article>
      `;
    }).join('');

    root.querySelectorAll('.reveal').forEach(el => {
      requestAnimationFrame(() => el.classList.add('visible'));
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
