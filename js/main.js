document.addEventListener('DOMContentLoaded', () => {
    mainView.popularkeyword();
});

const mainView = {
    writeBtn() {
        
    },

    popularkeyword() {
        const list = document.querySelector(".rank-list");
        const items = document.querySelectorAll(".rank-list li");

        const itemHeight = items[0].offsetHeight;

        let index = 0;

        setInterval(() => {
            index++;

            gsap.to(list, {
                y: -(index * itemHeight),
                duration: 0.4,

                onComplete: () => {
                    // 마지막이면 리셋
                    if (index === (items.length - 1)) {
                        gsap.set(list, { y: 0 });
                        index = 0;
                    }
                }
            });
        }, 2000);
    }

};