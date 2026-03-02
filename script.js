document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && closeMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 2. Sticky Header ---
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = 'none';
        }
    });

    // --- 3. Dark & Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const footerThemeBtn = document.getElementById('footer-theme-btn');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    const toggleTheme = () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (footerThemeBtn) {
        footerThemeBtn.addEventListener('click', toggleTheme);
    }

    // --- 4. Comparison Slider ---
    const slider = document.querySelector('.comparison-slider');
    const sliderHandle = document.querySelector('.slider-handle');
    const imageBefore = document.querySelector('.image-before');

    if (slider && sliderHandle && imageBefore) {
        let isSliding = false;

        const slide = (e) => {
            if (!isSliding) return;
            
            // Get x coordinate of mouse or touch relative to slider
            let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            let rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            
            // Limit bounds
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            let percentage = (x / rect.width) * 100;
            
            imageBefore.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };

        sliderHandle.addEventListener('mousedown', () => isSliding = true);
        sliderHandle.addEventListener('touchstart', () => isSliding = true, {passive: true});
        
        window.addEventListener('mouseup', () => isSliding = false);
        window.addEventListener('touchend', () => isSliding = false);
        
        window.addEventListener('mousemove', slide);
        window.addEventListener('touchmove', slide, {passive: true});
    }

    // --- 5. Quote Form Submission ---
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = quoteForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            
            // Simulate API Call
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
                btn.style.backgroundColor = 'var(--primary-green)';
                quoteForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }

    // --- 6. AI Chatbot Logic ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatChips = document.querySelectorAll('.chat-chip');
    const chatbotBadge = document.querySelector('.chatbot-badge');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotBadge) chatbotBadge.style.display = 'none';
        });

        closeChatbot.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        const addMessage = (text, isBot = false) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
            msgDiv.textContent = text;
            
            // Insert before chat options if bot message
            const options = chatbotMessages.querySelector('.chat-options');
            if (options && !isBot) {
                chatbotMessages.insertBefore(msgDiv, options);
            } else {
                chatbotMessages.appendChild(msgDiv);
                // Move options to bottom if they exist
                if (options) chatbotMessages.appendChild(options);
            }
            
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        const generateBotResponse = (userText) => {
            const lowerText = userText.toLowerCase();
            setTimeout(() => {
                let response = "I'm sorry, I didn't quite catch that. Would you like to speak to a human or request a callback?";
                
                if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('quote')) {
                    response = "Our driveway cleaning typically starts from £80 depending on the size and condition. For a precise quote, please fill out our quote form or provide your address!";
                } else if (lowerText.includes('service') || lowerText.includes('do you do')) {
                    response = "We specialize in Driveway Cleaning, Patio Restoration, and Block Paving Jet Wash with Re-sanding. What do you need help with?";
                } else if (lowerText.includes('contact') || lowerText.includes('call') || lowerText.includes('phone')) {
                    response = "You can reach us directly at 07946 188198. Would you like me to note down your number for a callback?";
                } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                    response = "Hello! How can KPC Patio Cleaning assist you today?";
                } else if (lowerText.includes('book') || lowerText.includes('schedule')) {
                    response = "Great! To book a service, please leave your name and number, and our team will call you to confirm a date.";
                }

                addMessage(response, true);
            }, 800);
        };

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage(text, false);
                chatInput.value = '';
                
                // Show typing indicator visually (optional, simulated here by immediate delay in response function)
                generateBotResponse(text);
            }
        };

        sendChat.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        chatChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const text = chip.textContent;
                addMessage(text, false);
                generateBotResponse(text);
            });
        });
    }

    // --- 7. Simple Reveal Animation on Scroll ---
    const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in-up, .hover-lift');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        // Apply initial hidden state via JS to ensure graceful degradation if JS is disabled
        if(el.classList.contains('slide-in-left')) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50px)';
            el.style.transition = 'all 0.8s ease';
        } else if(el.classList.contains('slide-in-right')) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(50px)';
            el.style.transition = 'all 0.8s ease';
        } else if(el.classList.contains('fade-in-up')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease';
        }
        observer.observe(el);
    });
});
