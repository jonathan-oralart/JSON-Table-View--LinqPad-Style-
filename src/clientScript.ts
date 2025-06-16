export const clientScript = `

// deno-lint-ignore-file no-window
// Initialize folding mode and selection state
let foldingMode = 'normal';
let openLevels = 4;
let selectedRow = null;

// Keep track of the original parent when in fullscreen
let originalParent = null;
let fullscreenWrapper = null;


// Get the parent wrapper of a row
function getParentWrapper(row) {
    let current = row.parentElement;
    while (current) {
        if (current.classList.contains('blue-wrapper')) {
            return current;
        }
        current = current.parentElement;
    }
    return null;
}

// Update fold level indicator
function updateFoldLevelIndicator() {
    const indicator = document.querySelector('.fold-level-indicator');
    if (indicator) {
        let message = '';
        if (selectedRow) {
            message = \`Press 1 - 10 to adjust fold level relative to selection(current: \${ openLevels })\`;
        } else {
            message = \`Press 1 - 10 to adjust fold level(current: \${ openLevels })\`;
        }

        indicator.innerHTML = \`
    < div >
    \${ message } |
        Folding Mode: \${ foldingMode } \${ foldingMode === 'normal' ? '(hold Shift for recursive)' : '(recursive folding active)' } |
            Navigation: ↑↓ between rows | Fullscreen: F
            </div >
    \`;
    }
}

// Handle selection of row
function selectRow(row, event) {
    // Don't select if clicking fullscreen button or toggle indicator
    if (event.target.matches('.fullscreen-button') ||
        event.target.matches('.toggle-indicator')) {
        return;
    }

    // Remove previous selection
    if (selectedRow) {
        selectedRow.classList.remove('selected');
    }

    // If clicking the same row, deselect it
    if (selectedRow === row) {
        selectedRow = null;
    } else {
        selectedRow = row;
        row.classList.add('selected');
    }

    updateFoldLevelIndicator();
}

// Find the next or previous row in the current table
function findSiblingRow(direction) {
    if (!selectedRow) return null;

    // Get the immediate table parent, not a nested one
    const table = selectedRow.parentElement.closest('table');
    if (!table) return null;

    // Get all direct rows from both THEAD and TBODY
    const allRows = [];
    const thead = table.querySelector(':scope > thead');
    const tbody = table.querySelector(':scope > tbody');

    if (thead) {
        allRows.push(...Array.from(thead.querySelectorAll(':scope > tr')));
    }
    if (tbody) {
        allRows.push(...Array.from(tbody.querySelectorAll(':scope > tr')));
    }
    // If no thead/tbody, get rows directly from table
    if (allRows.length === 0) {
        allRows.push(...Array.from(table.querySelectorAll(':scope > tr')));
    }

    const currentIndex = allRows.indexOf(selectedRow);
    if (direction === 'next') {
        return allRows[currentIndex + 1] || null;
    } else {
        return allRows[currentIndex - 1] || null;
    }
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    if (!selectedRow) return;

    let nextRow = null;

    switch (e.key) {
        case 'ArrowUp':
            nextRow = findSiblingRow('previous'); // Previous sibling row
            break;
        case 'ArrowDown':
            nextRow = findSiblingRow('next'); // Next sibling row
            break;
        case 'f': {
            const parentWrapper = getParentWrapper(selectedRow);
            if (parentWrapper) {
                const fullscreenBtn = parentWrapper.querySelector('.fullscreen-button');
                if (fullscreenBtn) {
                    e.preventDefault();
                    toggleFullscreen(parentWrapper, fullscreenBtn);
                }
            }
            return;
        }
    }

    if (nextRow) {
        e.preventDefault(); // Prevent page scrolling
        selectRow(nextRow, { target: nextRow });
        scrollIntoViewVertically(nextRow);
    }
}

// Handle click events
function handleClick(e) {
    if (e.target.matches('.fullscreen-button')) {
        e.stopPropagation(); // Prevent triggering collapse
        const wrapper = e.target.closest('.blue-wrapper');
        if (wrapper) {
            toggleFullscreen(wrapper, e.target);
        }
        return;
    }

    const row = e.target.closest('tr');
    if (row) {
        const header = e.target.closest('.blue-header');
        if (header) {
            e.stopPropagation(); // Prevent event bubbling
            const wrapper = header.closest('.blue-wrapper');
            if (wrapper) {
                toggleCollapse(wrapper, foldingMode === 'recursive');
            }
        } else {
            selectRow(row, e);
        }
    }
}

// Toggle fullscreen mode
function toggleFullscreen(wrapper, button) {
    const isEnteringFullscreen = !wrapper.classList.contains('fullscreen');

    if (isEnteringFullscreen) {
        // Save original parent and position
        originalParent = wrapper.parentNode;
        fullscreenWrapper = wrapper;

        // Move to body
        document.body.appendChild(wrapper);
        wrapper.classList.add('fullscreen');
        button.textContent = '⛶';

        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);

        // Add click handler to the fullscreen wrapper
        wrapper.addEventListener('click', handleClick);
    } else {
        // Restore to original position
        if (originalParent && fullscreenWrapper === wrapper) {
            // Remove click handler from the fullscreen wrapper
            wrapper.removeEventListener('click', handleClick);

            originalParent.appendChild(wrapper);
            wrapper.classList.remove('fullscreen');
            button.textContent = '⛶';

            // Clean up
            originalParent = null;
            fullscreenWrapper = null;

            // Remove escape key listener
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }
}

// Handle escape key press
function handleEscapeKey(e) {
    if (e.key === 'Escape' && fullscreenWrapper) {
        const button = fullscreenWrapper.querySelector('.fullscreen-button');
        toggleFullscreen(fullscreenWrapper, button);
    }
}

// Toggle collapse state
function toggleCollapse(wrapper, recursive = false) {
    const isCollapsed = wrapper.classList.toggle('collapsed');
    const toggleIndicator = wrapper.querySelector('.toggle-indicator');
    if (toggleIndicator) {
        toggleIndicator.textContent = isCollapsed ? '▶' : '▼';
    }

    if (recursive) {
        const content = wrapper.querySelector('.content');
        if (content) {
            const childWrappers = content.querySelectorAll('.blue-wrapper');
            childWrappers.forEach(childWrapper => {
                childWrapper.classList.toggle('collapsed', isCollapsed);
                const childIndicator = childWrapper.querySelector('.toggle-indicator');
                if (childIndicator) {
                    childIndicator.textContent = isCollapsed ? '▶' : '▼';
                }
            });
        }
    }
}

// Scroll element into view vertically only
function scrollIntoViewVertically(element) {
    const rect = element.getBoundingClientRect();
    const isInViewVertically = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isInViewVertically) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetY = scrollTop + rect.top - window.innerHeight / 2 + rect.height / 2;
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }
}

// Get relative depth of a wrapper
function getRelativeDepth(wrapper, referenceWrapper) {
    if (!referenceWrapper) return parseInt(wrapper.getAttribute('data-depth') || '0');

    const refDepth = parseInt(referenceWrapper.getAttribute('data-depth') || '0');
    const wrapperDepth = parseInt(wrapper.getAttribute('data-depth') || '0');
    return wrapperDepth - refDepth;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.querySelector('.fold-level-indicator');
    updateFoldLevelIndicator();

    // Use event delegation for click handlers
    const container = document.querySelector('.json-viewer-table');
    container.addEventListener('click', handleClick);

    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        // Handle navigation keys
        if (['ArrowUp', 'ArrowDown', 'f'].includes(e.key)) {
            handleKeyboardNavigation(e);
            return;
        }

        // Handle folding mode
        foldingMode = e.shiftKey ? 'recursive' : 'normal';
        updateFoldLevelIndicator();

        const key = parseInt(e.key);
        if (!isNaN(key) && key >= 1 && key <= 10) {
            openLevels = key;
            updateFoldLevelIndicator();

            if (selectedRow) {
                // Find all blue wrappers within the selected row's cells
                const wrappers = Array.from(selectedRow.querySelectorAll('.blue-wrapper'));
                if (wrappers.length > 0) {
                    // Get the minimum depth among direct children to use as reference
                    const minDepth = Math.min(...wrappers
                        .filter(w => w.parentElement.closest('tr') === selectedRow)
                        .map(w => parseInt(w.getAttribute('data-depth') || '0')));

                    wrappers.forEach(wrapper => {
                        const depth = parseInt(wrapper.getAttribute('data-depth') || '0');
                        const relativeDepth = depth - minDepth;
                        wrapper.classList.toggle('collapsed', relativeDepth >= openLevels);
                        const toggleIndicator = wrapper.querySelector('.toggle-indicator');
                        if (toggleIndicator) {
                            toggleIndicator.textContent = relativeDepth >= openLevels ? '▶' : '▼';
                        }
                    });
                }
            } else if (fullscreenWrapper) {
                // In fullscreen mode, only update wrappers inside the fullscreen wrapper
                const wrappers = fullscreenWrapper.querySelectorAll('.blue-wrapper');
                wrappers.forEach(wrapper => {
                    const relativeDepth = getRelativeDepth(wrapper, fullscreenWrapper);
                    wrapper.classList.toggle('collapsed', relativeDepth >= openLevels);
                    const toggleIndicator = wrapper.querySelector('.toggle-indicator');
                    if (toggleIndicator) {
                        toggleIndicator.textContent = relativeDepth >= openLevels ? '▶' : '▼';
                    }
                });
            } else {
                // Normal mode - use absolute depths when nothing is selected
                const wrappers = document.querySelectorAll('.blue-wrapper');
                wrappers.forEach(wrapper => {
                    const depth = parseInt(wrapper.getAttribute('data-depth') || '0');
                    wrapper.classList.toggle('collapsed', depth >= openLevels);
                    const toggleIndicator = wrapper.querySelector('.toggle-indicator');
                    if (toggleIndicator) {
                        toggleIndicator.textContent = depth >= openLevels ? '▶' : '▼';
                    }
                });
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') {
            foldingMode = 'normal';
            updateFoldLevelIndicator();
        }
    });
}); 
`;