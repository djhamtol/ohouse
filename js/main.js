document.addEventListener('DOMContentLoaded', () => {
    mainView.writeBtn();
    mainView.insertRankList();
    mainView.rollingKeyword();
    mainView.wholeViewBtn();
});

const mainView = {
    writeBtn() {
        const btn = document.querySelector('.write-btn');
        const category = document.querySelector('.write-category');

        btn.addEventListener('click', () => {
            category.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!category.contains(e.target)&&!btn.contains(e.target)) {
                category.classList.remove('active');
            };
        });
    },

    insertRankList() {
        const rollingList = document.querySelector('.keyword-rolling-view .rank-list');
        const WholeList = document.querySelector('.keyword-whole-view .rank-list');

        const keywordArr = [
            '바이너리샵',
            '침대 틈새 선반',
            '템바보드수납장',
            '잭슨카멜레온',
            '약정리함',
            '창틀선반',
            '비비엔다',
            '좌식 테이블',
            '베베앙물티슈',
            '무아스디스펜서'
        ];

        let innerItems = '';

        keywordArr.forEach((keyword, i) => {
            innerItems += `
                <li>
                    <span class="rank">${i + 1}</span>
                    <span class="keyword">${keyword}</span>
                </li>
            `;
        });

        rollingList.innerHTML = innerItems + `
            <li>
                <span class="rank">1</span>
                <span class="keyword">${keywordArr[0]}</span>
            </li>
        `;

        WholeList.innerHTML = innerItems;
    },

    rollingKeyword() {
        const rollingList = document.querySelector('.keyword-rolling-view .rank-list');
        const items = document.querySelectorAll('.keyword-rolling-view .rank-list li');

        const itemHeight = items[0].offsetHeight;

        let index = 0;

        setInterval(() => {
            index++;

            gsap.to(rollingList, {
                y: -(index * itemHeight),
                duration: 0.4,

                onComplete: () => {
                    // 마지막이면 리셋
                    if (index === (items.length - 1)) {
                        gsap.set(rollingList, { y: 0 });
                        index = 0;
                    }
                }
            });
        }, 2000);
    },

    wholeViewBtn() {
        const btn = document.querySelector('.whole-view-btn');
        const view = document.querySelector('.keyword-whole-view');

        btn.addEventListener('click', () => {
            view.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if(!view.contains(e.target)&&!btn.contains(e.target)) {
                view.classList.remove('active');
            };
        });
    }

};