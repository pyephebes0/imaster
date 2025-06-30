// // src/lib/server/agenda.js
// import Agenda from 'agenda';
// // import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';

// dotenv.config();

// const mongoConnectionString = process.env.MONGO_URI;

// if (!mongoConnectionString) {
//   throw new Error('MONGO_URI environment variable is not set');
// }

// let agenda;

// async function createAgenda() {
//   // สร้าง MongoClient และเชื่อมต่อ
//   const mongoClient = new MongoClient(mongoConnectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

//   await mongoClient.connect();

//   // กำหนดชื่อฐานข้อมูลเอง (เช่น 'xpost_app')
//   const db = mongoClient.db('xpost_app');

//   // สร้าง instance ของ Agenda ใช้ connection นี้
//   agenda = new Agenda({
//     mongo: db,
//     collection: 'jobs'
//   });

//   agenda.define('post tweet', async job => {
//     const { text, accounts } = job.attrs.data;
//     for (const account of accounts) {
//       console.log(`📤 โพสต์โดย ${account.username}: ${text}`);
//       // TODO: เรียก Twitter API โพสต์ข้อความ
//     }
//   });

//   await agenda.start();
//   console.log('Agenda started');

//   return agenda;
// }

// // export ฟังก์ชันที่คืน Promise ของ agenda instance
// export const agendaPromise = createAgenda();
