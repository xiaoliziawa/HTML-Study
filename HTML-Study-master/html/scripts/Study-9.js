const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

let highlighter;

async function initializeHighlighter() {
    highlighter = await shiki.getHighlighter({
        theme: 'github-light',
        langs: [
            'markdown', 'javascript', 'html', 'css', 'python',
            'java', 'c', 'cpp', 'zenscript', 'vue',
            'php', 'go', 'ruby', 'shell', 'bash',
            'vb', 'lua', 'rust', 'xml', 'json',
            'kotlin', 'yaml', 'xml'
        ]
    });
    updatePreview();
}

initializeHighlighter();

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function updatePreview() {
    const markdown = editor.value;
    const html = marked.parse(markdown, {
        highlight: (code, lang) => {
            if (highlighter) {
                return highlighter.codeToHtml(code, { lang });
            }
            return code;
        }
    });
    preview.innerHTML = html;
    localStorage.setItem('markdownContent', markdown);
}

const throttledUpdatePreview = throttle(updatePreview, 50);

editor.addEventListener('input', throttledUpdatePreview);

function insertMarkdown(syntax) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    editor.value = before + syntax + selection + syntax + after;
    editor.selectionStart = start + syntax.length;
    editor.selectionEnd = end + syntax.length;
    editor.focus();
    throttledUpdatePreview();
}

function insertCodeBlock(lang) {
    const codeBlock = `\n\`\`\`${lang}\n// 在此输入${lang}代码\n\`\`\`\n`;
    const start = editor.selectionStart;
    const text = editor.value;
    const before = text.substring(0, start);
    const after = text.substring(start);
    editor.value = before + codeBlock + after;
    editor.selectionStart = start + codeBlock.length - 4;
    editor.selectionEnd = start + codeBlock.length - 4;
    editor.focus();
    throttledUpdatePreview();
}

const savedContent = localStorage.getItem('markdownContent');
if (savedContent) {
    editor.value = savedContent;
    updatePreview();
}