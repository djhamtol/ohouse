document.addEventListener('DOMContentLoaded', () => {
    mainView.toggleWriteCategory();
    mainView.toggleHeaderBottomScroll();
    mainView.renderKeywordRankList();
    mainView.rollingKeyword();
    mainView.positionKeywordPanel();
    mainView.toggleKeywordPanel();
    mainView.initMainBannerSwiper();
    mainView.initRecommendInteriorSwiper();
    mainView.initCartegorySwiper();
    mainView.initTodayDealSwiper();
    mainView.renderTodayDealCountDown();
    mainView.toggleMobilePanel();
    mainView.toggleMobileGnbSub();
});

const util = {
    updateExpanded(el , toggle) {
        const isOpen = el.classList.contains('active');

        toggle.setAttribute('aria-expanded', isOpen);
    }
}

const mainView = {
    // .write__category 토글
    toggleWriteCategory() {
        const toggle = document.querySelector('.write__toggle');
        const category = document.querySelector('.write__category');

        toggle.addEventListener('click', () => {
            category.classList.toggle('active');
            util.updateExpanded(category, toggle);
        });

        // 배경 클릭시 닫기
        document.addEventListener('click', (e) => {
            if (!category.contains(e.target) && !toggle.contains(e.target)) {
                category.classList.remove('active');
                util.updateExpanded(category, toggle);
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

            if (wasHideBeforeHover || isScrollDown) hdBottom.classList.add('hide');
        });

        // scroll
        let lastScroll = 0;
        let isScrollDown = false;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            isScrollDown = currentScroll > lastScroll;

            hdBottom.classList.toggle('hide' , currentScroll > lastScroll && !isHovered); // 스크롤 내리면 숨기기
            if (window.matchMedia('(max-width: 768px)').matches) {
                header.classList.toggle('hide' , currentScroll > lastScroll);
            }
            
            lastScroll = currentScroll;
        });
    },

    // .popular-keyword__rank-list 동적 삽입
    renderKeywordRankList() {
        const rollingList = document.querySelector('.popular-keyword__rolling-view .popular-keyword__rank-list');
        const panelList = document.querySelector('.popular-keyword__panel .popular-keyword__rank-list');
        const moList = document.querySelector('.popular-keyword--mo .popular-keyword__rank-list');

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

        // panelList 렌더링
        panelList.innerHTML = innerItems;

        // moList 렌더링 (모바일)
        moList.innerHTML = innerItems;
    },

    // 인기 검색어 루프
    rollingKeyword() {
        const rollingList = document.querySelector('.popular-keyword__rolling-view .popular-keyword__rank-list');
        const items = document.querySelectorAll('.popular-keyword__rolling-view .popular-keyword__rank-list li');

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

    // .popular-keyword__panel 배치
    positionKeywordPanel() {
        const hdBottom = document.querySelector('.hd-bottom__container');
        const btn = document.querySelector('.popular-keyword__btn');
        const panel = document.querySelector('.popular-keyword__panel');
        const panelBtn = document.querySelector('.panel__btn');

        const updatePosition = () => {
            const btnRect = btn.getBoundingClientRect();
            const panelRight = document.documentElement.clientWidth - btnRect.right;

            panel.style.right = `${Math.max(0, panelRight)}px`;
        };

        updatePosition();
       
        window.addEventListener('resize', updatePosition);
        hdBottom.addEventListener('scroll', updatePosition);
    },

    // .popular-keyword__panel 토글
    toggleKeywordPanel() {
        const btn = document.querySelector('.popular-keyword__btn');
        const panel = document.querySelector('.popular-keyword__panel');
        const panelBtn = document.querySelector('.panel__btn');

        // 열기
        btn.addEventListener('click', () => {
            panel.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        });

        // 닫기
        panelBtn.addEventListener('click', () => {
            panel.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });

        // 배경 클릭시 닫기
        document.addEventListener('click', (e) => {
            if(!panel.contains(e.target) && !btn.contains(e.target)) {
                panel.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            };
        });
    },

    // mainBannerSwiper 초기화
    initMainBannerSwiper() {
        const section = document.querySelector('.main-banner__slider');
        const nextBtn = section.querySelector('.swiper-button-next');
        const prevBtn = section.querySelector('.swiper-button-prev');

        let mainBannerSwiper = new Swiper('.main-banner__swiper', {
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
        const slider = document.querySelector('.recommend-interior__slider');
        const nextBtn = slider.querySelector('.swiper-button-next');
        const prevBtn = slider.querySelector('.swiper-button-prev');

        // const perView = 6;

        // 초기화
        let recommendInteriorSwiper = new Swiper('.recommend-interior__swiper', {
            slidesPerView: 2.5,
            spaceBetween: 20,

            breakpoints: {
                768: {
                    slidesPerView: 4
                },
                1024: {
                    slidesPerView: 6
                }
            }
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
            const perView = recommendInteriorSwiper.params.slidesPerView;
            const lastPageStartIdx = recommendInteriorSwiper.slides.length - perView;
            const nextStartIndex = recommendInteriorSwiper.activeIndex + perView;

            recommendInteriorSwiper.slideTo(
                Math.min(nextStartIndex, lastPageStartIdx) // 다음 페이지가 마지막 페이지면 lastPageStartIdx로 이동하고 아니면 현재 슬라이드에서 perView 더한 만큼 이동
            );

            updateNav();
        });

        prevBtn.addEventListener('click', () => {
            const perView = recommendInteriorSwiper.params.slidesPerView;
            const prevStartIndex = recommendInteriorSwiper.activeIndex - perView;

            recommendInteriorSwiper.slideTo(
                Math.max(prevStartIndex, 0) // 이전 페이지가 첫 페이지면 0으로 이동하고 아니면 perView 뺀 만큼 이동
            );

            updateNav();
        });
    },

    // cartegorySwiper 초기화
    initCartegorySwiper() {
        const slider = document.querySelector('.cartegory__slider');
        const nextBtn = slider.querySelector('.swiper-button-next');
        const prevBtn = slider.querySelector('.swiper-button-prev');

        // 초기화
        let cartegorySwiper = new Swiper('.cartegory__swiper', {
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
    },

    // todayDealSwiper 초기화
    initTodayDealSwiper() {
        const slider = document.querySelector('.today-deal__slider');
        const nextBtn = slider.querySelector('.swiper-button-next');
        const prevBtn = slider.querySelector('.swiper-button-prev');

        const perView = 4;

        // 초기화
        let todayDealSwiper = new Swiper('.today-deal__swiper', {
            slidesPerView: perView,
            spaceBetween: 20,

            breakpoints: {
                0: {
                    enabled: false
                },
                768: {
                    enabled: true
                }
            }
        });

        // 네비게이션 버튼 옵션 없으므로 disabled 직접 넣어주기
        const updateNav = () => {
            prevBtn.classList.toggle('disabled', todayDealSwiper.isBeginning);
            nextBtn.classList.toggle('disabled', todayDealSwiper.isEnd);
        };

        updateNav();

        // 네비게이션 버튼 옵션 없애고 이벤트 직접 구현
        // slidesPerView 개수 모자르면 앞 페이지 슬라이드 끌고와서 개수 채우기. 무조건 slidesPerView 개수대로 띄움
        nextBtn.addEventListener('click', () => {
            const lastPageStartIdx = todayDealSwiper.slides.length - perView;
            const nextStartIndex = todayDealSwiper.activeIndex + perView;

            todayDealSwiper.slideTo(
                Math.min(nextStartIndex, lastPageStartIdx) // 다음 페이지가 마지막 페이지면 lastPageStartIdx로 이동하고 아니면 현재 슬라이드에서 perView 더한 만큼 이동
            );

            updateNav();
        });

        prevBtn.addEventListener('click', () => {
            const prevStartIndex = todayDealSwiper.activeIndex - perView;

            todayDealSwiper.slideTo(
                Math.max(prevStartIndex, 0) // 이전 페이지가 첫 페이지면 0으로 이동하고 아니면 perView 뺀 만큼 이동
            );

            updateNav();
        });
    },

    // today-deal__countdown 렌더링
    renderTodayDealCountDown() {
        const cntDowns = document.querySelectorAll('.today-deal__countdown');

        function updateDealTimer() {
            const remain = new Date().setHours(24, 0, 0, 0) - Date.now();

            const h = Math.floor(remain / 1000 / 60 / 60);
            const m = Math.floor(remain / 1000 / 60 % 60);
            const s = Math.floor(remain / 1000 % 60);

            cntDowns.forEach((cntDown) => {
                cntDown.textContent = `
                    ${String(h).padStart(2, '0')}:
                    ${String(m).padStart(2, '0')}:
                    ${String(s).padStart(2, '0')}
                    남음
                `;
            });
        }

        updateDealTimer();

        // 다음 초가 되는 순간에 맞춤
        setTimeout(() => {
            updateDealTimer();
            setInterval(updateDealTimer, 1000);
        }, 1000 - (Date.now() % 1000));
    },

    // .mobile-panel 토글
    toggleMobilePanel() {
        const toggle = document.querySelector('.hamburger');
        const dim = document.querySelector('.dim');
        const moPanel = document.querySelector('.mobile-panel');
        const header = document.querySelector('header');

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        toggle.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
            header.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            dim.classList.add('active');

            moPanel.classList.add('active');
            util.updateExpanded(moPanel, toggle);
        });

        // 배경 클릭시 닫기
        dim.addEventListener('click', () => {
            document.body.style.overflow = '';
            header.style.paddingRight = '';
            document.body.style.paddingRight = '';

            dim.classList.remove('active');

            moPanel.classList.remove('active');
            util.updateExpanded(moPanel, toggle);
        });
    },

    // .gnb__sub 토글
    toggleMobileGnbSub() {
        const items = document.querySelectorAll('.gnb__item');

        // 서브 메뉴 열기 함수
        const openMenu = (item) => {
            const toggle = item.querySelector('.gnb__toggle');
            const close = item.querySelector('.close');
            const open = item.querySelector('.open');
            const sub = item.querySelector('.gnb__sub');

            item.classList.add('active');
            util.updateExpanded(item, toggle);
            close.hidden = false;
            open.hidden = true;

            gsap.to(sub, {
                height: "auto",
                duration: 0.3
            });
        };

        // 서브 메뉴 닫기 함수
        const closeMenu = (item) => {
            const toggle = item.querySelector('.gnb__toggle');
            const close = item.querySelector('.close');
            const open = item.querySelector('.open');
            const sub = item.querySelector('.gnb__sub');

            item.classList.remove('active');
            util.updateExpanded(item, toggle);
            close.hidden = true;
            open.hidden = false;

            gsap.to(sub, {
                height: 0,
                duration: 0.3
            });
        };

        items.forEach((item, idx) => {
            const toggle = item.querySelector('.gnb__toggle');
            const close = item.querySelector('.gnb__svg .close');
            const open = item.querySelector('.gnb__svg .open');
            const sub = item.querySelector('.gnb__sub');

            // 서브메뉴 초기화
            if (idx === 0) {
                item.classList.add('active');

                gsap.set(sub, {
                    height: "auto"
                });
            } else {
                gsap.set(sub, {
                    height: 0
                });
            }

            util.updateExpanded(item, toggle);

            // 서브메뉴 클릭 이벤트
            toggle.addEventListener('click', () => {
                const activeItem = document.querySelector('.gnb__item.active');

                if (activeItem) {
                    closeMenu(activeItem);

                    if (activeItem !== item) {
                        openMenu(item);
                    }
                } else {
                    openMenu(item);
                }
            });
        });
    }
};