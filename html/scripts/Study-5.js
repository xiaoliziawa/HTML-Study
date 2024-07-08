let highlighter;

window.onload = async function () {
    if (typeof shiki === 'undefined') {
        showError('Shiki is not defined. The library may not have loaded correctly.');
        return;
    }

    try {
        console.log('Starting Shiki initialization...');
        highlighter = await shiki.getHighlighter({
            theme: 'github-light'
        });
        console.log('Shiki initialized successfully');
    } catch (error) {
        showError('Failed to initialize Shiki: ' + error.message);
    }
}

async function renderMarkdown() {
    const input = document.getElementById('markdown-input').value;
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    if (!highlighter) {
        console.log('Highlighter not initialized, attempting to initialize...');
        try {
            highlighter = await shiki.getHighlighter({
                theme: 'github-light'
            });
            console.log('Shiki initialized successfully');
        } catch (error) {
            showError('Could not initialize syntax highlighter: ' + error.message);
            return;
        }
    }

    if (typeof marked === 'undefined') {
        showError('Marked library is not loaded. Please check your internet connection and reload the page.');
        return;
    }

    marked.setOptions({
        highlight: (code, lang) => {
            try {
                return highlighter.codeToHtml(code, { lang });
            } catch (error) {
                console.error('Error in syntax highlighting:', error);
                return code;
            }
        }
    });

    try {
        output.innerHTML = marked.parse(input);
    } catch (error) {
        showError('Failed to render Markdown: ' + error.message);
    }
}

function showError(message) {
    console.error(message);
    document.getElementById('error-message').textContent = message;
}