document.addEventListener('DOMContentLoaded', () => {
    mainView.toggleCategory();
    mainView.headerBottomScroll();
    mainView.renderKeywordRankList();
    mainView.rollingKeyword();
    mainView.toggleWholeView();
    mainView.mainBannerSlide();
});


const mainView = {
    toggleCategory() {
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

    headerBottomScroll() {
        const hdBottom = document.querySelector('.hd-bottom');

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            hdBottom.classList.toggle('hide' , currentScroll > lastScroll);
            
            lastScroll = currentScroll;
        });
    },

    // .keyword-rank-list 동적 삽입
    renderKeywordRankList() {
        const rollingList = document.querySelector('.keyword-rolling-view .keyword-rank-list');
        const wholeList = document.querySelector('.keyword-whole-view .keyword-rank-list');

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

        wholeList.innerHTML = innerItems;
    },

    rollingKeyword() {
        const rollingList = document.querySelector('.keyword-rolling-view .keyword-rank-list');
        const items = document.querySelectorAll('.keyword-rolling-view .keyword-rank-list li');

        if (!items.length) return;

        const itemHeight = items[0].offsetHeight;

        let index = 0;

        gsap.to({}, {
            repeat: -1,
            repeatDelay: 2,

            onRepeat: () => {
                index++;

                gsap.to(rollingList, {
                    y: -(index * itemHeight),
                    duration: 0.4,

                    onComplete: () => {
                        if (index === items.length - 1) {
                            gsap.set(rollingList, { y: 0 });
                            index = 0;
                        }
                    }
                });
            }
        });
    },

    toggleWholeView() {
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
    },

    mainBannerSlide() {
        const section = document.querySelector('.main-banner-slide');

        let swiper = new Swiper(".main-banner-swiper", {
            loop: true,
            speed: 500,

            // autoplay: {
            //     delay: 2000
            // },

            pagination: {
                el: section.querySelector('.swiper-pagination'),
                type: "fraction",

                renderFraction(currentClass, totalClass) {
                    return `
                        <span class="${currentClass}"></span>
                        <span>/</span>
                        <span class="${totalClass}"></span>
                        <span>+</span>
                    `;
                },
            },

            navigation: {
                nextEl: section.querySelector('.swiper-button-next'),
                prevEl: section.querySelector('.swiper-button-prev'),
            }

            
        });
    }

};