nsrders = [];const ordersList = document.getElementById("ordersList");
const noOrders = document.getElementById("noOrders");

let orders = [];

function formatOrderDate(dateText) {

    if (!dateText) {
        return {
            date: "غير محدد",
            time: ""
        };
    }

    const parts = dateText.split("،");

    return {
        date: parts[0]
            ? parts[0].trim()
            : dateText,

        time: parts[1]
            ? parts[1].trim()
            : ""
    };
}


function formatOrderDate(dateText) {
    if (!dateText) {
        return {
            date: "غير محدد",
            time: ""
        };
    }

    const parts = dateText.split("،");

    return {
        date: parts[0] ? parts[0].trim() : dateText,
        time: parts[1] ? parts[1].trim() : ""
    };
}

let currentFilter = "الكل";

let searchText = "";
// ===============================
// تحميل الطلبات
// ===============================

function loadOrders() {
    try {
        orders = JSON.parse(
            localStorage.getItem("raefOrders")
        ) || [];
    } catch (error) {
        console.error("خطأ في تحميل الطلبات:", error);
        orders = [];
    }

    // إصلاح الطلبات القديمة
    let changed = false;

    orders = orders.map(function (order, index) {

        // لو الطلب القديم مفيهوش ID
        if (!order.id) {
            order.id = Date.now() + index;
            changed = true;
        }

        // لو الطلب القديم يستخدم items
        if (
            !order.products &&
            Array.isArray(order.items)
        ) {
            order.products = order.items;
            changed = true;
        }

        // حالة افتراضية
        if (!order.status) {
            order.status = "جديد";
            changed = true;
        }

        return order;
    });

    if (changed) {
        localStorage.setItem(
            "raefOrders",
            JSON.stringify(orders)
        );
    }
}


// ===============================
// عرض الطلبات
// ===============================

function displayOrders() {

    if (!ordersList) {
        console.error("ordersList غير موجود");
        return;
    }

    ordersList.innerHTML = "";

    if (!orders || orders.length === 0) {

        if (noOrders) {
            noOrders.style.display = "block";
        }

        return;
    }

    if (noOrders) {
        noOrders.style.display = "none";
    }


const visibleOrders = orders.filter(function (order) {

    const matchesStatus =
        currentFilter === "الكل" ||
        (order.status || "جديد") === currentFilter;

    const search =
        searchText.toLowerCase();

    const customerName =
        String(order.customerName || "")
            .toLowerCase();

    const customerPhone =
        String(order.customerPhone || "")
            .toLowerCase();

    const matchesSearch =
        customerName.includes(search) ||
        customerPhone.includes(search);

    return matchesStatus && matchesSearch;
});
visibleOrders.forEach(function (order, index) {

        const orderCard =
            document.createElement("div");

        orderCard.className = "order-card";


        // ===============================
        // المنتجات
        // ===============================

        const products =
            Array.isArray(order.products)
                ? order.products
                : Array.isArray(order.items)
                    ? order.items
                    : [];

        let itemsHTML = "";

        if (products.length === 0) {

            itemsHTML = `
                <p>لا توجد منتجات في هذا الطلب</p>
            `;

        } else {

            products.forEach(function (item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                const total =
                    price * quantity;

                itemsHTML += `
                    <div class="order-item">

                        <span>
                            ${item.name}
                            × ${quantity}
                        </span>

                        <strong>
                            ${total} جنيه
                        </strong>

                    </div>
                `;
            });
        }


        // ===============================
        // رقم الطلب
        // ===============================

        const orderNumber =
            order.id || (Date.now() + index);


        // ===============================
        // الحالة
        // ===============================

        const orderStatus =
            order.status || "جديد";


        // ===============================
        // الإجمالي
        // ===============================

        const orderTotal =
            Number(order.total) || 0;


        // ===============================
        // بطاقة الطلب
        // ===============================

const orderDate = formatOrderDate(order.date);



        orderCard.innerHTML = `

            <div class="order-top">

                <div>

                    <h2>
                        الطلب #${orderNumber}
                    </h2>

${
    order.receivedDate
        ? `
            <div class="order-date-box received-date-box">
                <span class="date-icon">✅</span>

                <div class="date-info">
                    <small>تاريخ الاستلام</small>
                    <strong>${order.receivedDate}</strong>
                </div>
            </div>
          `
        : ""
}

<div class="order-date-box">

    <span class="date-icon">📅</span>

    <div class="date-info">

        <small>تاريخ الطلب</small>

        <strong>
            ${orderDate.date}
        </strong>

        ${
            orderDate.time
                ? `
                    <span class="order-time">
                        🕐 ${orderDate.time}
                    </span>
                  `
                : ""
        }

    </div>

</div>

${
    order.receivedDate
        ? `
            <div class="order-date-box received-date-box">

                <span class="date-icon">✅</span>

                <div class="date-info">

                    <small>تاريخ الاستلام</small>

                    <strong>
                        ${order.receivedDate}
                    </strong>

                </div>

            </div>
          `
        : ""
}



                </div>


                <span class="order-status">
                    ${orderStatus}
                </span>

            </div>


            <div class="customer-info">

                <p>
                    👤
                    <strong>العميل:</strong>
                    ${order.customerName || "غير محدد"}
                </p>

                <p>
                    📱
                    <strong>الهاتف:</strong>
                    ${order.customerPhone || "غير محدد"}
                </p>

            </div>


            <div class="order-products">

                <h3>المنتجات</h3>

                ${itemsHTML}

            </div>


            <div class="order-bottom">

                <strong>
                    الإجمالي:
                    ${orderTotal}
                    جنيه
                </strong>


                <select
                    class="status-select"
                    data-order="${orderNumber}"
                >

                    <option
                        value="جديد"
                        ${orderStatus === "جديد" ? "selected" : ""}
                    >
                        جديد
                    </option>

                    <option
                        value="جاري التجهيز"
                        ${orderStatus === "جاري التجهيز" ? "selected" : ""}
                    >
                        جاري التجهيز
                    </option>

                    <option
                        value="جاهز للاستلام"
                        ${orderStatus === "جاهز للاستلام" ? "selected" : ""}
                    >
                        جاهز للاستلام
                    </option>

                    <option
                        value="تم الاستلام"
                        ${orderStatus === "تم الاستلام" ? "selected" : ""}
                    >
                        تم الاستلام
                    </option>

                </select>


                <button
                    type="button"
                    class="delete-order-btn"
                    data-order="${orderNumber}"
                >
                    🗑️ حذف الطلب
                </button>

            </div>

        `;


        ordersList.appendChild(orderCard);

    });


    // ===============================
    // تغيير حالة الطلب
    // ===============================

    document
        .querySelectorAll(".status-select")
        .forEach(function (select) {

            select.addEventListener(
                "change",
                function () {

                    const orderId =
                        String(select.dataset.order);

                    const order =
                        orders.find(function (item) {

                            return String(item.id) === orderId;

                        });


                    if (order) {

                        order.status =
                            select.value;


                        // حفظ تاريخ الاستلام
                        if (
                            select.value ===
                            "تم الاستلام"
                        ) {

                            order.receivedDate =
                                new Date()
                                    .toLocaleString("ar-EG");
                        }


                        localStorage.setItem(
                            "raefOrders",
                            JSON.stringify(orders)
                        );


                        displayOrders();

                    }

                }
            );

        });


    // ===============================
    // حذف الطلب
    // ===============================

    document
        .querySelectorAll(".delete-order-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const orderId =
                        String(button.dataset.order);


                    const confirmDelete =
                        window.confirm(
                            "هل أنت متأكد من حذف هذا الطلب؟"
                        );


                    if (!confirmDelete) {
                        return;
                    }


                    orders =
                        orders.filter(
                            function (order) {

                                return String(order.id)
                                    !== orderId;

                            }
                        );


                    localStorage.setItem(
                        "raefOrders",
                        JSON.stringify(orders)
                    );


                    displayOrders();

                }
            );

        });

}


// ===============================
// تشغيل الصفحة
// ===============================

loadOrders();
displayOrders();



// ===============================
// فلترة الطلبات
// ===============================

document
    .querySelectorAll(".filter-btn")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            currentFilter =
                button.dataset.status;

            document
                .querySelectorAll(".filter-btn")
                .forEach(function (btn) {
                    btn.classList.remove("active");
                });

            button.classList.add("active");

            displayOrders();

        });

    });


    const orderSearch =
    document.getElementById("orderSearch");

if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        function () {

            searchText =
                orderSearch.value.trim();

            displayOrders();

        }
    );

}