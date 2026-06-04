document.addEventListener('DOMContentLoaded', () => {
    mainView.toggleCategory();
    mainView.toggleHeaderBottomScroll();
    mainView.renderKeywordRankList();
    mainView.rollingKeyword();
    mainView.toggleWholeView();
    mainView.initMainBannerSwiper();
    mainView.initRecommendInteriorSwiper();
    mainView.initCartegorySwiper();
});


const mainView = {
    // .write-category 토글
    toggleCategory() {
        const btn = document.querySelector('.write-btn');
        const category = document.querySelector('.write-category');

        btn.addEventListener('click', () => {
            category.classList.toggle('active');
        });

        // 배경 클릭시 닫기
        document.addEventListener('click', (e) => {
            if (!category.contains(e.target) && !btn.contains(e.target)) {
                category.classList.remove('active');
            };
        });
    },

    // 스크롤, 호버시 .hd-bottom 토글
    toggleHeaderBottomScroll() {
        const header = document.querySelector('header');
        const hdBottom = document.querySelector('.hd-bottom');

        // hover
        let isHovered = false;
        let wasHideBeforeHover = false;

        header.addEventListener('mouseenter', () => {
            isHovered = true;
            wasHideBeforeHover = hdBottom.classList.contains('hide');

            hdBottom.classList.remove('hide');
        });

        header.addEventListener('mouseleave', () => {
            isHovered = false;

            if (wasHideBeforeHover || isscrollDown) hdBottom.classList.add('hide');
        });

        // scroll
        let lastScroll = 0;
        let isscrollDown = false;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            isscrollDown = currentScroll > lastScroll;

            hdBottom.classList.toggle('hide' , currentScroll > lastScroll && !isHovered); // 스크롤 내리면 숨기기
            
            lastScroll = currentScroll;
        });
    },

    // .keyword-rank-list 동적 삽입
    renderKeywordRankList() {
        const rollingList = document.querySelector('.keyword-rolling-view .keyword-rank-list');
        const wholeList = document.querySelector('.keyword-whole-view .keyword-rank-list');

        // 데이터 가공
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

        // 렌더링
        // rollingList 렌더링
        rollingList.innerHTML = innerItems + `
            <li>
                <span class="rank">1</span>
                <span class="keyword">${keywordArr[0]}</span>
            </li>
        `;

        // wholeList 렌더링
        wholeList.innerHTML = innerItems;
    },

    // 인기 검색어 루프
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

    // .keyword-whole-view 토글
    toggleWholeView() {
        const btn = document.querySelector('.whole-view-btn');
        const view = document.querySelector('.keyword-whole-view');

        btn.addEventListener('click', () => {
            view.classList.toggle('active');
        });

        // 배경 클릭시 닫기
        document.addEventListener('click', (e) => {
            if(!view.contains(e.target)&&!btn.contains(e.target)) {
                view.classList.remove('active');
            };
        });
    },

    // mainBannerSwiper 초기화
    initMainBannerSwiper() {
        const section = document.querySelector('.main-banner-slider');
        const nextBtn = section.querySelector('.swiper-button-next');
        const prevBtn = section.querySelector('.swiper-button-prev');

        let mainBannerSwiper = new Swiper('.main-banner-swiper', {
            loop: true,
            speed: 500,

            autoplay: {
                delay: 2000
            },

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
                nextEl: nextBtn,
                prevEl: prevBtn,
            }
        });
    },

    // recommendInteriorSwiper 초기화
    initRecommendInteriorSwiper() {
        const slider = document.querySelector('.recommend-interior-slider');
        const nextBtn = slider.querySelector('.swiper-button-next');
        const prevBtn = slider.querySelector('.swiper-button-prev');

        const perView = 6;

        // 초기화
        let recommendInteriorSwiper = new Swiper('.recommend-interior-swiper', {
            slidesPerView: perView,
            spaceBetween: 20
        });

        // 네비게이션 버튼 옵션 없으므로 disabled 직접 넣어주기
        const updateNav = () => {
            prevBtn.classList.toggle('disabled', recommendInteriorSwiper.isBeginning);
            nextBtn.classList.toggle('disabled', recommendInteriorSwiper.isEnd);
        };

        updateNav();

        // 네비게이션 버튼 옵션 없애고 이벤트 직접 구현
        // slidesPerView 개수 모자르면 앞 페이지 슬라이드 끌고와서 개수 채우기. 무조건 slidesPerView 개수대로 띄움
        nextBtn.addEventListener('click', () => {
            const lastPageStartIdx = recommendInteriorSwiper.slides.length - perView;
            const nextStartIndex = recommendInteriorSwiper.activeIndex + perView;

            recommendInteriorSwiper.slideTo(
                Math.min(nextStartIndex, lastPageStartIdx) // 다음 페이지가 마지막 페이지면 lastPageStartIdx로 이동하고 아니면 현재 슬라이드에서 perView 더한 만큼 이동
            );

            updateNav();
        });

        prevBtn.addEventListener('click', () => {
            const prevStartIndex = recommendInteriorSwiper.activeIndex - perView;

            recommendInteriorSwiper.slideTo(
                Math.max(prevStartIndex, 0) // 이전 페이지가 첫 페이지면 0으로 이동하고 아니면 perView 뺀 만큼 이동
            );

            updateNav();
        });
    },

    initCartegorySwiper() {
        const slider = document.querySelector('.cartegory-swiper-slider');
        const nextBtn = slider.querySelector('.swiper-button-next');
        const prevBtn = slider.querySelector('.swiper-button-prev');

        // 초기화
        let cartegorySwiper = new Swiper('.cartegory-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 12
        });

        // 네비게이션 버튼 옵션 없으므로 disabled 직접 넣어주기
        const updateNav = () => {
            prevBtn.classList.toggle('disabled', cartegorySwiper.isBeginning);
            nextBtn.classList.toggle('disabled', cartegorySwiper.isEnd);
        };

        updateNav();

        // 네비게이션 버튼 옵션 없애고 이벤트 직접 구현
        // 무조건 한 줄에 슬라이드 꽉 채우기 슬라이드 모자르면 앞 페이지 슬라이드 끌고와서 채우기
        nextBtn.addEventListener('click', () => {
            const nextTranslate = cartegorySwiper.translate - cartegorySwiper.width;

            cartegorySwiper.translateTo(
                Math.max(nextTranslate, cartegorySwiper.maxTranslate()),
                300
            );

            updateNav();
        });

        prevBtn.addEventListener('click', () => {
            const prevTranslate = cartegorySwiper.translate + cartegorySwiper.width;

            cartegorySwiper.translateTo(
                Math.min(prevTranslate, cartegorySwiper.minTranslate()),
                300
            );

            updateNav();
        });
    }

};