const snippetNode = document.getElementById('snippet');
const snippetContainerNode = document.getElementById('snippet-container');

const stripInitialIndent = node => {
	const initialSpans = Array.from(node.querySelectorAll(':scope > div > span:first-child'));
	if (initialSpans.some(span => !span.textContent.match(/^\s+/))) return;
	const minIndent = Math.min(
		...initialSpans.map(span => span.textContent.match(/^\s+/)[0].length)
	);
	initialSpans.forEach(span => (span.textContent = span.textContent.slice(minIndent)));
};

const addLineNumbers = (node, startLine = 1) => {
	const rows = Array.from(node.querySelectorAll(':scope > div, :scope > br'));
	rows.forEach((row, i) => {
		const num = document.createElement('span');
		num.classList.add('line-number');
		if (row.tagName === 'DIV') {
			row.prepend(num);
		} else {
			row.outerHTML = `<div>${num.outerHTML}</div>`;
		}
		num.textContent = startLine + rows.length - 1;
		num.style.width = num.clientWidth + 1 + 'px';
		num.style.paddingRight = '10px';
		num.textContent = startLine + i;
	});
};

document.addEventListener('paste', e => {
	snippetNode.innerHTML = e.clipboardData.getData('text/html');
	const div = snippetNode.querySelector('div');
	stripInitialIndent(div);
	addLineNumbers(div);
});

window.addEventListener('message', e => {
	if (e.data.type === 'update') {
		const { enableLigatures } = e.data;
		snippetNode.style.fontVariantLigatures = enableLigatures ? 'normal' : 'none';
		snippetContainerNode.style.backgroundColor = '#f2f2f2';
		document.execCommand('paste');
	}
});
