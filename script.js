// ===============================
// Mobile Menu
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navbar = document.querySelector(".navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});


// ===============================
// Close Menu After Clicking Link
// ===============================

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
});


// ===============================
// Section Reveal Animation
// ===============================

const sections = document.querySelectorAll(".section");

const revealSections = () => {

    sections.forEach(section => {

        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            section.classList.add("show");
        }

    });

};

window.addEventListener("scroll", revealSections);

revealSections();


// ===============================
// Skills Animation
// ===============================

const skillsSection = document.querySelector(".skills");
const progressBars = document.querySelectorAll(".progress");
const percentages = document.querySelectorAll(".percentage");


// التأكد أن قسم المهارات موجود
if (skillsSection) {

    const skillsObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    progressBars.forEach((bar, index) => {

                        // الحصول على النسبة من HTML
                        const target = parseInt(bar.dataset.width);

                        // تحريك شريط المهارة
                        bar.style.width = target + "%";


                        // تحريك الرقم
                        const percentage = percentages[index];

                        if (percentage) {

                            let current = 0;

                            const counter = setInterval(() => {

                                current++;

                                percentage.textContent = current + "%";


                                // إيقاف العداد عند الوصول للنسبة النهائية
                                if (current >= target) {

                                    clearInterval(counter);

                                }

                            }, 20);

                        }

                    });


                    // تشغيل الأنيميشن مرة واحدة فقط
                    skillsObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.3
        }
    );


    skillsObserver.observe(skillsSection);

}