document.addEventListener('DOMContentLoaded', async function() {
  const WATCH_REDIRECT_ENABLED = false; // set to true when YouTube videos are ready
  const root = document.getElementById('top-questions-root');
  if (!root) return;

  const showToast = (message, anchor = null) => {
    let toast = document.querySelector('.toast-message');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-message';
      document.body.appendChild(toast);
    }
    toast.textContent = message;

    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      toast.style.position = 'absolute';
      toast.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
      toast.style.top = `${rect.bottom + window.scrollY + 12}px`;
      toast.style.bottom = 'auto';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    } else {
      toast.style.position = 'fixed';
      toast.style.left = '50%';
      toast.style.bottom = '24px';
      toast.style.top = 'auto';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }

    toast.classList.remove('toast-exiting');
    toast.classList.add('toast-visible');
    clearTimeout(toast.dataset.timeoutId);
    clearTimeout(toast.dataset.exitTimeoutId);
    const timeoutId = window.setTimeout(() => {
      toast.classList.add('toast-exiting');
      const exitTimeoutId = window.setTimeout(() => {
        toast.classList.remove('toast-visible');
      }, 600);
      toast.dataset.exitTimeoutId = exitTimeoutId;
    }, 2200);
    toast.dataset.timeoutId = timeoutId;
  };

  const renderLists = (lists) => {
    if (!Array.isArray(lists) || !lists.length) {
      root.innerHTML = '<p class="note">No question lists are available yet. Please check back soon.</p>';
      return;
    }

    root.innerHTML = lists.map((list, listIndex) => {
      const rows = Array.isArray(list.items) ? list.items.map((item, itemIndex) => {
        const safeDifficulty = String(item.difficulty || '').toLowerCase();
        const rowTitle = item.title + "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i>" || 'Untitled Problem';
        const videoUrl = item.videoUrl || '#';
        const problemUrl = item.problemUrl || '#';

        return `
          <tr>
            <td class="col-sno">${itemIndex + 1}</td>
            <td class="col-problem"><a class="table-link problem-link" href="${problemUrl}" target="_blank" rel="noopener">${rowTitle}</a></td>
            <td><span class="difficulty-pill ${safeDifficulty}">${item.difficulty}</span></td>
            <td>${item.domain || 'General'}</td>
            <td class="col-watch"><a class="table-link watch-link" href="${videoUrl}" target="_blank" rel="noopener">Watch <i class="fa-brands fa-youtube"></i></a></td>
          </tr>
        `;
      }).join('') : '';

      return `
        <article class="list-block reveal" id="list-${listIndex}">
          <div class="container">
            <h3 class="list-title">${list.title}</h3>
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
          const targetY = window.scrollY + targetList.getBoundingClientRect().top - headerHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    if (!WATCH_REDIRECT_ENABLED) {
      root.querySelectorAll('.watch-link').forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          showToast('Coming soon', event.currentTarget);
        });
      });
    }
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
