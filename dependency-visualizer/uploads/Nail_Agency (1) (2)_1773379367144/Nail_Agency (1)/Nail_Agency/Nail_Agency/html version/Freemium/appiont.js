document.addEventListener('DOMContentLoaded', function () {
    let currentStep = 1;
    const progressBar = document.querySelector('.progress');
    const serviceCards = document.querySelectorAll('.service-card');
    const bookingSteps = document.querySelectorAll('.booking-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Initialize date picker
    flatpickr("#date-picker", {
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: [
            function (date) {
                // Disable Sundays
                return date.getDay() === 0;
            }
        ],
        onChange: function (selectedDates) {
            generateTimeSlots(selectedDates[0]);
        }
    });

    // Service selection
    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            serviceCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Generate time slots
    function generateTimeSlots(date) {
        const timeSlotContainer = document.getElementById('time-slots');
        const times = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00'
        ];

        timeSlotContainer.innerHTML = '';
        times.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            slot.addEventListener('click', function () {
                document.querySelectorAll('.time-slot').forEach(s =>
                    s.classList.remove('selected'));
                this.classList.add('selected');
            });
            timeSlotContainer.appendChild(slot);
        });
    }

    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        let isValid = true;

        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!phoneRegex.test(phone.replace(/[- ]/g, ''))) {
            showError('phone', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = field.nextElementSibling;
        errorSpan.textContent = message;
        field.classList.add('error');
    }

    // Navigation functions
    window.nextStep = function () {
        if (currentStep === 1 && !document.querySelector('.service-card.selected')) {
            alert('Please select a service to continue');
            return;
        }

        if (currentStep === 2 && !document.querySelector('.time-slot.selected')) {
            alert('Please select a time slot to continue');
            return;
        }

        if (currentStep < 3) {
            currentStep++;
            updateSteps();
        }
    }

    window.prevStep = function () {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    }

    function updateSteps() {
        // Update progress bar
        progressBar.style.width = `${((currentStep - 1) / 2) * 100}%`;

        // Update progress steps
        progressSteps.forEach((step, idx) => {
            step.classList.toggle('active', idx < currentStep);
        });

        // Show current step
        bookingSteps.forEach((step, idx) => {
            step.classList.toggle('active', idx === currentStep - 1);
        });
    }

    // Form submission
    window.submitBooking = function (event) {
        event.preventDefault();

        if (!validateForm()) return;

        const bookingData = {
            service: document.querySelector('.service-card.selected').dataset.service,
            price: document.querySelector('.service-card.selected').dataset.price,
            date: document.getElementById('date-picker').value,
            time: document.querySelector('.time-slot.selected')?.textContent,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            notes: document.getElementById('notes').value
        };

        // Update success message with booking details
        document.getElementById('confirm-service').textContent = bookingData.service;
        document.getElementById('confirm-date').textContent = bookingData.date;
        document.getElementById('confirm-time').textContent = bookingData.time;
        document.getElementById('confirm-price').textContent = bookingData.price;
        document.getElementById('confirm-name').textContent = bookingData.name;
        document.getElementById('confirm-email').textContent = bookingData.email;

        // Show success message
        document.querySelector('.booking-step.active').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';

        // Reset form and redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    }
});