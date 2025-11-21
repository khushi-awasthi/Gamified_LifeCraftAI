/* resume_builder3.js
   - Keeps preview editable
   - Adds/removes/hides sections
   - AI suggestion POSTs to /api/gemini-suggest
   - Saves/loads from localStorage
*/

document.addEventListener('DOMContentLoaded', () => {
  // Basic DOM refs
  const resumePage = document.getElementById('resume-page-preview');
  const resumeBody = document.getElementById('resume-body');

  const nameInput = document.getElementById('full-name-input');
  const titleInput = document.getElementById('title-input');
  const locationInput = document.getElementById('location-input');
  const emailInput = document.getElementById('email-input');
  const summaryInput = document.getElementById('ai-input');

  const namePreview = document.getElementById('name-preview');
  const titlePreview = document.getElementById('title-preview');
  const locationPreview = document.getElementById('location-preview-contact');
  const emailPreview = document.getElementById('email-preview-contact');
  const summaryPreview = document.getElementById('summary-preview');

  const aiOutput = document.getElementById('ai-output');
  const aiTargetSelect = document.getElementById('ai-target');
  const sectionList = document.getElementById('section-list');

  // ---------------------- Helper: sanitize (basic) --------------------
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // ---------------------- Preview update --------------------
  function updatePreview() {
    namePreview.textContent = nameInput.value || 'Jane Doe';
    titlePreview.textContent = titleInput.value || 'Front-end Engineer';
    locationPreview.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${escapeHtml(locationInput.value) || 'City, Country'}`;
    emailPreview.innerHTML = `<i class="fas fa-envelope"></i> ${escapeHtml(emailInput.value) || 'you@example.com'}`;
    summaryPreview.textContent = summaryInput.value || 'A concise professional summary goes here.';
  }

  [nameInput, titleInput, locationInput, emailInput, summaryInput].forEach(el =>
    el.addEventListener('input', updatePreview)
  );

  // Reflect edits in preview back to inputs
  namePreview.addEventListener('input', () => { nameInput.value = namePreview.textContent.trim(); });
  titlePreview.addEventListener('input', () => { titleInput.value = titlePreview.textContent.trim(); });
  summaryPreview.addEventListener('input', () => { summaryInput.value = summaryPreview.textContent.trim(); });

  // ---------------------- Template & font size --------------------
  const templateButtons = document.querySelectorAll('.style-tag');
  let currentFontSize = 15;
  const fontSizeSpan = document.getElementById('current-font-size');

  function setFontSize(sz) {
    currentFontSize = sz;
    resumePage.style.fontSize = currentFontSize + 'px';
    fontSizeSpan.textContent = currentFontSize + 'px';
  }

  document.getElementById('font-increase-btn').addEventListener('click', () =>
    setFontSize(Math.min(24, currentFontSize + 1))
  );
  document.getElementById('font-decrease-btn').addEventListener('click', () =>
    setFontSize(Math.max(12, currentFontSize - 1))
  );

  templateButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      templateButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const t = this.dataset.template;
      resumePage.classList.remove('clean-template', 'modern-template', 'compact-template');
      resumePage.classList.add(`${t}-template`);
    });
  });

  // ---------------------- Save / Load --------------------
  function saveAll() {
    const data = {
      profile: {
        name: nameInput.value,
        title: titleInput.value,
        location: locationInput.value,
        email: emailInput.value,
        summary: summaryInput.value
      },
      html: resumePage.innerHTML,
      fontSize: currentFontSize
    };
    localStorage.setItem('lc_resume', JSON.stringify(data));
    alert('Saved to localStorage');
  }

  document.getElementById('save-btn').addEventListener('click', saveAll);

  function loadAll() {
    try {
      const saved = JSON.parse(localStorage.getItem('lc_resume') || 'null');
      if (saved) {
        nameInput.value = saved.profile.name || '';
        titleInput.value = saved.profile.title || '';
        locationInput.value = saved.profile.location || '';
        emailInput.value = saved.profile.email || '';
        summaryInput.value = saved.profile.summary || '';
        setFontSize(saved.fontSize || currentFontSize);
        updatePreview();
      }
    } catch (e) {
      console.warn('Load failed', e);
    }
  }

  loadAll();

  // ---------------------- Add / toggle sections --------------------
  function createSectionNode(slug, titleText) {
    const sec = document.createElement('section');
    sec.classList.add('generic-section', 'editable-section', 'active');
    sec.setAttribute('data-section', slug);
    sec.innerHTML = `
      <h2 contenteditable="true">${escapeHtml(titleText)}</h2>
      <p contenteditable="true">Add content for ${escapeHtml(titleText)} here...</p>
    `;
    return sec;
  }

  function handleSectionToggleClick(e) {
    const el = e.currentTarget;
    const slug = el.dataset.section;
    el.classList.toggle('active');
    const icon = el.querySelector('i');
    const target = resumePage.querySelector(`section[data-section="${slug}"]`);
    if (el.classList.contains('active')) {
      icon.classList.remove('fa-circle');
      icon.classList.add('fa-check-circle');
      if (target) target.classList.remove('hidden');
    } else {
      icon.classList.remove('fa-check-circle');
      icon.classList.add('fa-circle');
      if (target) target.classList.add('hidden');
    }
  }

  function attachToggleListeners() {
    sectionList.querySelectorAll('.section-toggle').forEach(p => {
      p.removeEventListener('click', handleSectionToggleClick);
      p.addEventListener('click', handleSectionToggleClick);
    });
  }

  attachToggleListeners();

  document.getElementById('add-section-btn').addEventListener('click', () => {
    const name = prompt('Enter new section name (e.g., Awards, Languages):');
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^\w]+/g, '-');

    const p = document.createElement('p');
    p.className = 'section-toggle active';
    p.setAttribute('data-section', slug);
    p.innerHTML = `<i class="fas fa-check-circle"></i> ${escapeHtml(name)}`;
    sectionList.appendChild(p);
    p.addEventListener('click', handleSectionToggleClick);

    const sec = createSectionNode(slug, name);
    resumeBody.appendChild(sec);

    updateAiTargetOptions();
  });

  // ---------------------- Build AI target options --------------------
  function updateAiTargetOptions() {
    const select = aiTargetSelect;
    const existing = Array.from(resumePage.querySelectorAll('section')).map(s => s.dataset.section);
    const current = select.value;
    select.innerHTML = '';
    select.appendChild(new Option('Summary', 'summary'));
    select.appendChild(new Option('Selected Section (click a section to mark it)', 'selected'));
    existing.forEach(slug => {
      const label = slug.replace(/-/g, ' ');
      select.appendChild(new Option(label.charAt(0).toUpperCase() + label.slice(1), slug));
    });
    if ([...select.options].some(o => o.value === current)) select.value = current;
  }

  updateAiTargetOptions();

  // ---------------------- Section selection --------------------
  let selectedSectionSlug = null;
  function clearSectionSelection() {
    resumePage.querySelectorAll('.editable-section').forEach(s => s.classList.remove('selected-section'));
    selectedSectionSlug = null;
  }

  resumePage.addEventListener('click', (ev) => {
    const sec = ev.target.closest('.editable-section');
    if (!sec) return;
    clearSectionSelection();
    sec.classList.add('selected-section');
    selectedSectionSlug = sec.dataset.section;
    aiTargetSelect.value = 'selected';
  });

  // ---------------------- AI Suggestion --------------------
  document.getElementById('generate-suggestion-btn').addEventListener('click', async () => {
    const payloadText = summaryInput.value.trim();
    if (!payloadText) {
      alert('Please type some text to improve in the AI input box.');
      return;
    }

    aiOutput.textContent = 'Generating…';

    try {
      const res = await fetch('/api/gemini-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: payloadText })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || `Status ${res.status}`);
      }

      const data = await res.json();
      const suggestion = data.suggestion || data.text || 'No suggestion returned';
      aiOutput.textContent = suggestion;

      const target = aiTargetSelect.value;

      if (target === 'summary') {
        summaryInput.value = suggestion;
        summaryPreview.textContent = suggestion;
      } else if (target === 'selected') {
        if (!selectedSectionSlug) {
          alert('No section selected in preview. Click a section to select it or choose a specific section.');
          return;
        }
        const sec = resumePage.querySelector(`section[data-section="${selectedSectionSlug}"]`);
        if (sec) {
          const p = sec.querySelector('p');
          if (p) p.textContent = suggestion;
          else {
            const np = document.createElement('p');
            np.textContent = suggestion;
            sec.appendChild(np);
          }
        }
      } else {
        const sec = resumePage.querySelector(`section[data-section="${target}"]`);
        if (sec) {
          const p = sec.querySelector('p');
          if (p) p.textContent = suggestion;
          else sec.appendChild(Object.assign(document.createElement('p'), { textContent: suggestion }));
        } else {
          alert('Target section not found in preview.');
        }
      }
    } catch (err) {
      console.error('AI error', err);
      aiOutput.textContent = 'AI error: ' + err.message;
    }
  });

  // ---------------------- Export (print/pdf) --------------------
  document.getElementById('export-pdf-btn').addEventListener('click', () => {
    if (window.html2pdf) {
      const opt = {
        margin: 0.5,
        filename: `${(nameInput.value || 'resume').replace(/\s+/g, '_')}.pdf`,
        html2canvas: { scale: 1.2 },
        jsPDF: { unit: 'in', format: 'letter' }
      };
      html2pdf().set(opt).from(resumePage).save();
    } else {
      window.print();
    }
  });

  // ---------------------- Init --------------------
  setFontSize(15);
  updatePreview();
  updateAiTargetOptions();
});
