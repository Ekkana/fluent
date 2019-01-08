function cleanElements(parent, children, border, background) {
    Object.keys(children).forEach(key => {
        const el = children[key];

        if (border) {
            cleanBorder(el, border);
        }
        if (background) {
            cleanBackground(el, background.baseBackground);
        }
    });
}

function cleanBackground(el, baseBackground) {
    el.style.background = baseBackground || 'initial';
}

function cleanBorder(el, border) {
    el.style.border = border.defaultBorder || '1px solid transparent';
    el.style['border-image-source'] = '';
}

function addInitialBorders(children, border) {
    Object.keys(children).forEach(key => {
        const el = children[key];
        el.style.border = '1px solid transparent';
        el.style['border-image-source'] = '';
    });
}

function updateMousePosition(children, border, background, e) {
    const {
        clientX,
        clientY,
    } = e;

    Object.keys(children).forEach(key => {
        const el = children[key];
        const rect = el.getBoundingClientRect();
        if (border) {
            this.setBorder(el, rect, clientX, clientY, border);
        }
        if (background) {
            this.setBackground(el, rect, clientX, clientY, background);
        }
    });
}

function setBorder(el, rect, clientX, clientY, border) {
    const { borderImageSource } = border;
    el.style['border-image-source'] = borderImageSource
        .replace('$mouseX', `${this.getRelativePosition(rect.left, clientX)}px`)
        .replace('$mouseY', `${this.getRelativePosition(rect.top, clientY)}px`);
    el.style['border-image-slice'] = '1';
}

function setBackground(el, rect, clientX, clientY, background) {
    const { highlightBackground, baseBackground } = background;
    if (clientX > rect.left && clientX < rect.right && clientY > rect.top && clientY < rect.bottom) {
        el.style.background = highlightBackground
            .replace('$mouseX', `${this.getRelativePosition(rect.left, clientX)}px`)
            .replace('$mouseY', `${this.getRelativePosition(rect.top, clientY)}px`);
        el.style['background-repeat'] = 'no-repeat';
    } else {
        el.style.background = baseBackground || 'initial';
    }
}

function getRelativePosition(blockPosition, updateMousePosition) {
    return updateMousePosition - blockPosition;
}

function makeFluent(parent, children, border, background) {
    parent.addEventListener('mousemove', updateMousePosition.bind(this, children, border, background));
    parent.addEventListener('mouseleave', cleanElements.bind(this, parent, children, border, background));
    addInitialBorders(children, border);
}
