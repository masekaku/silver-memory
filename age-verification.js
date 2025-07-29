// Age Verification Module
(function() {
    'use strict';

    const AGE_VERIFY_KEY = 'age_verified_' + window.location.hostname;
    const overlay = document.getElementById('ageVerificationOverlay');
    const confirmBtn = document.getElementById('ageVerifyConfirm');
    const denyBtn = document.getElementById('ageVerifyDeny');
    const content = document.getElementById('ageGatedContent');

    function checkAgeVerification() {
        try {
            const isVerified = localStorage.getItem(AGE_VERIFY_KEY);
            if (isVerified === 'true') {
                overlay.style.display = 'none';
                content.classList.remove('age-verify-hidden');
                return true;
            }
            return false;
        } catch (e) {
            console.error('Age verification error:', e);
            return false;
        }
    }

    function initAgeVerification() {
        if (!checkAgeVerification()) {
            overlay.style.display = 'flex';
            content.classList.add('age-verify-hidden');
            document.body.style.overflow = 'hidden';
        }

        confirmBtn.addEventListener('click', confirmAge);
        denyBtn.addEventListener('click', denyAge);
        setupProtection();
    }

    function confirmAge() {
        try {
            localStorage.setItem(AGE_VERIFY_KEY, 'true');
            overlay.style.display = 'none';
            content.classList.remove('age-verify-hidden');
            document.body.style.overflow = '';
        } catch (e) {
            console.error('Failed to set age verification:', e);
            overlay.style.display = 'none';
            content.classList.remove('age-verify-hidden');
        }
    }

    function denyAge() {
        window.location.href = 'https://www.google.com';
    }

    function setupProtection() {
        document.addEventListener('contextmenu', function(e) {
            if (overlay.style.display !== 'none') {
                e.preventDefault();
                return false;
            }
        }, false);

        document.addEventListener('keydown', function(e) {
            if (overlay.style.display !== 'none' && 
                (e.key === 'F12' || 
                 (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')))) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAgeVerification);
    } else {
        initAgeVerification();
    }
})();