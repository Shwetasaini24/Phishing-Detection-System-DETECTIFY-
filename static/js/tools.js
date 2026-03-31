// Password Generator
function generatePassword() {
    const length = parseInt(document.getElementById('passLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    const charsetLength = charset.length;
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charsetLength));
    }

    const passwordField = document.getElementById('generatedPassword');
    passwordField.value = password;
    checkPasswordStrength(password, true);
    showToast('Secure password generated! 🔐');
}

// Password Strength Checker
function checkPasswordStrength(password = null, isGenerated = false) {
    const field = document.getElementById('strengthPassword');
    const pass = password || field.value;
    
    if (!pass) return;

    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const strengthTips = document.getElementById('strengthTips');

    let score = 0;
    const tips = [];

    // Length check
    if (pass.length >= 12) score += 25;
    else if (pass.length >= 8) score += 15;
    else tips.push('Use 12+ characters');

    // Uppercase
    if (/[A-Z]/.test(pass)) score += 20;
    else tips.push('Add uppercase letters (A-Z)');

    // Lowercase
    if (/[a-z]/.test(pass)) score += 20;
    else tips.push('Add lowercase letters (a-z)');

    // Numbers
    if (/[0-9]/.test(pass)) score += 20;
    else tips.push('Add numbers (0-9)');

    // Symbols
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    else tips.push('Add symbols (!@#$%)');

    // No repetition
    if (!/(.)\1{2,}/.test(pass)) score += 10;
    else tips.push('Avoid repeating characters');

    // Determine strength
    let strengthClass = 'very-weak';
    let strengthTextContent = 'Very Weak';
    let colorClass = 'text-red-600';
    
    if (score >= 90) {
        strengthClass = 'strong';
        strengthTextContent = 'Extremely Strong 💪';
        colorClass = 'text-green-600';
    } else if (score >= 75) {
        strengthClass = 'strong';
        strengthTextContent = 'Strong ✅';
        colorClass = 'text-green-600';
    } else if (score >= 55) {
        strengthClass = 'medium';
        strengthTextContent = 'Medium ⚠️';
        colorClass = 'text-blue-600';
    } else if (score >= 35) {
        strengthClass = 'weak';
        strengthTextContent = 'Weak ⚠️';
        colorClass = 'text-yellow-600';
    }

    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthText.textContent = strengthTextContent;
    strengthText.className = `text-center font-bold text-lg ${colorClass}`;

    if (tips.length > 0) {
        strengthTips.innerHTML = tips.map(tip => `<div>• ${tip}</div>`).join('');
    } else {
        strengthTips.innerHTML = '<div class="text-green-600 font-bold">Perfect password! 🛡️</div>';
    }
}

// Copy Password
function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    if (passwordField.value) {
        passwordField.select();
        passwordField.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(passwordField.value).then(() => {
            showToast('Password copied to clipboard! 📋');
        });
    }
}

// Toast Notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Length slider
    const lengthSlider = document.getElementById('passLength');
    const lengthValue = document.getElementById('passLengthVal');
    
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Password field click to copy
    document.getElementById('generatedPassword').addEventListener('click', copyPassword);

    // Auto check strength on input
    document.getElementById('strengthPassword').addEventListener('input', function() {
        checkPasswordStrength();
    });
});