/* =========================================================
   مكتبة رائف - إدارة المنتجات
   ========================================================= */


/* =========================
   عناصر الصفحة
========================= */

const productsList =
    document.getElementById("productsList");

const addProductBtn =
    document.getElementById("addProductBtn");

const productImage =
    document.getElementById("productImage");


/* =========================
   جلب المنتجات
========================= */

let products =
    JSON.parse(
        localStorage.getItem("raefProducts")
    ) || [
        {
            id: 1,
            name: "كراسة 100 ورقة",
            price: 35,
            category: "أدوات مدرسية"
        },
        {
            id: 2,
            name: "قلم أزرق",
            price: 10,
            category: "أدوات مدرسية"
        },
        {
            id: 3,
            name: "شاحن موبايل",
            price: 150,
            category: "إكسسوارات الموبايل"
        }
    ];


/* =========================
   الأقسام
========================= */

let categories =
    JSON.parse(
        localStorage.getItem("raefCategories")
    );

if (
    !Array.isArray(categories) ||
    categories.length === 0
) {

    categories = [
        "أدوات مدرسية",
        "مستلزمات مكتبية",
        "إكسسوارات الموبايل",
        "العناية الشخصية",
        "العطور",
        "منتجات متنوعة"
    ];

    localStorage.setItem(
        "raefCategories",
        JSON.stringify(categories)
    );

}


/* =========================
   حفظ المنتجات
========================= */

function saveProducts() {

    try {

        localStorage.setItem(
            "raefProducts",
            JSON.stringify(products)
        );

        return true;

    } catch (error) {

        console.error(error);

        alert(
            "⚠️ مساحة التخزين ممتلئة.\n\n" +
            "احذف بعض المنتجات القديمة ثم حاول مرة أخرى."
        );

        return false;
    }

}


/* =========================================================
   أدوات الصورة
========================================================= */


/* =========================
   إعدادات الصورة الافتراضية
========================= */

function getImageSettings(product) {

    return {

        x:
            Number(
                product?.imageSettings?.x
            ) || 0,

        y:
            Number(
                product?.imageSettings?.y
            ) || 0,

        scale:
            Number(
                product?.imageSettings?.scale
            ) || 1

    };

}


/* =========================
   ضغط الصورة
========================= */

function compressImage(
    file,
    callback
) {

    const reader =
        new FileReader();

    reader.onload =
        function (event) {

            const img =
                new Image();

            img.onload =
                function () {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    const maxSize = 700;

                    let width =
                        img.width;

                    let height =
                        img.height;


                    if (
                        width > maxSize ||
                        height > maxSize
                    ) {

                        const ratio =
                            Math.min(
                                maxSize / width,
                                maxSize / height
                            );

                        width =
                            Math.round(
                                width * ratio
                            );

                        height =
                            Math.round(
                                height * ratio
                            );

                    }


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    context.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );


                    const compressedImage =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.6
                        );


                    callback(
                        compressedImage
                    );

                };


            img.src =
                event.target.result;

        };


    reader.readAsDataURL(
        file
    );

}


/* =========================
   تطبيق إعدادات الصورة
========================= */

function applyImageSettings(
    image,
    settings
) {

    image.style.transform =
        `
        translate(
            ${settings.x}px,
            ${settings.y}px
        )
        scale(
            ${settings.scale}
        )
        `;

}


/* =========================================================
   نافذة تعديل الصورة
========================================================= */

function openImageEditor(
    imageSrc,
    initialSettings,
    callback
) {

    let settings = {

        x:
            Number(initialSettings?.x) || 0,

        y:
            Number(initialSettings?.y) || 0,

        scale:
            Number(initialSettings?.scale) || 1

    };


    /* =========================
       الخلفية
    ========================= */

    const overlay =
        document.createElement("div");

    overlay.className =
        "image-editor-overlay";


    overlay.innerHTML = `

        <div class="image-editor">

            <div class="image-editor-header">

                <h2>
                    🖼️ ضبط صورة المنتج
                </h2>

                <button
                    type="button"
                    class="image-editor-close"
                    id="closeImageEditor"
                >
                    ✕
                </button>

            </div>


            <div class="image-preview">

                <img
                    id="editorPreviewImage"
                    src="${imageSrc}"
                    alt="معاينة المنتج"
                >

            </div>


            <div class="image-controls">


                <div class="control-group">

                    <label>
                        ↔️ يمين / شمال
                    </label>

                    <input
                        type="range"
                        id="imageX"
                        min="-100"
                        max="100"
                        value="${settings.x}"
                    >

                    <span id="imageXValue">
                        ${settings.x}px
                    </span>

                </div>


                <div class="control-group">

                    <label>
                        ↕️ فوق / تحت
                    </label>

                    <input
                        type="range"
                        id="imageY"
                        min="-100"
                        max="100"
                        value="${settings.y}"
                    >

                    <span id="imageYValue">
                        ${settings.y}px
                    </span>

                </div>


                <div class="control-group">

                    <label>
                        🔍 تكبير / تصغير
                    </label>

                    <input
                        type="range"
                        id="imageScale"
                        min="0.5"
                        max="1.8"
                        step="0.05"
                        value="${settings.scale}"
                    >

                    <span id="imageScaleValue">
                        ${settings.scale.toFixed(2)}x
                    </span>

                </div>


            </div>


            <div class="image-editor-buttons">

                <button
                    type="button"
                    id="resetImageSettings"
                    class="reset-image-btn"
                >
                    🔄 إعادة ضبط
                </button>

                <button
                    type="button"
                    id="saveImageSettings"
                    class="save-image-btn"
                >
                    ✅ حفظ الصورة
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const preview =
        overlay.querySelector(
            "#editorPreviewImage"
        );

    const xInput =
        overlay.querySelector(
            "#imageX"
        );

    const yInput =
        overlay.querySelector(
            "#imageY"
        );

    const scaleInput =
        overlay.querySelector(
            "#imageScale"
        );

    const xValue =
        overlay.querySelector(
            "#imageXValue"
        );

    const yValue =
        overlay.querySelector(
            "#imageYValue"
        );

    const scaleValue =
        overlay.querySelector(
            "#imageScaleValue"
        );


    /* =========================
       تحديث الصورة
    ========================= */

    function updatePreview() {

        applyImageSettings(
            preview,
            settings
        );


        xValue.textContent =
            settings.x + "px";

        yValue.textContent =
            settings.y + "px";

        scaleValue.textContent =
            settings.scale.toFixed(2) + "x";

    }


    updatePreview();


    /* =========================
       تحريك يمين / شمال
    ========================= */

    xInput.addEventListener(
        "input",
        function () {

            settings.x =
                Number(
                    this.value
                );

            updatePreview();

        }
    );


    /* =========================
       تحريك فوق / تحت
    ========================= */

    yInput.addEventListener(
        "input",
        function () {

            settings.y =
                Number(
                    this.value
                );

            updatePreview();

        }
    );


    /* =========================
       تكبير / تصغير
    ========================= */

    scaleInput.addEventListener(
        "input",
        function () {

            settings.scale =
                Number(
                    this.value
                );

            updatePreview();

        }
    );


    /* =========================
       إعادة الضبط
    ========================= */

    overlay
        .querySelector(
            "#resetImageSettings"
        )
        .addEventListener(
            "click",
            function () {

                settings = {

                    x: 0,

                    y: 0,

                    scale: 1

                };


                xInput.value =
                    0;

                yInput.value =
                    0;

                scaleInput.value =
                    1;

                updatePreview();

            }
        );


    /* =========================
       إغلاق
    ========================= */

    function closeEditor() {

        overlay.remove();

    }


    overlay
        .querySelector(
            "#closeImageEditor"
        )
        .addEventListener(
            "click",
            closeEditor
        );


    /* =========================
       حفظ
    ========================= */

    overlay
        .querySelector(
            "#saveImageSettings"
        )
        .addEventListener(
            "click",
            function () {

                callback({

                    x:
                        settings.x,

                    y:
                        settings.y,

                    scale:
                        settings.scale

                });


                closeEditor();

            }
        );

}


/* =========================================================
   عرض المنتجات
========================================================= */

function displayProducts() {

    productsList.innerHTML = "";


    products.forEach(
        function (product) {

            const productCard =
                document.createElement("div");

            productCard.className =
                "admin-product-card";


            const imageSettings =
                getImageSettings(
                    product
                );


            productCard.innerHTML = `

                <div>

                    ${
                        product.image
                            ? `

                                <div
                                    class="admin-product-image"
                                    style="
                                        overflow:hidden;
                                        position:relative;
                                    "
                                >

                                    <img
                                        src="${product.image}"
                                        alt="${product.name}"
                                        style="
                                            transform:
                                            translate(
                                                ${imageSettings.x}px,
                                                ${imageSettings.y}px
                                            )
                                            scale(
                                                ${imageSettings.scale}
                                            );
                                        "
                                    >

                                </div>

                              `
                            : ""
                    }


                    <h3>
                        ${product.name}
                    </h3>


                    <p>

                        السعر:
                        ${product.price}
                        جنيه

                    </p>


                    <span>
                        ${product.category}
                    </span>


                    ${
                        product.image
                            ? `

                                <small
                                    style="
                                        display:block;
                                        margin-top:8px;
                                        color:#777;
                                    "
                                >
                                    📐
                                    X:
                                    ${imageSettings.x}px
                                    |
                                    Y:
                                    ${imageSettings.y}px
                                    |
                                    ${imageSettings.scale.toFixed(2)}x
                                </small>

                              `
                            : ""
                    }

                </div>


                <div class="product-actions">

                    <button
                        class="edit-product"
                        data-id="${product.id}"
                        type="button"
                    >
                        ✏️ تعديل
                    </button>


                    <button
                        class="delete-product"
                        data-id="${product.id}"
                        type="button"
                    >
                        🗑️ حذف
                    </button>

                </div>

            `;


            productsList.appendChild(
                productCard
            );

        }
    );

}


/* =========================================================
   إضافة منتج
========================================================= */

addProductBtn.addEventListener(
    "click",
    function () {

        productImage.value = "";

        productImage.click();

    }
);


/* =========================================================
   بعد اختيار الصورة
========================================================= */

productImage.addEventListener(
    "change",
    function () {

        const file =
            productImage.files[0];

        if (!file) {
            return;
        }


        /* =========================
           اسم المنتج
        ========================= */

        const name =
            prompt(
                "اكتب اسم المنتج:"
            );


        if (
            !name ||
            name.trim() === ""
        ) {

            return;

        }


        /* =========================
           السعر
        ========================= */

        const price =
            prompt(
                "اكتب سعر المنتج:"
            );


        if (!price) {
            return;
        }


        const priceNumber =
            Number(price);


        if (
            isNaN(priceNumber) ||
            priceNumber <= 0
        ) {

            alert(
                "من فضلك اكتب سعرًا صحيحًا."
            );

            return;

        }


        /* =========================
           اختيار القسم
        ========================= */

        let categoryMessage =
            "اختر رقم القسم:\n\n";


        categories.forEach(
            function (
                category,
                index
            ) {

                categoryMessage +=
                    (index + 1) +
                    " - " +
                    category +
                    "\n";

            }
        );


        const categoryNumber =
            prompt(
                categoryMessage
            );


        if (!categoryNumber) {
            return;
        }


        const categoryIndex =
            Number(categoryNumber) - 1;


        if (
            isNaN(categoryIndex) ||
            categoryIndex < 0 ||
            categoryIndex >= categories.length
        ) {

            alert(
                "رقم القسم غير صحيح."
            );

            return;

        }


        const category =
            categories[
                categoryIndex
            ];


        /* =========================
           ضغط الصورة
        ========================= */

        compressImage(
            file,
            function (
                compressedImage
            ) {

                /* =========================
                   فتح محرر الصورة
                ========================= */

                openImageEditor(
                    compressedImage,
                    {
                        x: 0,
                        y: 0,
                        scale: 1
                    },
                    function (
                        imageSettings
                    ) {

                        const newProduct = {

                            id:
                                Date.now(),

                            name:
                                name.trim(),

                            price:
                                priceNumber,

                            category:
                                category,

                            image:
                                compressedImage,

                            imageSettings:
                                imageSettings

                        };


                        products.push(
                            newProduct
                        );


                        const saved =
                            saveProducts();


                        if (!saved) {

                            products.pop();

                            return;

                        }


                        displayProducts();


                        alert(
                            "✅ تم إضافة المنتج بنجاح"
                        );

                    }
                );

            }
        );

    }
);


/* =========================================================
   حذف المنتج
========================================================= */

productsList.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "delete-product"
            )
        ) {

            const productId =
                Number(
                    event.target.dataset.id
                );


            const confirmDelete =
                confirm(
                    "هل أنت متأكد من حذف هذا المنتج؟"
                );


            if (!confirmDelete) {
                return;
            }


            products =
                products.filter(
                    function (
                        product
                    ) {

                        return (
                            product.id !==
                            productId
                        );

                    }
                );


            saveProducts();

            displayProducts();

        }

    }
);


/* =========================================================
   تعديل المنتج
========================================================= */

productsList.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList.contains(
                "edit-product"
            )
        ) {

            return;

        }


        const productId =
            Number(
                event.target.dataset.id
            );


        const product =
            products.find(
                function (
                    item
                ) {

                    return (
                        item.id ===
                        productId
                    );

                }
            );


        if (!product) {
            return;
        }


        /* =========================
           الاسم
        ========================= */

        const newName =
            prompt(
                "اسم المنتج:",
                product.name
            );


        if (!newName) {
            return;
        }


        /* =========================
           السعر
        ========================= */

        const newPrice =
            prompt(
                "سعر المنتج:",
                product.price
            );


        if (!newPrice) {
            return;
        }


        const newPriceNumber =
            Number(newPrice);


        if (
            isNaN(newPriceNumber) ||
            newPriceNumber <= 0
        ) {

            alert(
                "السعر غير صحيح."
            );

            return;

        }


        /* =========================
           القسم
        ========================= */

        let categoryMessage =
            "اختر رقم القسم:\n\n";


        categories.forEach(
            function (
                category,
                index
            ) {

                categoryMessage +=
                    (index + 1) +
                    " - " +
                    category +
                    "\n";

            }
        );


        const currentCategory =
            categories.indexOf(
                product.category
            );


        const categoryNumber =
            prompt(
                categoryMessage,
                currentCategory >= 0
                    ? currentCategory + 1
                    : 1
            );


        if (!categoryNumber) {
            return;
        }


        const categoryIndex =
            Number(categoryNumber) - 1;


        if (
            isNaN(categoryIndex) ||
            categoryIndex < 0 ||
            categoryIndex >= categories.length
        ) {

            alert(
                "رقم القسم غير صحيح."
            );

            return;

        }


        product.name =
            newName.trim();


        product.price =
            newPriceNumber;


        product.category =
            categories[
                categoryIndex
            ];


        /* =========================
           تعديل الصورة
        ========================= */

        if (product.image) {

            openImageEditor(
                product.image,
                getImageSettings(
                    product
                ),
                function (
                    imageSettings
                ) {

                    product.imageSettings =
                        imageSettings;


                    if (
                        saveProducts()
                    ) {

                        displayProducts();

                        alert(
                            "✅ تم تعديل المنتج والصورة بنجاح"
                        );

                    }

                }
            );

        } else {

            if (
                saveProducts()
            ) {

                displayProducts();

                alert(
                    "✅ تم تعديل المنتج بنجاح"
                );

            }

        }

    }
);


/* =========================================================
   إضافة CSS الخاص بمحرر الصورة
========================================================= */

const imageEditorStyle =
    document.createElement(
        "style"
    );


imageEditorStyle.textContent = `

    /* =========================
       خلفية المحرر
    ========================= */

    .image-editor-overlay {

        position: fixed;

        inset: 0;

        background:
            rgba(0, 0, 0, 0.65);

        display: flex;

        align-items: center;

        justify-content: center;

        padding: 20px;

        z-index: 99999;

        overflow-y: auto;

    }


    /* =========================
       نافذة المحرر
    ========================= */

    .image-editor {

        width: min(
            500px,
            100%
        );

        max-height: 95vh;

        overflow-y: auto;

        background: #ffffff;

        border-radius: 22px;

        padding: 20px;

        box-shadow:
            0 25px 70px
            rgba(0,0,0,0.3);

    }


    /* =========================
       الهيدر
    ========================= */

    .image-editor-header {

        display: flex;

        align-items: center;

        justify-content: space-between;

        margin-bottom: 18px;

    }


    .image-editor-header h2 {

        margin: 0;

        color: #247a4a;

        font-size: 20px;

    }


    .image-editor-close {

        width: 38px;

        height: 38px;

        border: none;

        border-radius: 50%;

        background: #f1f1f1;

        cursor: pointer;

        font-size: 18px;

    }


    /* =========================
       المعاينة
    ========================= */

    .image-preview {

        width: 100%;

        height: 280px;

        background:
            #f4f6f5;

        border-radius: 18px;

        display: flex;

        align-items: center;

        justify-content: center;

        overflow: hidden;

        border:
            1px solid #e3e8e5;

        margin-bottom: 22px;

    }


    .image-preview img {

        max-width: 80%;

        max-height: 80%;

        object-fit: contain;

        transition:
            transform 0.1s ease;

    }


    /* =========================
       التحكم
    ========================= */

    .image-controls {

        display: flex;

        flex-direction: column;

        gap: 18px;

    }


    .control-group {

        display: grid;

        grid-template-columns:
            120px 1fr 65px;

        align-items: center;

        gap: 10px;

    }


    .control-group label {

        font-weight: bold;

        color: #333;

        font-size: 14px;

    }


    .control-group input[type="range"] {

        width: 100%;

        accent-color:
            #247a4a;

        cursor: pointer;

    }


    .control-group span {

        text-align: center;

        color: #247a4a;

        font-size: 13px;

        font-weight: bold;

    }


    /* =========================
       الأزرار
    ========================= */

    .image-editor-buttons {

        display: flex;

        gap: 10px;

        margin-top: 25px;

    }


    .image-editor-buttons button {

        flex: 1;

        min-height: 45px;

        border: none;

        border-radius: 12px;

        cursor: pointer;

        font-weight: bold;

        font-size: 14px;

    }


    .reset-image-btn {

        background:
            #f0f0f0;

        color: #444;

    }


    .save-image-btn {

        background:
            #247a4a;

        color: white;

    }


    .save-image-btn:hover {

        background:
            #1d633c;

    }


    /* =========================
       الموبايل
    ========================= */

    @media (
        max-width: 600px
    ) {

        .image-editor {

            padding: 15px;

            border-radius: 18px;

        }


        .image-preview {

            height: 240px;

        }


        .control-group {

            grid-template-columns:
                1fr;

            gap: 6px;

        }


        .control-group span {

            text-align: right;

        }


        .image-editor-buttons {

            flex-direction: column;

        }

    }

`;


document.head.appendChild(
    imageEditorStyle
);


/* =========================================================
   تشغيل الصفحة
========================================================= */

displayProducts();