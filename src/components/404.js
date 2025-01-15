export class NotFoundError {
    constructor(historyBackLink) {
        if (historyBackLink) {
            const historyBackElement = document.getElementById('history-back')
            historyBackElement.style.display = 'block';
            historyBackElement.children[0].href = historyBackLink
        }
    }
}