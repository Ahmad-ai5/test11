let cart = []; // مصفوفة السلة

// إضافة المنتج إلى السلة
function addToCart(productId, productName, productPrice, productImage) {
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    updateCartUI();
}

// تحديث واجهة المستخدم
function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartItemsContainer.innerHTML = ''; // إفراغ السلة
    let totalPrice = 0;

    cart.forEach(item => {
        const listItem = document.createElement("li");
        const productImage = document.createElement("img");
        productImage.src = item.image;
        productImage.alt = item.name;
        productImage.style.width = "50px";
        productImage.style.marginRight = "10px";

        const itemText = document.createElement("span");
        itemText.textContent = `${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} درهم`;

        listItem.appendChild(productImage);
        listItem.appendChild(itemText);
        cartItemsContainer.appendChild(listItem);

        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// إرسال الطلبات إلى الخادم
function submitOrders() {
    if (cart.length === 0) {
        alert("السلة فارغة! أضف منتجات أولاً.");
        return;
    }

    // إرسال البيانات إلى الخادم باستخدام fetch
    fetch('/save-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: cart }) // إرسال الطلبات بصيغة JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('فشل إرسال الطلبات إلى الخادم');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // عرض رسالة النجاح
        cart = []; // تفريغ السلة بعد الإرسال
        updateCartUI(); // تحديث واجهة السلة
    })
    .catch(error => {
        console.error('حدث خطأ أثناء إرسال الطلبات:', error);
        alert('حدث خطأ أثناء إرسال الطلبات. يرجى المحاولة لاحقًا.');
    });
}

// دالة لحفظ الطلبات على الخادم
function saveOrdersToServer() {
    if (cart.length === 0) {
        alert("السلة فارغة! أضف منتجات أولاً.");
        return;
    }

    const ordersData = { orders: cart };

    // إرسال البيانات إلى الخادم
    fetch('/save-orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordersData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'تم حفظ الطلبات بنجاح!') {
            alert("تم حفظ الطلبات على الخادم بنجاح!");
        } else {
            alert("حدث خطأ أثناء حفظ الطلبات.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("حدث خطأ أثناء الاتصال بالخادم.");
    });
}
