document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const mainContent = document.querySelector('#content');

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isVisible = navLinks.getAttribute('data-visible') === "true";
            navLinks.setAttribute('data-visible', (!isVisible).toString());
            mobileMenuBtn.setAttribute('aria-expanded', (!isVisible).toString());
        });
    }

    // Handle all navigation links
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a[href^="/"]');

        // Only handle internal links
        if (!link || link.getAttribute('target') === '_blank' || link.getAttribute('download')) {
            return;
        }

        e.preventDefault();
        const url = link.href;

        try {
            // Show loading state
            document.body.classList.add('loading');

            // Close mobile menu if open
            if (navLinks && mobileMenuBtn) {
                navLinks.setAttribute('data-visible', "false");
                mobileMenuBtn.setAttribute('aria-expanded', "false");
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update content
            const newContent = doc.querySelector('#content');
            if (newContent && mainContent) {
                mainContent.innerHTML = newContent.innerHTML;

                // Update page title
                const newTitle = doc.querySelector('title');
                if (newTitle) {
                    document.title = newTitle.textContent;
                }

                // Update URL
                window.history.pushState({ url }, '', url);
            } else {
                throw new Error('Content element not found');
            }

        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback to traditional navigation on error
            window.location.href = url;
        } finally {
            document.body.classList.remove('loading');
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', async (event) => {
        try {
            document.body.classList.add('loading');

            const response = await fetch(window.location.href);
            if (!response.ok) throw new Error('Network response was not ok');

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newContent = doc.querySelector('#content');
            if (newContent && mainContent) {
                mainContent.innerHTML = newContent.innerHTML;

                // Update page title
                const newTitle = doc.querySelector('title');
                if (newTitle) {
                    document.title = newTitle.textContent;
                }
            }
        } catch (error) {
            console.error('Navigation error:', error);
            window.location.reload();
        } finally {
            document.body.classList.remove('loading');
        }
    });
});