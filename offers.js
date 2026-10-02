const offersList =
    document.getElementById("offersList");

const addOfferBtn =
    document.getElementById("addOfferBtn");

const offerForm =
    document.getElementById("offerForm");

const saveOfferBtn =
    document.getElementById("saveOfferBtn");

const cancelOfferBtn =
    document.getElementById("cancelOfferBtn");

const offerName =
    document.getElementById("offerName");

const oldPrice =
    document.getElementById("oldPrice");

const newPrice =
    document.getElementById("newPrice");

const offerImage =
    document.getElementById("offerImage");


let offers =
    JSON.parse(
        localStorage.getItem("raefOffers")
    ) || [];


/* =========================
   حفظ العروض
========================= */

function saveOffers() {

    localStorage.setItem(
        "raefOffers",
        JSON.stringify(offers)
    );

}


/* =========================
   عرض العروض
========================= */

function displayOffers() {

    offersList.innerHTML = "";


    if (offers.length === 0) {

        offersList.innerHTML = `
            <div class="no-offers">

                <h2>
                    لا توجد عروض حتى الآن
                </h2>

                <p>
                    أضف أول عرض للمكتبة.
                </p>

            </div>
        `;

        return;
    }


    offers.forEach(function (offer, index) {

        const card =
            document.createElement("div");

        card.className =
            "admin-offer-card";


        card.innerHTML = `

            ${
                offer.image
                    ? `
                        <div class="admin-offer-image">

                            <img
                                src="${offer.image}"
                                alt="${offer.name}"
                            >

                        </div>
                    `
                    : ""
            }


            <h3>
                ${offer.name}
            </h3>


            <p>
                السعر القديم:
                ${offer.oldPrice} جنيه
            </p>


            <p>
                السعر الجديد:
                ${offer.newPrice} جنيه
            </p>


            <strong>
                خصم ${offer.discount}%
            </strong>


            <div class="offer-actions">

                <button
                    class="edit-offer"
                    data-index="${index}"
                    type="button"
                >
                    ✏️ تعديل
                </button>


                <button
                    class="delete-offer"
                    data-index="${index}"
                    type="button"
                >
                    🗑️ حذف
                </button>

            </div>
        `;


        offersList.appendChild(card);

    });

}


/* =========================
   فتح فورم الإضافة
========================= */

addOfferBtn.addEventListener(
    "click",
    function () {

        offerForm.style.display =
            "block";

        offerName.focus();

    }
);


/* =========================
   حفظ العرض
========================= */

saveOfferBtn.addEventListener(
    "click",
    function () {

        const name =
            offerName.value.trim();

        const oldPriceValue =
            Number(oldPrice.value);

        const newPriceValue =
            Number(newPrice.value);

        const imageFile =
            offerImage.files[0];


        /* التحقق من الاسم */

        if (name === "") {

            alert(
                "اكتب اسم العرض."
            );

            offerName.focus();

            return;
        }


        /* التحقق من السعر القديم */

        if (
            !oldPriceValue ||
            oldPriceValue <= 0
        ) {

            alert(
                "اكتب السعر القديم بشكل صحيح."
            );

            oldPrice.focus();

            return;
        }


        /* التحقق من السعر الجديد */

        if (
            !newPriceValue ||
            newPriceValue <= 0
        ) {

            alert(
                "اكتب السعر الجديد بشكل صحيح."
            );

            newPrice.focus();

            return;
        }


        /* التأكد أن السعر الجديد أقل */

        if (
            newPriceValue >=
            oldPriceValue
        ) {

            alert(
                "السعر الجديد يجب أن يكون أقل من السعر القديم."
            );

            newPrice.focus();

            return;
        }


        /* حساب الخصم */

        const discount =
            Math.round(
                (
                    (
                        oldPriceValue -
                        newPriceValue
                    )
                    /
                    oldPriceValue
                ) * 100
            );


        /* إنشاء العرض */

        const newOffer = {

            id:
                Date.now(),

            name:
                name,

            oldPrice:
                oldPriceValue,

            newPrice:
                newPriceValue,

            discount:
                discount,

            image:
                ""

        };


        /* لو فيه صورة */

        if (imageFile) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    newOffer.image =
                        reader.result;

                    offers.push(
                        newOffer
                    );

                    saveOffers();

                    displayOffers();

                    resetOfferForm();

                    alert(
                        "✅ تم إضافة العرض بنجاح"
                    );

                };


            reader.readAsDataURL(
                imageFile
            );


        } else {

            /*
               لو مفيش صورة
               نحفظ العرض عادي
            */

            offers.push(
                newOffer
            );

            saveOffers();

            displayOffers();

            resetOfferForm();

            alert(
                "✅ تم إضافة العرض بنجاح"
            );

        }

    }
);


/* =========================
   إلغاء
========================= */

cancelOfferBtn.addEventListener(
    "click",
    function () {

        resetOfferForm();

    }
);


/* =========================
   تنظيف الفورم
========================= */

function resetOfferForm() {

    offerName.value = "";

    oldPrice.value = "";

    newPrice.value = "";

    offerImage.value = "";

    offerForm.style.display =
        "none";

}


/* =========================
   تعديل وحذف
========================= */

offersList.addEventListener(
    "click",
    function (event) {

        /* تعديل */

        if (
            event.target.classList.contains(
                "edit-offer"
            )
        ) {

            const index =
                Number(
                    event.target.dataset.index
                );

            const offer =
                offers[index];

            if (!offer) {
                return;
            }


            const name =
                prompt(
                    "اسم العرض:",
                    offer.name
                );

            if (!name) {
                return;
            }


            const oldPriceValue =
                Number(
                    prompt(
                        "السعر القديم:",
                        offer.oldPrice
                    )
                );


            const newPriceValue =
                Number(
                    prompt(
                        "السعر الجديد:",
                        offer.newPrice
                    )
                );


            if (
                !oldPriceValue ||
                !newPriceValue
            ) {

                alert(
                    "الأسعار غير صحيحة."
                );

                return;
            }


            if (
                newPriceValue >=
                oldPriceValue
            ) {

                alert(
                    "السعر الجديد يجب أن يكون أقل من السعر القديم."
                );

                return;
            }


            const discount =
                Math.round(
                    (
                        (
                            oldPriceValue -
                            newPriceValue
                        )
                        /
                        oldPriceValue
                    ) * 100
                );


            offer.name =
                name;

            offer.oldPrice =
                oldPriceValue;

            offer.newPrice =
                newPriceValue;

            offer.discount =
                discount;


            saveOffers();

            displayOffers();

        }


        /* حذف */

        if (
            event.target.classList.contains(
                "delete-offer"
            )
        ) {

            const index =
                Number(
                    event.target.dataset.index
                );


            const confirmDelete =
                confirm(
                    "هل أنت متأكد من حذف هذا العرض؟"
                );


            if (!confirmDelete) {
                return;
            }


            offers.splice(
                index,
                1
            );


            saveOffers();

            displayOffers();

        }

    }
);


/* =========================
   تشغيل الصفحة
========================= */

displayOffers();