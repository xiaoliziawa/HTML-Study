function filterCards(searchTerm) {
    const cards = document.querySelectorAll('.card');
    searchTerm = searchTerm.toLowerCase();
    const pinyinSearchTerm = pinyinPro.pinyin(searchTerm, { toneType: 'none', type: 'array' }).join('');

    cards.forEach(card => {
        const title = card.querySelector('.link-title').textContent;
        const description = card.querySelector('.link-description').textContent;
        const content = title + ' ' + description;
        const pinyinContent = pinyinPro.pinyin(content, { toneType: 'none', type: 'array' }).join('');

        if (content.toLowerCase().includes(searchTerm) || pinyinContent.includes(pinyinSearchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
document.getElementById('search').addEventListener('input', function () {
    filterCards(this.value);
});