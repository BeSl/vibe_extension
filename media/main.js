// Main JavaScript for 1C Object Details Webview

(function() {
    'use strict';
    
    // Get a reference to the VS Code API
    const vscode = acquireVsCodeApi();

    // Initialize the page when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializePage();
    });

    function initializePage() {
        // Initialize collapsible sections
        initializeCollapsibleSections();
        
        // Initialize copy functionality
        initializeCopyFunctionality();
        
        // Initialize search functionality
        initializeSearchFunctionality();
        
        // Initialize tooltips
        initializeTooltips();
    }

    function initializeCollapsibleSections() {
        const collapsibleSections = document.querySelectorAll('.collapsible h2');
        
        collapsibleSections.forEach(header => {
            header.addEventListener('click', function() {
                toggleSection(this);
            });
        });
    }

    // Global function for collapsible sections
    window.toggleSection = function(headerElement) {
        const section = headerElement.closest('.info-section');
        const content = section.querySelector('.raw-data, .attributes-list, .forms-list, .commands-list');
        const toggleIcon = headerElement.querySelector('.toggle-icon');
        
        if (section.classList.contains('collapsed')) {
            section.classList.remove('collapsed');
            if (content) content.style.display = 'block';
            if (toggleIcon) toggleIcon.textContent = '▼';
        } else {
            section.classList.add('collapsed');
            if (content) content.style.display = 'none';
            if (toggleIcon) toggleIcon.textContent = '▶';
        }
    };

    function initializeCopyFunctionality() {
        // Add copy buttons to code blocks and important text
        const copyTargets = document.querySelectorAll('.uuid, .file-path, pre code');
        
        copyTargets.forEach(target => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.width = '100%';
            
            target.parentNode.insertBefore(wrapper, target);
            wrapper.appendChild(target);
            
            const copyButton = document.createElement('button');
            copyButton.textContent = '📋';
            copyButton.title = 'Copy to clipboard';
            copyButton.style.cssText = `
                position: absolute;
                top: 4px;
                right: 4px;
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: 1px solid var(--vscode-button-border);
                border-radius: 3px;
                padding: 2px 6px;
                cursor: pointer;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s;
            `;
            
            wrapper.appendChild(copyButton);
            
            wrapper.addEventListener('mouseenter', () => {
                copyButton.style.opacity = '1';
            });
            
            wrapper.addEventListener('mouseleave', () => {
                copyButton.style.opacity = '0';
            });
            
            copyButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                const textToCopy = target.textContent || target.innerText;
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    copyButton.textContent = '✓';
                    setTimeout(() => {
                        copyButton.textContent = '📋';
                    }, 1000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    copyButton.textContent = '✓';
                    setTimeout(() => {
                        copyButton.textContent = '📋';
                    }, 1000);
                }
            });
        });
    }

    function initializeSearchFunctionality() {
        // Add search functionality for large data sections
        const largeSections = document.querySelectorAll('.raw-data');
        
        largeSections.forEach(section => {
            const searchContainer = document.createElement('div');
            searchContainer.style.cssText = `
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search in data...';
            searchInput.style.cssText = `
                flex: 1;
                padding: 4px 8px;
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                border-radius: 3px;
                font-family: inherit;
                font-size: 12px;
            `;
            
            const clearButton = document.createElement('button');
            clearButton.textContent = '✕';
            clearButton.title = 'Clear search';
            clearButton.style.cssText = `
                padding: 4px 8px;
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: 1px solid var(--vscode-button-border);
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;
            
            searchContainer.appendChild(searchInput);
            searchContainer.appendChild(clearButton);
            section.insertBefore(searchContainer, section.firstChild);
            
            const codeElement = section.querySelector('pre code');
            let originalContent = codeElement ? codeElement.innerHTML : '';
            
            function highlightText(text, searchTerm) {
                if (!searchTerm) return text;
                
                const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
                return text.replace(regex, '<mark style="background-color: var(--vscode-editor-findMatchHighlightBackground); color: var(--vscode-editor-findMatchHighlightForeground);">$1</mark>');
            }
            
            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                if (codeElement) {
                    if (searchTerm) {
                        codeElement.innerHTML = highlightText(originalContent, searchTerm);
                    } else {
                        codeElement.innerHTML = originalContent;
                    }
                }
            });
            
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                if (codeElement) {
                    codeElement.innerHTML = originalContent;
                }
                searchInput.focus();
            });
        });
    }

    function initializeTooltips() {
        // Add tooltips to technical terms
        const technicalTerms = {
            'UUID': 'Universally Unique Identifier - a unique identifier for the object',
            'Synonym': 'Display name of the object in the user interface',
            'Hierarchical': 'Whether this catalog supports hierarchical structure',
            'Autonumbering': 'Automatic generation of sequential numbers',
            'CheckUnique': 'Ensures uniqueness of codes/numbers',
            'UseStandardCommands': 'Uses standard platform commands for this object type',
            'Posting': 'Document posting capability for accounting purposes'
        };
        
        Object.keys(technicalTerms).forEach(term => {
            const elements = document.querySelectorAll(`label:contains("${term}"), .object-type:contains("${term}")`);
            elements.forEach(element => {
                element.title = technicalTerms[term];
                element.style.cursor = 'help';
                element.style.borderBottom = '1px dotted currentColor';
            });
        });
    }

    // Utility function to select elements by text content
    function selectElementsByText(selector, text) {
        return Array.from(document.querySelectorAll(selector)).filter(
            element => element.textContent.includes(text)
        );
    }

    // Message handling
    window.addEventListener('message', event => {
        const message = event.data;
        
        switch (message.type) {
            case 'update':
                // Handle updates from the extension
                break;
            case 'theme-changed':
                // Handle theme changes if needed
                break;
        }
    });

    // Send ready message to extension
    vscode.postMessage({
        type: 'ready'
    });

    // Add smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Auto-resize handling for dynamic content
    const resizeObserver = new ResizeObserver(() => {
        vscode.postMessage({
            type: 'resize',
            height: document.body.scrollHeight
        });
    });
    
    resizeObserver.observe(document.body);

})();