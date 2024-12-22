document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach((el) => {
        observer.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar-scroll');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        lastScroll = currentScroll;
    });

    // Project card interactions
    document.querySelectorAll('.project-card').forEach(card => {
        // Smooth hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        delay: 100,
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Typing effect for hero section
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Python Developer',
                'Data Engineer',
                'ML Engineer',
                'Full Stack Developer'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }

    // Skills filter functionality
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-600', 'text-white'));
            button.classList.add('active', 'bg-blue-600', 'text-white');
            
            const filter = button.dataset.filter;
            
            skillCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Contact Form Handling
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const existingMessages = document.querySelectorAll('.alert-message');
            existingMessages.forEach(msg => msg.remove());
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;

            try {
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                const formData = {
                    name: this.querySelector('#name').value.trim(),
                    email: this.querySelector('#email').value.trim(),
                    message: this.querySelector('#message').value.trim()
                };

                const response = await fetch('/api/contact/', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                const messageDiv = document.createElement('div');
                messageDiv.classList.add('alert-message', 'p-4', 'rounded-lg', 'my-4');

                if (response.ok) {
                    messageDiv.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-400');
                    messageDiv.textContent = data.message;
                    form.reset();
                } else {
                    messageDiv.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-400');
                    messageDiv.textContent = data.message || 'An error occurred. Please try again.';
                }

                form.insertAdjacentElement('afterend', messageDiv);
                setTimeout(() => messageDiv.remove(), 5000);

            } catch (error) {
                console.error('Error:', error);
                const messageDiv = document.createElement('div');
                messageDiv.classList.add(
                    'alert-message',
                    'bg-red-100',
                    'text-red-700',
                    'border',
                    'border-red-400',
                    'p-4',
                    'rounded-lg',
                    'my-4'
                );
                messageDiv.textContent = 'Network error. Please try again.';
                form.insertAdjacentElement('afterend', messageDiv);
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }
});