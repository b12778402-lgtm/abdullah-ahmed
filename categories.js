/* =========================
   عناصر الصفحة
========================= */

const categoriesList =
    document.getElementById("categoriesList");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");


/* =========================
   جلب الأقسام المحفوظة
========================= */

let categories =
    JSON.parse(
        localStorage.getItem("raefCategories")
    ) || [

        "أدوات مدرسية",
        "مستلزمات مكتبية",
        "إكسسوارات الموبايل",
        "العناية الشخصية",
        "العطور",
        "منتجات متنوعة"

    ];


/* =========================
   حفظ الأقسام
========================= */

function saveCategories() {

    localStorage.setItem(
        "raefCategories",
        JSON.stringify(categories)
    );

}


/* =========================
   عرض الأقسام
========================= */

function displayCategories() {

    categoriesList.innerHTML = "";


    categories.forEach(
        function (category, index) {

            const categoryCard =
                document.createElement("div");


            categoryCard.className =
                "category-admin-card";


            categoryCard.innerHTML = `

                <div class="category-info">

                    <span class="category-icon">
                        🏷️
                    </span>

                    <h3>
                        ${category}
                    </h3>

                </div>


                <div class="category-actions">

                    <button
                        class="edit-category"
                        data-index="${index}">
                        ✏️ تعديل
                    </button>


                    <button
                        class="delete-category"
                        data-index="${index}">
                        🗑️ حذف
                    </button>

                </div>

            `;


            categoriesList.appendChild(
                categoryCard
            );

        }
    );

}


/* =========================
   إضافة قسم
========================= */

addCategoryBtn.addEventListener(
    "click",
    function () {

        const categoryName =
            prompt(
                "اكتب اسم القسم الجديد:"
            );


        if (!categoryName) {
            return;
        }


        const trimmedName =
            categoryName.trim();


        if (trimmedName === "") {
            return;
        }


        /* التأكد أن القسم غير موجود */

        const exists =
            categories.some(
                function (category) {

                    return (
                        category ===
                        trimmedName
                    );

                }
            );


        if (exists) {

            alert(
                "هذا القسم موجود بالفعل."
            );

            return;

        }


        categories.push(
            trimmedName
        );


        saveCategories();


        displayCategories();

    }
);


/* =========================
   تعديل القسم
========================= */

categoriesList.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "edit-category"
            )
        ) {

            const index =
                Number(
                    event.target.dataset.index
                );


            const oldName =
                categories[index];


            const newName =
                prompt(
                    "اسم القسم:",
                    oldName
                );


            if (!newName) {
                return;
            }


            const trimmedName =
                newName.trim();


            if (trimmedName === "") {
                return;
            }


            categories[index] =
                trimmedName;


            saveCategories();


            displayCategories();

        }

    }
);


/* =========================
   حذف القسم
========================= */

categoriesList.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "delete-category"
            )
        ) {

            const index =
                Number(
                    event.target.dataset.index
                );


            const confirmDelete =
                confirm(
                    "هل أنت متأكد من حذف هذا القسم؟"
                );


            if (!confirmDelete) {
                return;
            }


            categories.splice(
                index,
                1
            );


            saveCategories();


            displayCategories();

        }

    }
);


/* =========================
   تشغيل الصفحة
========================= */

displayCategories();