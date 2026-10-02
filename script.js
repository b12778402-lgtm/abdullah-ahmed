// =========================
// الوضع الليلي
// =========================

const themeBtn = document.getElementById("themeBtn");

const savedTheme =
    localStorage.getItem("raefTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");

    if (themeBtn) {
        themeBtn.textContent = "☀️";
    }
}

if (themeBtn) {

    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        if (isDark) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "raefTheme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "raefTheme",
                "light"
            );
        }

    });

}



/* =========================

   القائمة
========================= */

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
    menuBtn.addEventListener("click", function () {
        navbar.classList.toggle("active");

        if (navbar.classList.contains("active")) {
            menuBtn.textContent = "✕";
        } else {
            menuBtn.textContent = "☰";
        }
    });

    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navbar.classList.remove("active");
            menuBtn.textContent = "☰";
        });
    });
}

/* إغلاق القائمة عند اختيار قسم */

const navLinks =
    document.querySelectorAll(".navbar a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navbar.classList.remove("active");

        menuBtn.textContent = "☰";

    });

});


/* =========================
   السلة
========================= */

/* =========================
   السلة
========================= */

const cartBtn =
    document.getElementById("cartBtn");

const cartPanel =
    document.getElementById("cartPanel");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.querySelector(".cart-count");

const cartTotal =
    document.getElementById("cartTotal");

let cart = [];


/* =========================
   فتح السلة
========================= */

function openCart() {

    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.add("show");
    cartOverlay.classList.add("show");

    document.body.style.overflow = "hidden";
}


/* =========================
   إغلاق السلة
========================= */

function closeCartPanel() {

    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove("show");
    cartOverlay.classList.remove("show");

    document.body.style.overflow = "";
}


/* زر السلة */

if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        openCart
    );

}


/* زر الإغلاق */

if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartPanel
    );

}


/* الضغط خارج السلة */

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCartPanel
    );

}


/* =========================
   إضافة منتج للسلة
========================= */

function addProductToCart(name, price) {

    const existingProduct =
        cart.find(function (item) {

            return item.name === name;

        });


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            name: name,
            price: Number(price),
            quantity: 1

        });

    }


    updateCart();


    /* =========================
       رسالة من أعلى الشاشة
    ========================= */

    const topMessage =
        document.getElementById("topMessage");


    if (topMessage) {

        topMessage.classList.add("show");

        clearTimeout(
            window.topMessageTimer
        );

        window.topMessageTimer =
            setTimeout(function () {

                topMessage.classList.remove(
                    "show"
                );

            }, 2000);

    }


    /* =========================
       حركة زر الإضافة
    ========================= */

    const buttons =
        document.querySelectorAll(".add-cart");


    buttons.forEach(function (button) {

        const productCard =
            button.closest(".product-card");


        if (!productCard) {
            return;
        }


        const productName =
            productCard.querySelector("h3");


        if (!productName) {
            return;
        }


        if (
            productName.textContent.trim() ===
            name
        ) {

            const oldText =
                button.textContent;


            button.classList.add("added");

            button.textContent =
                "✓ تمت الإضافة";


            setTimeout(function () {

                button.classList.remove(
                    "added"
                );

                button.textContent =
                    oldText;

            }, 1200);

        }

    });

}


/* =========================
   تحديث السلة
========================= */

function updateCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    let total = 0;
    let count = 0;


    /* =========================
       السلة فارغة
    ========================= */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    السلة فارغة
                </h3>

                <p>
                    أضف بعض المنتجات إلى السلة
                </p>

            </div>

        `;

    }


    /* =========================
       عرض المنتجات
    ========================= */

    cart.forEach(function (item, index) {

        const itemTotal =
            Number(item.price) *
            item.quantity;


        total += itemTotal;

        count += item.quantity;


        const itemElement =
            document.createElement("div");


        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p class="cart-item-price">
                    ${item.price} جنيه
                </p>


                <div class="cart-quantity">

                    <button
                        type="button"
                        class="increase"
                        data-index="${index}">
                        +
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="decrease"
                        data-index="${index}">
                        −
                    </button>

                </div>

            </div>


            <button
                type="button"
                class="cart-remove"
                data-index="${index}"
                title="حذف المنتج">

                🗑️

            </button>

        `;


        cartItems.appendChild(
            itemElement
        );

    });


    /* =========================
       الإجمالي
    ========================= */

    if (cartTotal) {

        cartTotal.textContent =
            total.toFixed(0);

    }


    /* =========================
       عدد المنتجات
    ========================= */

    if (cartCount) {

        cartCount.textContent =
            count;

    }


    /* =========================
       زيادة الكمية
    ========================= */

    document
        .querySelectorAll(".increase")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (cart[index]) {

                        cart[index].quantity++;

                        updateCart();

                    }

                }
            );

        });


    /* =========================
       تقليل الكمية
    ========================= */

    document
        .querySelectorAll(".decrease")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {
                        return;
                    }


                    if (
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(
                            index,
                            1
                        );

                    }


                    updateCart();

                }
            );

        });


    /* =========================
       حذف المنتج
    ========================= */

    document
        .querySelectorAll(".cart-remove")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    cart.splice(
                        index,
                        1
                    );


                    updateCart();

                }
            );

        });

}


/* =========================
   تحميل المنتجات
========================= */

const productsContainer =
    document.getElementById(
        "productsContainer"
    );


let savedProducts = [];


try {

    savedProducts =
        JSON.parse(
            localStorage.getItem(
                "raefProducts"
            )
        ) || [];

} catch (error) {

    savedProducts = [];

}


/* =========================
   المنتجات الافتراضية
========================= */

if (savedProducts.length === 0) {

    savedProducts = [

        {
            id: Date.now() + 1,
            name: "كراسة 100 ورقة",
            price: 35,
            category: "أدوات مدرسية",
            image: ""
        },

        {
            id: Date.now() + 2,
            name: "قلم أزرق",
            price: 10,
            category: "أدوات مدرسية",
            image: ""
        },

        {
            id: Date.now() + 3,
            name: "شاحن موبايل",
            price: 150,
            category: "إكسسوارات الموبايل",
            image: ""
        }

    ];


    localStorage.setItem(
        "raefProducts",
        JSON.stringify(savedProducts)
    );

}


/* =========================
   إنشاء بطاقة المنتج
========================= */

function createProductCard(product) {

    const productCard =
        document.createElement("div");


    productCard.className =
        "product-card";


    productCard.innerHTML = `

        <div class="product-image">

            ${
                product.image

                    ? `
                        <img
                            src="${product.image}"
                            alt="${product.name}">
                      `

                    : `
                        📦
                      `
            }

        </div>


        <h3>
            ${product.name}
        </h3>


        <p class="price">
            ${product.price} جنيه
        </p>


        <button
            class="add-cart"
            type="button">

            🛒 أضف للسلة

        </button>

    `;


    const cartButton =
        productCard.querySelector(
            ".add-cart"
        );


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            function () {

                addProductToCart(
                    product.name,
                    Number(product.price)
                );

            }
        );

    }


    return productCard;

}


/* =========================
   عرض المنتجات
========================= */

function displayProducts(products) {

    if (!productsContainer) {
        return;
    }


    productsContainer.innerHTML = "";


    if (!products || products.length === 0) {

        productsContainer.innerHTML = `

            <div class="no-products">

                <h3>
                    لا توجد منتجات حالياً 📦
                </h3>

                <p>
                    سيتم إضافة المنتجات قريباً
                </p>

            </div>

        `;

        return;
    }


    products.forEach(function (product) {

        const productCard =
            createProductCard(product);


        productsContainer.appendChild(
            productCard
        );

    });

}


/* =========================
   عرض المنتجات عند فتح الموقع
========================= */

displayProducts(
    savedProducts
);


/* =========================
   الأقسام
========================= */

/* =========================
   الأقسام
========================= */

const categoriesContainer =
    document.getElementById("categoriesContainer");

// الأقسام الافتراضية
const defaultCategories = [
    "📚 أدوات مدرسية",
    "🖊️ مستلزمات مكتبية",
    "📱 إكسسوارات الموبايل",
    "🍯 عسل ومنتجات طبيعية",
    "💇 العناية بالشعر",
    "☕ أكواب ومستلزمات منزلية"
];

// قراءة الأقسام المحفوظة
let savedCategories = [];

try {
    savedCategories =
        JSON.parse(
            localStorage.getItem("raefCategories")
        ) || [];
} catch (error) {
    savedCategories = [];
}

// لو مفيش أقسام محفوظة، استخدم الأقسام الافتراضية
if (savedCategories.length === 0) {
    savedCategories = defaultCategories;

    localStorage.setItem(
        "raefCategories",
        JSON.stringify(savedCategories)
    );
}

// عرض الأقسام
if (categoriesContainer) {

    categoriesContainer.innerHTML = "";

    savedCategories.forEach(function (category) {

        const categoryCard =
            document.createElement("div");

        categoryCard.className =
            "category-card";

        categoryCard.style.cursor =
            "pointer";

        categoryCard.innerHTML = `
            <div class="category-icon">
                ${getCategoryIcon(category)}
            </div>

            <h3>
                ${category.replace(
                    "📚 ",
                    ""
                ).replace(
                    "🖊️ ",
                    ""
                ).replace(
                    "📱 ",
                    ""
                ).replace(
                    "🍯 ",
                    ""
                ).replace(
                    "💇 ",
                    ""
                ).replace(
                    "☕ ",
                    ""
                )}
            </h3>
        `;

        categoryCard.addEventListener(
            "click",
            function () {

                const productsSection =
                    document.getElementById(
                        "products"
                    );

                if (productsSection) {

                    productsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

                displayProductsByCategory(
                    category.replace(
                        /^[^\u0000-\u007F]+\s/,
                        ""
                    )
                );

            }
        );

        categoriesContainer.appendChild(
            categoryCard
        );

    });
}


/* =========================
   أيقونة القسم
========================= */

function getCategoryIcon(category) {

    if (category.includes("مدرسية")) {
        return "📚";
    }

    if (category.includes("مكتبية")) {
        return "🖊️";
    }

    if (category.includes("موبايل")) {
        return "📱";
    }

    if (category.includes("عسل")) {
        return "🍯";
    }

    if (category.includes("شعر")) {
        return "💇";
    }

    if (category.includes("أكواب")) {
        return "☕";
    }

    return "📦";
}

/* =========================
   زر كل المنتجات
========================= */

const showAllProducts =
    document.getElementById(
        "showAllProducts"
    );


if (showAllProducts) {

    showAllProducts.addEventListener(
        "click",
        function () {

            displayProducts(
                savedProducts
            );


            document
                .querySelectorAll(
                    ".filter-btn"
                )
                .forEach(function (button) {

                    button.classList.remove(
                        "active"
                    );

                });


            showAllProducts.classList.add(
                "active"
            );

        }
    );

}


/* =========================
   البحث
========================= */

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (
        !searchInput ||
        !productsContainer
    ) {

        return;

    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredProducts =
        savedProducts.filter(
            function (product) {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category || ""
                    ).toLowerCase();


                return (
                    name.includes(searchText) ||
                    category.includes(searchText)
                );

            }
        );


    displayProducts(
        filteredProducts
    );


    const productsSection =
        document.getElementById(
            "products"
        );


    if (productsSection) {

        setTimeout(
            function () {

                productsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            100
        );

    }

}


/* زر البحث */

const searchBtn =
    document.getElementById(
        "searchBtn"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchProducts
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();

            }

        }
    );

}


/* =========================
   العروض
========================= */

const offersContainer =
    document.getElementById(
        "offersContainer"
    );


let savedOffers = [];


try {

    savedOffers =
        JSON.parse(
            localStorage.getItem(
                "raefOffers"
            )
        ) || [];

} catch (error) {

    savedOffers = [];

}


if (
    offersContainer &&
    savedOffers.length > 0
) {

    offersContainer.innerHTML = "";


    savedOffers.forEach(
        function (offer) {

            const offerCard =
                document.createElement("div");


            offerCard.className =
                "offer-card";


            offerCard.innerHTML = `

                <div class="offer-image">

                    ${
                        offer.image

                            ? `
                                <img
                                    src="${offer.image}"
                                    alt="${offer.name}">
                              `

                            : `
                                🔥
                              `
                    }

                </div>


                <div class="offer-content">

                    <h3>
                        ${offer.name}
                    </h3>


                    <div class="offer-prices">

                        <span class="old-price">
                            ${offer.oldPrice} جنيه
                        </span>


                        <strong class="new-price">
                            ${offer.newPrice} جنيه
                        </strong>

                    </div>


                    <span class="offer-discount">
                        خصم ${offer.discount}%
                    </span>

                </div>

            `;


            offersContainer.appendChild(
                offerCard
            );

        }
    );

}


/* =========================
   تهيئة السلة
========================= */

updateCart();



/// ===============================
// إتمام الطلب
// ===============================

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPanel = document.getElementById("checkoutPanel");
const closeCheckout = document.getElementById("closeCheckout");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");

const confirmOrderBtn = document.getElementById("confirmOrder");


// ===============================
// فتح إتمام الطلب
// ===============================

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function () {

        // التأكد أن السلة ليست فارغة
        if (!cart || cart.length === 0) {

            if (typeof showTopMessage === "function") {
                showTopMessage("السلة فارغة 🛒");
            } else {
                alert("السلة فارغة 🛒");
            }

            return;
        }


        // تنظيف ملخص الطلب القديم
        if (checkoutItems) {

            checkoutItems.innerHTML = "";

            cart.forEach(function (item) {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                const div =
                    document.createElement("div");

                div.className = "checkout-item";


                div.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>

                        <small>
                            ${item.quantity} × ${item.price} جنيه
                        </small>
                    </div>

                    <strong>
                        ${itemTotal} جنيه
                    </strong>
                `;


                checkoutItems.appendChild(div);

            });

        }


        // حساب إجمالي الطلب
        const total =
            cart.reduce(function (sum, item) {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            }, 0);


        // عرض الإجمالي
        if (checkoutTotal) {

            checkoutTotal.textContent =
                total + " جنيه";

        }


        // إظهار صفحة إتمام الطلب
        if (checkoutPanel) {

            checkoutPanel.classList.add("active");

        }

    });

}


// ===============================
// إغلاق إتمام الطلب
// ===============================

if (closeCheckout) {

    closeCheckout.addEventListener("click", function () {

        if (checkoutPanel) {

            checkoutPanel.classList.remove("active");

        }

    });

}


// ===============================
// تأكيد الطلب
// ===============================

if (confirmOrderBtn) {

    confirmOrderBtn.addEventListener("click", function () {

        // قراءة الاسم ورقم الهاتف
        const name =
            customerName
                ? customerName.value.trim()
                : "";


        const phone =
            customerPhone
                ? customerPhone.value.trim()
                : "";


        // التحقق من الاسم
        if (name === "") {

            alert("من فضلك اكتب اسمك");

            if (customerName) {
                customerName.focus();
            }

            return;
        }


        // التحقق من رقم الهاتف
        if (phone === "") {

            alert("من فضلك اكتب رقم الهاتف");

            if (customerPhone) {
                customerPhone.focus();
            }

            return;
        }


        // التحقق من السلة
        if (!cart || cart.length === 0) {

            alert("السلة فارغة 🛒");

            return;
        }


        // حساب الإجمالي
        const total =
            cart.reduce(function (sum, item) {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            }, 0);


        // إنشاء نسخة آمنة من المنتجات
        const products =
            cart.map(function (item) {

                return {
                    name: item.name,
                    price: Number(item.price),
                    quantity: Number(item.quantity)
                };

            });


        // إنشاء الطلب
        const order = {

            id: Date.now(),

            customerName: name,

            customerPhone: phone,

            products: products,

            total: total,

            date: new Date().toLocaleString("ar-EG"),

            status: "جديد"

        };


        // تحميل الطلبات القديمة
        let orders = [];

        try {

            orders =
                JSON.parse(
                    localStorage.getItem("raefOrders")
                ) || [];

        } catch (error) {

            orders = [];

        }


        // إضافة الطلب الجديد
        orders.push(order);


        // حفظ الطلبات
        localStorage.setItem(
            "raefOrders",
            JSON.stringify(orders)
        );


        // رسالة نجاح
        alert("✅ تم تأكيد الطلب بنجاح");


        // تفريغ السلة
        cart = [];


        // حفظ السلة الجديدة
        localStorage.setItem(
            "raefCart",
            JSON.stringify(cart)
        );


        // تحديث السلة
        updateCart();


        // إغلاق صفحة إتمام الطلب
        if (checkoutPanel) {

            checkoutPanel.classList.remove("active");

        }


        // تنظيف بيانات العميل
        if (customerName) {

            customerName.value = "";

        }


        if (customerPhone) {

            customerPhone.value = "";

        }


        // تسجيل الطلب في Console
        console.log(
            "تم حفظ الطلب:",
            order
        );

    });

}