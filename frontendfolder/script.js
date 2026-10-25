/**
 * cyperX - SYMPOSIUM WEBSITE JAVASCRIPT INTERACTIONS
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE RESPONSIVE NAVIGATION MENU TOGGLE
  // ==========================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show');
      const icon = menuToggleBtn.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('show') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    document.addEventListener('click', () => {
      if (navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        const icon = menuToggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // ==========================================
  // 2. INTERACTIVE EVENT FILTER (events.html)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card-item');

  if (filterButtons.length > 0 && eventCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        eventCards.forEach(card => {
          const cardType = card.getAttribute('data-type');
          if (filterValue === 'all' || cardType === filterValue) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // 3. REGISTRATION FORM CONTROLS (register.html)
  // ==========================================
  const registerForm = document.getElementById('cyperX-register-form');
  const departmentSelect = document.getElementById('department');
  const otherDeptInput = document.getElementById('otherdept');
  const regDateInput = document.getElementById('regdate');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Department -> Events mapping
  const deptEvents = {
    civil: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'techhunt', label: 'Tech Hunt' },
      { value: 'bridgeit', label: 'Bridge-It' },
      { value: 'connections', label: 'Connections' }
    ],
    cse: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'code', label: 'Code Debugging' },
      { value: 'designchallenge', label: 'Design Challenge' },
      { value: 'photography', label: 'Photography' }
    ],
    ece: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'circuit', label: 'Circuit Debugging' },
      { value: 'roborace', label: 'Robo Race' },
      { value: 'squidgame', label: 'Squid Game (cyperX Special)' }
    ],
    eee: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'circuit', label: 'Circuit Debugging' },
      { value: 'linefollower', label: 'Line Follower' },
      { value: 'connections', label: 'Connections' }
    ],
    mech: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'mrmechanical', label: 'Mr. Mechanical (CAD/CAM)' },
      { value: 'waterrocketry', label: 'Water Rocketry' },
      { value: 'experts', label: 'Experts' }
    ],
    it: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'techquest', label: 'Tech Quest' },
      { value: 'bugsmash', label: 'BugSmash' },
      { value: 'shortfilm', label: 'Short Film' }
    ],
    aids: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'workshop', label: 'Workshop' },
      { value: 'reversecoding', label: 'Reverse Coding' },
      { value: 'aimusic', label: 'AI Music & Prompting' }
    ],
    other: [
      { value: 'paper', label: 'Paper Presentation' },
      { value: 'code', label: 'Code Debugging' },
      { value: 'circuit', label: 'Circuit Debugging' },
      { value: 'roborace', label: 'Robo Race' },
      { value: 'linefollower', label: 'Line Follower' },
      { value: 'techhunt', label: 'Tech Hunt' },
      { value: 'techquest', label: 'Tech Quest' },
      { value: 'bridgeit', label: 'Bridge-It' },
      { value: 'connections', label: 'Connections' },
      { value: 'designchallenge', label: 'Design Challenge' },
      { value: 'photography', label: 'Photography' },
      { value: 'squidgame', label: 'Squid Game (cyperX Special)' },
      { value: 'mrmechanical', label: 'Mr. Mechanical (CAD/CAM)' },
      { value: 'waterrocketry', label: 'Water Rocketry' },
      { value: 'experts', label: 'Experts' },
      { value: 'bugsmash', label: 'BugSmash' },
      { value: 'shortfilm', label: 'Short Film' },
      { value: 'workshop', label: 'Workshop' },
      { value: 'reversecoding', label: 'Reverse Coding' },
      { value: 'aimusic', label: 'AI Music & Prompting' }
    ]
  };

  const checkboxGroup = document.querySelector('.checkbox-group');

  function updateEvents() {
    if (!checkboxGroup || !departmentSelect) return;
    const dept = departmentSelect.value;
    if (!dept) {
      checkboxGroup.innerHTML = '<p class="info-text" style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">Please select a department first to view its events.</p>';
      return;
    }
    const events = deptEvents[dept] || [];
    if (events.length === 0) {
      checkboxGroup.innerHTML = '<p class="info-text" style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">No events available for this department.</p>';
      return;
    }
    checkboxGroup.innerHTML = events.map(ev => `
      <label class="checkbox-label">
        <input type="checkbox" name="event-tracks" value="${ev.value}"> ${ev.label}
      </label>
    `).join('');
  }

  if (departmentSelect && otherDeptInput) {
    departmentSelect.addEventListener('change', () => {
      updateEvents();
      if (departmentSelect.value === 'other') {
        otherDeptInput.disabled = false;
        otherDeptInput.required = true;
        otherDeptInput.focus();
      } else {
        otherDeptInput.disabled = true;
        otherDeptInput.required = false;
        otherDeptInput.value = '';
        otherDeptInput.classList.remove('input-invalid');
        const errSpan = document.getElementById('otherdept-error');
        if (errSpan) errSpan.style.display = 'none';
      }
    });
    updateEvents();
  }

  if (regDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    regDateInput.value = yyyy + '-' + mm + '-' + dd;
  }

  // Form Validation Logic
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('[cyperX] Form submit triggered.');

      let isFormValid = true;

      const fullname = document.getElementById('fullname');
      const fullnameError = document.getElementById('fullname-error');
      if (fullname && fullnameError) {
        const nameRegex = /^[A-Za-z\s]{3,40}$/;
        if (!nameRegex.test(fullname.value.trim())) {
          fullname.classList.add('input-invalid');
          fullnameError.style.display = 'block';
          isFormValid = false;
        } else {
          fullname.classList.remove('input-invalid');
          fullnameError.style.display = 'none';
        }
      }

      const email = document.getElementById('email');
      const emailError = document.getElementById('email-error');
      if (email && emailError) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          email.classList.add('input-invalid');
          emailError.style.display = 'block';
          isFormValid = false;
        } else {
          email.classList.remove('input-invalid');
          emailError.style.display = 'none';
        }
      }

      const phone = document.getElementById('phone');
      const phoneError = document.getElementById('phone-error');
      if (phone && phoneError) {
        const phoneRegex = /^[6-9][0-9]{9}$/;
        if (!phoneRegex.test(phone.value.trim())) {
          phone.classList.add('input-invalid');
          phoneError.style.display = 'block';
          isFormValid = false;
        } else {
          phone.classList.remove('input-invalid');
          phoneError.style.display = 'none';
        }
      }

      const year = document.getElementById('yearofstudy');
      const yearError = document.getElementById('yearofstudy-error');
      if (year && yearError) {
        if (!year.value) {
          year.classList.add('input-invalid');
          yearError.style.display = 'block';
          isFormValid = false;
        } else {
          year.classList.remove('input-invalid');
          yearError.style.display = 'none';
        }
      }

      const collegeInput = document.getElementById('college');
      const collegeError = document.getElementById('college-error');
      if (collegeInput && collegeError) {
        if (collegeInput.value.trim() === '') {
          collegeInput.classList.add('input-invalid');
          collegeError.style.display = 'block';
          isFormValid = false;
        } else {
          collegeInput.classList.remove('input-invalid');
          collegeError.style.display = 'none';
        }
      }

      const deptError = document.getElementById('department-error');
      if (departmentSelect && deptError) {
        if (departmentSelect.value === '') {
          departmentSelect.classList.add('input-invalid');
          deptError.style.display = 'block';
          isFormValid = false;
        } else {
          departmentSelect.classList.remove('input-invalid');
          deptError.style.display = 'none';
        }
      }

      const genderRadio = document.querySelector('input[name="gender"]:checked');
      const genderError = document.getElementById('gender-error');
      const genderInputs = document.querySelectorAll('input[name="gender"]');
      if (genderInputs.length > 0 && genderError) {
        if (!genderRadio) {
          genderError.style.display = 'block';
          isFormValid = false;
        } else {
          genderError.style.display = 'none';
        }
      }

      if (departmentSelect && departmentSelect.value === 'other' && otherDeptInput) {
        const otherError = document.getElementById('otherdept-error');
        if (otherDeptInput.value.trim() === '') {
          otherDeptInput.classList.add('input-invalid');
          if (otherError) otherError.style.display = 'block';
          isFormValid = false;
        } else {
          otherDeptInput.classList.remove('input-invalid');
          if (otherError) otherError.style.display = 'none';
        }
      }

      const eventCheckboxes = document.querySelectorAll('input[name="event-tracks"]');
      const tracksError = document.getElementById('tracks-error');
      if (eventCheckboxes.length > 0 && tracksError) {
        let oneChecked = false;
        eventCheckboxes.forEach(cb => { if (cb.checked) oneChecked = true; });
        if (!oneChecked) {
          tracksError.style.display = 'block';
          isFormValid = false;
        } else {
          tracksError.style.display = 'none';
        }
      }

      const fileInput = document.getElementById('paperabstract');
      const fileError = document.getElementById('paperabstract-error');
      if (fileInput && fileError) {
        if (fileInput.files.length === 0) {
          fileInput.classList.add('input-invalid');
          fileError.style.display = 'block';
          isFormValid = false;
        } else {
          const file = fileInput.files[0];
          const extension = file.name.split('.').pop().toLowerCase();
          const allowedExtensions = ['pdf', 'doc', 'docx'];
          if (file.size > 2097152 || !allowedExtensions.includes(extension)) {
            fileInput.classList.add('input-invalid');
            fileError.textContent = 'File must be a PDF or Word doc, and under 2MB.';
            fileError.style.display = 'block';
            isFormValid = false;
          } else {
            fileInput.classList.remove('input-invalid');
            fileError.style.display = 'none';
          }
        }
      }

      const socialUrl = document.getElementById('socialprofile');
      const urlError = document.getElementById('socialprofile-error');
      if (socialUrl && urlError && socialUrl.value.trim() !== '') {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlRegex.test(socialUrl.value.trim())) {
          socialUrl.classList.add('input-invalid');
          urlError.style.display = 'block';
          isFormValid = false;
        } else {
          socialUrl.classList.remove('input-invalid');
          urlError.style.display = 'none';
        }
      }

      const termsCheckbox = document.getElementById('terms');
      const termsError = document.getElementById('terms-error');
      if (termsCheckbox && termsError) {
        if (!termsCheckbox.checked) {
          termsError.style.display = 'block';
          isFormValid = false;
        } else {
          termsError.style.display = 'none';
        }
      }

      const regFeeValEl   = document.getElementById('regfee');
      const regFeeErrEl   = document.getElementById('regfee-error');
      const regFeeBtn     = document.getElementById('regfee-display');
      if (regFeeValEl && regFeeErrEl) {
        if (!regFeeValEl.value) {
          regFeeErrEl.style.display = 'block';
          if (regFeeBtn) regFeeBtn.classList.add('input-invalid');
          isFormValid = false;
        } else {
          regFeeErrEl.style.display = 'none';
          if (regFeeBtn) regFeeBtn.classList.remove('input-invalid');
        }
      }

      // Submit if valid
      if (isFormValid) {
        const submitBtn = registerForm.querySelector('input[type="submit"]');
        const originalBtnValue = submitBtn ? submitBtn.value : 'Submit Registration';
        if (submitBtn) { submitBtn.disabled = true; submitBtn.value = 'Registering...'; }

        const formData = new FormData(registerForm);

        fetch('/api/register', { method: 'POST', body: formData })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errData => { throw new Error(errData.error || 'Server error occurred.'); });
          }
          return response.json();
        })
        .then(data => {
          if (data.success && successModal) {
            const nameVal  = document.getElementById('fullname')?.value.trim() || '—';
            const emailVal = document.getElementById('email')?.value.trim() || '—';
            const phoneVal = document.getElementById('phone')?.value.trim() || '—';
            const yearVal  = document.getElementById('yearofstudy')?.value || '—';
            const dateVal  = document.getElementById('regdate')?.value || '—';
            const payVal   = document.getElementById('regfee')?.value || '';
            const accommodationEl  = document.getElementById('accommodation');
            const accommodationVal = (accommodationEl && accommodationEl.checked) ? '🏠 Yes — Hostel Accommodation' : '❌ No Accommodation';

            const genderRadio = document.querySelector('input[name="gender"]:checked');
            const genderMap   = { male: 'Male', female: 'Female', other: 'Other' };
            const genderVal   = genderRadio ? (genderMap[genderRadio.value] || genderRadio.value) : '—';

            const deptSel  = document.getElementById('department');
            const deptMap  = {
              civil: 'Civil Engineering', cse: 'Computer Science & Engineering',
              ece: 'Electronics & Communication', eee: 'Electrical & Electronics',
              mech: 'Mechanical Engineering', it: 'Information Technology',
              aids: 'AI & Data Science', other: document.getElementById('otherdept')?.value.trim() || 'Other'
            };
            const deptVal  = deptSel ? (deptMap[deptSel.value] || deptSel.value) : '—';

            const collegeInput = document.getElementById('college');
            const collegeVal = collegeInput ? collegeInput.value.trim() || '—' : '—';

            const eventMap = {
              paper: 'Paper Presentation', code: 'Code Debugging', circuit: 'Circuit Debugging',
              roborace: 'Robo Race', linefollower: 'Line Follower', techhunt: 'Tech Hunt',
              techquest: 'Tech Quest', bridgeit: 'Bridge-It', connections: 'Connections',
              designchallenge: 'Design Challenge', photography: 'Photography',
              squidgame: 'Squid Game (cyperX Special)', mrmechanical: 'Mr. Mechanical (CAD/CAM)',
              waterrocketry: 'Water Rocketry', experts: 'Experts', bugsmash: 'BugSmash',
              shortfilm: 'Short Film', workshop: 'Workshop', reversecoding: 'Reverse Coding',
              aimusic: 'AI Music & Prompting'
            };
            const checkedEvents = [...document.querySelectorAll('input[name="event-tracks"]:checked')]
              .map(cb => eventMap[cb.value] || cb.value);

            let dateDisplay = dateVal;
            if (dateVal) {
              const d = new Date(dateVal + 'T00:00:00');
              if (!isNaN(d)) dateDisplay = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            const regId = data.regId;
            const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setText('sd-name',          nameVal);
            setText('sd-email',         emailVal);
            setText('sd-phone',         phoneVal);
            setText('sd-gender',        genderVal);
            setText('sd-college',       collegeVal);
            setText('sd-dept',          deptVal);
            setText('sd-year',          `Year ${yearVal}`);
            setText('sd-date',          dateDisplay);
            setText('sd-accommodation', accommodationVal);

            const payEl = document.getElementById('sd-payment');
            const amountPaidItem = document.getElementById('sd-amount-paid-item');
            const paymentStatus = document.getElementById('sd-payment-status');
            const isCashPayment = payVal === 'cash';
            if (amountPaidItem) amountPaidItem.hidden = isCashPayment;
            if (paymentStatus) {
              paymentStatus.textContent = isCashPayment ? '⏳ Pending — Pay at desk' : '✅ Confirmed';
              paymentStatus.style.color = isCashPayment ? 'var(--color-gold)' : '#34d399';
            }
            if (payEl) {
              if (payVal === 'cash') {
                payEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.4);color:#34d399;padding:4px 14px;border-radius:50px;font-weight:600;font-size:0.88rem;">💵 Cash Payment <span style="font-size:0.75rem;opacity:0.8;">(Pay at desk)</span></span>`;
              } else if (payVal === 'online') {
                payEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(18,181,203,0.12);border:1px solid rgba(18,181,203,0.4);color:var(--color-cyan);padding:4px 14px;border-radius:50px;font-weight:600;font-size:0.88rem;">📱 Online Payment <span style="font-size:0.75rem;opacity:0.8;">(UPI / QR)</span></span>`;
              } else {
                payEl.textContent = '—';
              }
            }

            const regBadge = document.getElementById('reg-id-badge');
            if (regBadge) regBadge.textContent = regId;
            const regInline = document.getElementById('reg-id-inline');
            if (regInline) regInline.textContent = regId;

            const eventsContainer = document.getElementById('sd-events');
            if (eventsContainer) {
              eventsContainer.innerHTML = checkedEvents.length
                ? checkedEvents.map(ev =>
                    `<span style="background:rgba(18,181,203,0.12);border:1px solid rgba(18,181,203,0.3);color:var(--color-cyan);padding:5px 14px;border-radius:50px;font-size:0.82rem;font-weight:500;">${ev}</span>`
                  ).join('')
                : '<span style="color:var(--text-muted);">—</span>';
            }

            successModal.style.display = 'flex';
            registerForm.reset();
            updateEvents();
            if (regDateInput) {
              const today = new Date();
              const yyyy = today.getFullYear();
              let mm = today.getMonth() + 1;
              let dd = today.getDate();
              if (dd < 10) dd = '0' + dd;
              if (mm < 10) mm = '0' + mm;
              regDateInput.value = yyyy + '-' + mm + '-' + dd;
            }
            const feeText = document.getElementById('regfee-text');
            const feeIcon = document.getElementById('regfee-icon');
            if (feeText) feeText.textContent = 'Rs. 150/- — Click to Choose Payment Method';
            if (feeIcon) feeIcon.innerHTML = '<i class="fa-solid fa-coins"></i>';
            const feeTrigger = document.getElementById('regfee-display');
            if (feeTrigger) feeTrigger.classList.remove('selected', 'input-invalid');
          } else {
            alert('Registration failed: ' + (data.error || 'Unknown error'));
          }
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred during registration: ' + err.message);
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.value = originalBtnValue; }
        });
      }
    });
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => { successModal.style.display = 'none'; });
  }

  const modalPrintBtn = document.getElementById('modal-print-btn');
  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', async () => {
      const card = document.getElementById('success-modal-card');
      if (!card) return;

      // Show loading state
      modalPrintBtn.disabled = true;
      modalPrintBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating…';

      try {
        const canvas = await html2canvas(card, {
          scale: 2,
          backgroundColor: '#011827',
          useCORS: true,
          allowTaint: true,
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;

        // Fit card width to A4
        const pageW = 595.28; // A4 pt width
        const ratio  = pageW / canvas.width;
        const pageH  = canvas.height * ratio;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [pageW, pageH]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);

        const regId = document.getElementById('reg-id-badge')?.textContent?.trim() || 'registration';
        pdf.save(`cyperX_${regId}.pdf`);
      } catch (err) {
        console.error('[cyperX] PDF generation error:', err);
        alert('Could not generate PDF. Please try again.');
      } finally {
        modalPrintBtn.disabled = false;
        modalPrintBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save PDF';
      }
    });
  }

  // ==========================================
  // 3b. PAYMENT METHOD MODAL (register.html)
  // ==========================================

  // ── All variables declared first (prevent Temporal Dead Zone) ──
  const regFeeDisplay     = document.getElementById('regfee-display');
  const regFeeInput       = document.getElementById('regfee');
  const regFeeError       = document.getElementById('regfee-error');
  const paymentModal      = document.getElementById('payment-modal');
  const payModalClose     = document.getElementById('payment-modal-close');
  const fkAccUpi          = document.getElementById('fk-acc-upi');
  const fkAccCash         = document.getElementById('fk-acc-cash');
  const fkRadios          = document.querySelectorAll('input[name="payment-method-fk"]');
  const fkUpiAppBtns      = document.querySelectorAll('.fk-upi-app-btn');
  const fkUpiVerifyMsg    = document.getElementById('fk-upi-verify-msg');
  const fkUpiPayBtn       = document.getElementById('fk-upi-pay-btn');
  const fkUpiDynamicQr    = document.getElementById('fk-upi-dynamic-qr');
  const fkCaptchaVal      = document.getElementById('fk-captcha-val');
  const fkCaptchaRefreshBtn = document.getElementById('fk-captcha-refresh-btn');
  const fkCaptchaInput    = document.getElementById('fk-captcha-input');
  const fkCaptchaErrorMsg = document.getElementById('fk-captcha-error-msg');
  const fkCashConfirmBtn  = document.getElementById('fk-cash-confirm-btn');
  const fkSuccessOverlay  = document.getElementById('fk-success-overlay');
  const fkUtrSection      = document.getElementById('fk-utr-section');
  const fkUtrVerifyBtn    = document.getElementById('fk-utr-verify-btn');

  let selectedUpiAppKey = null;
  let captchaCode       = '';
  const UPI_PA          = '9751513576@superyes';

  // ── Generate captcha ──
  const generateCaptcha = () => {
    captchaCode = Math.floor(100 + Math.random() * 900).toString();
    if (fkCaptchaVal) fkCaptchaVal.textContent = captchaCode;
    if (fkCaptchaInput) fkCaptchaInput.value = '';
  };

  // ── Close modal ──
  const closePaymentModal = () => {
    if (paymentModal) paymentModal.style.display = 'none';
  };

  // ── After payment chosen → update form & close ──
  const triggerSuccessFlow = (chosenValue) => {
    console.log('[cyperX] Payment method selected:', chosenValue);

    const isCashPayment = chosenValue === 'cash';

    // ── Helper: finalise the form after payment selection ──
    const finalise = () => {
      const label = chosenValue === 'cash'
        ? 'Rs. 150/- \u2014 Cash Payment (at desk)'
        : 'Rs. 150/- \u2014 Online Payment (UPI)';

      const textSpan = document.getElementById('regfee-text');
      const iconSpan = document.getElementById('regfee-icon');
      if (textSpan) textSpan.textContent = label;
      if (iconSpan) iconSpan.innerHTML = chosenValue === 'cash'
        ? '<i class="fa-solid fa-money-bill-wave" style="color:#34d399;"></i>'
        : '<i class="fa-solid fa-qrcode" style="color:var(--color-cyan);"></i>';

      if (regFeeInput) regFeeInput.value = chosenValue;
      const pmInput = document.getElementById('payment-method');
      if (pmInput) pmInput.value = chosenValue;
      if (regFeeDisplay) {
        regFeeDisplay.classList.add('selected');
        regFeeDisplay.classList.remove('input-invalid');
      }
      if (regFeeError) regFeeError.style.display = 'none';

      if (fkSuccessOverlay) fkSuccessOverlay.style.display = 'none';
      closePaymentModal();

      if (registerForm) {
        setTimeout(() => {
          registerForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }, 400);
      }
    };

    if (isCashPayment) {
      // Cash: show a quick confirmation overlay, then finalise
      const successTitle   = document.getElementById('fk-success-title');
      const successMessage = document.getElementById('fk-success-message');
      const paymentStep    = document.getElementById('fk-success-payment-step');
      const passStep       = document.getElementById('fk-success-pass-step');
      if (successTitle)   successTitle.textContent   = 'Registration Received!';
      if (successMessage) successMessage.textContent  = 'Cash payment of ₹150.00 is due at the venue desk.';
      if (paymentStep)    paymentStep.textContent     = 'Cash Payment Due';
      if (passStep)       passStep.textContent        = 'Pass Activated After Payment';

      if (fkSuccessOverlay) fkSuccessOverlay.style.display = 'flex';
      setTimeout(finalise, 2200);
    } else {
      // Online: no overlay — go straight to form submission
      finalise();
    }
  };

  const confirmUpiPayment = () => {
    if (fkUtrVerifyBtn) {
      fkUtrVerifyBtn.disabled = true;
      fkUtrVerifyBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Processing…';
    }

    if (fkUpiVerifyMsg) {
      fkUpiVerifyMsg.innerHTML = '✅ Amount Paid Successfully';
      fkUpiVerifyMsg.className = 'fk-verify-message success';
    }

    setTimeout(() => {
      if (fkUtrVerifyBtn) {
        fkUtrVerifyBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp; Amount Paid Successfully';
        fkUtrVerifyBtn.style.background = 'linear-gradient(135deg,#34d399,#059669)';
      }
      triggerSuccessFlow('online');
    }, 1000);
  };

  const startRazorpayCheckout = async () => {
    const paymentButton = fkUtrVerifyBtn;
    if (paymentButton) {
      paymentButton.disabled = true;
      paymentButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Connecting Razorpay…';
    }

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 15000,
          currency: 'INR',
          receipt: `cyperx-${Date.now()}`
        })
      });

      const data = await response.json();
      if (!data.success || !data.order_id || !data.key_id) {
        throw new Error(data.error || 'Unable to create Razorpay order.');
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'cyperX Symposium',
        description: 'Registration Fee',
        order_id: data.order_id,
        handler: async function (paymentResponse) {
          if (fkUpiVerifyMsg) {
            fkUpiVerifyMsg.innerHTML = '🔒 Verifying payment with Razorpay...';
            fkUpiVerifyMsg.className = 'fk-verify-message';
          }

          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: paymentResponse.razorpay_order_id,
              payment_id: paymentResponse.razorpay_payment_id,
              signature: paymentResponse.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.success) {
            throw new Error(verifyData.error || 'Payment verification failed.');
          }

          if (fkUpiVerifyMsg) {
            fkUpiVerifyMsg.innerHTML = '✅ Amount Paid Successfully';
            fkUpiVerifyMsg.className = 'fk-verify-message success';
          }

          if (paymentButton) {
            paymentButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp; Amount Paid Successfully';
            paymentButton.style.background = 'linear-gradient(135deg,#34d399,#059669)';
          }

          triggerSuccessFlow('online');
        },
        prefill: {
          name: document.getElementById('fullname')?.value || '',
          email: document.getElementById('email')?.value || '',
          contact: document.getElementById('phone')?.value || ''
        },
        theme: { color: '#12b5cb' },
        modal: {
          ondismiss: function () {
            if (fkUpiVerifyMsg) {
              fkUpiVerifyMsg.innerHTML = '⚠️ Payment was cancelled. Please complete the payment to continue.';
              fkUpiVerifyMsg.className = 'fk-verify-message';
            }
            if (paymentButton) {
              paymentButton.disabled = false;
              paymentButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp; I\'ve Paid — Complete Registration';
              paymentButton.style.background = '';
            }
          }
        }
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.on('payment.failed', function (response) {
        if (fkUpiVerifyMsg) {
          fkUpiVerifyMsg.innerHTML = `❌ Payment failed: ${response.error.description}`;
          fkUpiVerifyMsg.className = 'fk-verify-message';
        }
        if (paymentButton) {
          paymentButton.disabled = false;
          paymentButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp; I\'ve Paid — Complete Registration';
          paymentButton.style.background = '';
        }
      });

      razorpayCheckout.open();
    } catch (error) {
      console.error('Razorpay checkout failed:', error);
      if (fkUpiVerifyMsg) {
        fkUpiVerifyMsg.innerHTML = '⚠️ Razorpay checkout unavailable. Using demo payment flow instead.';
        fkUpiVerifyMsg.className = 'fk-verify-message';
      }
      if (paymentButton) {
        paymentButton.disabled = false;
        paymentButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp; I\'ve Paid — Complete Registration';
        paymentButton.style.background = '';
      }
      confirmUpiPayment();
    }
  };

  // ── Switch accordion panels (UPI / Cash) ──
  const switchPanel = (method) => {
    [fkAccUpi, fkAccCash].forEach(el => {
      if (!el) return;
      el.classList.remove('active');
      const body = el.querySelector('.fk-accordion-content');
      if (body) body.style.display = 'none';
    });

    // Reset UPI state
    if (fkUpiVerifyMsg) {
      fkUpiVerifyMsg.textContent = '';
      fkUpiVerifyMsg.className = 'fk-verify-message';
    }
    if (fkUpiDynamicQr) fkUpiDynamicQr.style.display = 'none';
    if (fkUpiPayBtn) {
      fkUpiPayBtn.disabled = true;
      fkUpiPayBtn.textContent = 'PAY \u20b9150';
    }
    fkUpiAppBtns.forEach(b => b.classList.remove('selected'));
    selectedUpiAppKey = null;
    if (fkCaptchaErrorMsg) fkCaptchaErrorMsg.style.display = 'none';
    // Reset confirm section
    if (fkUtrSection)   fkUtrSection.style.display = 'none';
    if (fkUtrVerifyBtn) {
      fkUtrVerifyBtn.disabled = false;
      fkUtrVerifyBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp; I\'ve Paid — Complete Registration';
      fkUtrVerifyBtn.style.background = '';
    }

    // Show selected panel
    const target = method === 'cash' ? fkAccCash : fkAccUpi;
    if (target) {
      target.classList.add('active');
      const body = target.querySelector('.fk-accordion-content');
      if (body) body.style.display = 'block';
    }
  };

  // ── Radio change (Online / Cash) ──
  fkRadios.forEach(radio => {
    radio.addEventListener('change', e => {
      switchPanel(e.target.id === 'fk-pay-cash' ? 'cash' : 'online');
    });
  });

  // ── Accordion header click selects radio ──
  [fkAccUpi, fkAccCash].forEach(item => {
    if (!item) return;
    const header = item.querySelector('.fk-accordion-header');
    if (!header) return;
    header.addEventListener('click', e => {
      if (e.target.type === 'radio') return;
      const r = header.querySelector('input[type="radio"]');
      if (r) { r.checked = true; r.dispatchEvent(new Event('change')); }
    });
  });
  fkUpiAppBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Highlight selected app
      fkUpiAppBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedUpiAppKey = btn.getAttribute('data-app');

      const names = { gpay: 'Google Pay', phonepe: 'PhonePe', paytm: 'Paytm' };
      const appName = names[selectedUpiAppKey] || selectedUpiAppKey;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      // Show QR code
      if (fkUpiDynamicQr) fkUpiDynamicQr.style.display = 'block';

      // Show confirm section
      if (fkUtrSection) fkUtrSection.style.display = 'block';

      // On mobile: show deep-link PAY button
      if (fkUpiPayBtn) {
        if (isMobile) {
          fkUpiPayBtn.disabled = false;
          fkUpiPayBtn.textContent = `PAY ₹150 VIA ${appName.toUpperCase()}`;
          fkUpiPayBtn.style.cssText = '';
        } else {
          // Desktop: hide PAY button — user scans QR directly
          fkUpiPayBtn.style.display = 'none';
        }
      }

      // Instruction message
      if (fkUpiVerifyMsg) {
        fkUpiVerifyMsg.className = 'fk-verify-message success';
        fkUpiVerifyMsg.innerHTML = isMobile
          ? `📲 Tap <strong>PAY</strong> to open <strong>${appName}</strong>. After payment, tap <strong>I've Paid</strong> below.`
          : `📸 Scan the QR with <strong>${appName}</strong> &rarr; Pay &rarr; Tap <strong>I've Paid</strong> below.`;
      }

      console.log('[cyperX] UPI app selected:', selectedUpiAppKey);
    });
  });

  // ── Mobile PAY button: open UPI deep link ──
  if (fkUpiPayBtn) {
    fkUpiPayBtn.addEventListener('click', () => {
      if (fkUpiPayBtn.disabled) return;
      const appKey = selectedUpiAppKey || 'gpay';
      const pn = encodeURIComponent('cyperX');
      const deepLinks = {
        gpay:    `tez://upi/pay?pa=${UPI_PA}&pn=${pn}&am=150&cu=INR`,
        phonepe: `phonepe://upi/pay?pa=${UPI_PA}&pn=${pn}&am=150&cu=INR`,
        paytm:   `paytmmp://upi/pay?pa=${UPI_PA}&pn=${pn}&am=150&cu=INR`
      };
      try {
        window.location.href = deepLinks[appKey] || `upi://pay?pa=${UPI_PA}&pn=${pn}&am=150&cu=INR`;
      }
      catch (e) {
        window.location.href = `upi://pay?pa=${UPI_PA}&pn=${pn}&am=150&cu=INR`;
      }
      if (fkUpiVerifyMsg) {
        fkUpiVerifyMsg.innerHTML = '📲 Payment app opened. Please complete the transfer and tap <strong>I\'ve Paid</strong> below.';
        fkUpiVerifyMsg.className = 'fk-verify-message';
      }
    });
  }

  const qrImage = document.getElementById('fk-dynamic-qr-img');
  if (qrImage) {
    qrImage.addEventListener('click', () => {
      if (fkUpiVerifyMsg) {
        fkUpiVerifyMsg.innerHTML = '📸 QR scanned. Please complete the payment and then tap <strong>I\'ve Paid</strong> below.';
        fkUpiVerifyMsg.className = 'fk-verify-message';
      }
    });
  }

  // ── "I've Paid" confirm button ──
  if (fkUtrVerifyBtn) {
    fkUtrVerifyBtn.addEventListener('click', async () => {
      if (window.Razorpay) {
        await startRazorpayCheckout();
      } else {
        confirmUpiPayment();
      }
    });
  }

  // ── Cash: refresh captcha ──
  if (fkCaptchaRefreshBtn) {
    fkCaptchaRefreshBtn.addEventListener('click', generateCaptcha);
  }

  // ── Cash: confirm with captcha ──
  if (fkCashConfirmBtn) {
    fkCashConfirmBtn.addEventListener('click', () => {
      if (!fkCaptchaInput || fkCaptchaInput.value.trim() !== captchaCode) {
        if (fkCaptchaErrorMsg) fkCaptchaErrorMsg.style.display = 'block';
        return;
      }
      if (fkCaptchaErrorMsg) fkCaptchaErrorMsg.style.display = 'none';
      triggerSuccessFlow('cash');
    });
  }

  // ── Open payment modal ──
  const openPaymentModal = () => {
    generateCaptcha();
    switchPanel('online');
    const upiRadio = document.getElementById('fk-pay-upi');
    if (upiRadio) upiRadio.checked = true;
    if (paymentModal) paymentModal.style.display = 'flex';
  };

  if (regFeeDisplay && paymentModal) {
    regFeeDisplay.addEventListener('click', openPaymentModal);
    regFeeDisplay.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPaymentModal(); }
    });
  }

  // ── Close modal button ──
  if (payModalClose) payModalClose.addEventListener('click', closePaymentModal);

  // ── Backdrop click / ESC to close ──
  if (paymentModal) {
    paymentModal.addEventListener('click', e => {
      if (e.target === paymentModal) closePaymentModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && paymentModal.style.display === 'flex') closePaymentModal();
    });
  }

  // ==========================================
  // 4. CONTACT QUERY FORM VALIDATION (contact.html)
  // ==========================================
  const queryForm = document.getElementById('contact-query-form');
  if (queryForm) {
    queryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isQueryValid = true;

      const cname = document.getElementById('contact-name');
      const cnameError = document.getElementById('cname-error');
      if (cname && cnameError) {
        if (cname.value.trim() === '') {
          cname.classList.add('input-invalid');
          cnameError.style.display = 'block';
          isQueryValid = false;
        } else {
          cname.classList.remove('input-invalid');
          cnameError.style.display = 'none';
        }
      }

      const cemail = document.getElementById('contact-email');
      const cemailError = document.getElementById('cemail-error');
      if (cemail && cemailError) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cemail.value.trim())) {
          cemail.classList.add('input-invalid');
          cemailError.style.display = 'block';
          isQueryValid = false;
        } else {
          cemail.classList.remove('input-invalid');
          cemailError.style.display = 'none';
        }
      }

      const csub = document.getElementById('contact-subject');
      const csubError = document.getElementById('csubject-error');
      if (csub && csubError) {
        if (csub.value.trim() === '') {
          csub.classList.add('input-invalid');
          csubError.style.display = 'block';
          isQueryValid = false;
        } else {
          csub.classList.remove('input-invalid');
          csubError.style.display = 'none';
        }
      }

      const cmsg = document.getElementById('contact-message');
      const cmsgError = document.getElementById('cmessage-error');
      if (cmsg && cmsgError) {
        if (cmsg.value.trim() === '') {
          cmsg.classList.add('input-invalid');
          cmsgError.style.display = 'block';
          isQueryValid = false;
        } else {
          cmsg.classList.remove('input-invalid');
          cmsgError.style.display = 'none';
        }
      }

      if (isQueryValid) {
        const submitBtn = queryForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        }

        const payload = {
          name:    cname  ? cname.value.trim()  : '',
          email:   cemail ? cemail.value.trim()  : '',
          subject: csub   ? csub.value.trim()   : '',
          message: cmsg   ? cmsg.value.trim()   : ''
        };

        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert(data.message || 'Your query has been submitted successfully!');
            queryForm.reset();
          } else {
            alert('Error: ' + (data.error || 'Something went wrong. Please try again.'));
          }
        })
        .catch(err => {
          console.error('Error sending query:', err);
          alert('Unable to send your query. Please check your network connection and try again.');
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
        });
      }
    });
  }

});
