import "./style.css"

const VALUES = {
  negative: 'NEGATIVE',
  positive: 'POSITIVE',
}
const WORDS = Array.from({ length: 28 });

WORDS.map(() => {
  const container = document.querySelector('.container')

  if (!container) return

  const textNode = document.createElement('span')
  textNode.classList.add('word')
  textNode.innerText = VALUES.negative

  container.append(textNode)
})

function getClampedRange(selectionRange: Range, word: Node) {
  const wordRange = document.createRange();
  wordRange.selectNodeContents(word);

  const clamped = selectionRange.cloneRange()

  if (selectionRange.compareBoundaryPoints(Range.START_TO_START, wordRange) < 0) {
    clamped.setStart(word, 0);
  }

  if (selectionRange.compareBoundaryPoints(Range.END_TO_END, wordRange) > 0) {
    clamped.setEnd(word, word.childNodes.length);
  }

  return clamped;
}

function updateWordProgress(word: HTMLElement, revealedCount: number) {
  const positive = VALUES.positive;
  const negative = VALUES.negative;

  const revealed = positive.slice(0, revealedCount);
  const rest = negative.slice(revealedCount);

  word.innerHTML = `<span class="revealed">${revealed}</span>${rest}`;
  word.classList.toggle('active', revealedCount > 0);
}

function handleMouseUp () {
  const selection = window.getSelection();
  const words = document.querySelectorAll<HTMLElement>('.word')

  if (!selection || selection.isCollapsed) {
    words.forEach((word) => updateWordProgress(word, 0));
    return;
  }

  const range = selection?.getRangeAt(0)

  words.forEach(word => {
    if (range?.intersectsNode(word)) {
      const clamped = getClampedRange(range, word);
      updateWordProgress(word, clamped.toString().length)
    } else {
      updateWordProgress(word, 0)
    }
  });
}

document.addEventListener("selectionchange", handleMouseUp);
