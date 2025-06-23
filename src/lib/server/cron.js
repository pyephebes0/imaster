// src/lib/server/cron.js
import cron from 'node-cron';

cron.schedule('*/5 * * * *', () => {
  console.log('ทำงานทุก 5 นาที');
  // ใส่ logic เช่น fetch ข้อมูล, ส่งโพสต์, จัดคิว ฯลฯ
});
