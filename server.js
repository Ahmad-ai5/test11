const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// استخدام Body Parser لتحليل بيانات JSON
app.use(bodyParser.json());

// استقبال الطلبات وحفظها في ملف JSON
app.post('/save-orders', (req, res) => {
    const orders = req.body.orders;

    if (!orders || orders.length === 0) {
        return res.status(400).json({ message: 'لا توجد طلبات لحفظها.' });
    }

    // تحديد مسار ملف الحفظ
    const filePath = path.join(__dirname, 'orders.json');

    // حفظ البيانات في ملف JSON
    fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
        if (err) {
            console.error('خطأ أثناء حفظ الطلبات:', err);
            return res.status(500).json({ message: 'حدث خطأ أثناء حفظ الطلبات.' });
        }

        console.log('تم حفظ الطلبات بنجاح في الملف:', filePath);
        res.status(200).json({ message: 'تم حفظ الطلبات بنجاح!' });
    });
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
});
