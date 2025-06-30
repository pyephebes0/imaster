<svelte:head>
	<title>iMaster - โปรแกรมโพสต์ออโต้ Twitter</title>
	<meta
		name="description"
		content="โปรแกรมโพสต์ออโต้ Twitter ช่วยให้คุณจัดการโพสต์ได้ง่ายและรวดเร็ว"
	/>
</svelte:head>

<main>
	<h1>ยินดีต้อนรับสู่ iMaster</h1>
	<p>
    <span style="display: block;">โปรแกรมโพสต์ออโต้ Twitter</span>
    <span>ช่วยให้คุณจัดการโพสต์ได้ง่ายและรวดเร็ว</span>
  </p>
	<div class="d-flex flex-column align-items-center gap-2 mt-3">
    <a href="/signup" class="btn btn-primary">เริ่มใช้งานเลย</a>
    <a href="/pricing" class="btn btn-outline-secondary">ดูแพ็กเกจราคา</a>
  </div>
</main>

<style>
	main {
		max-width: 600px;
		margin: 5rem auto 3rem; /* top 5rem, auto left/right, bottom 3rem */
		padding: 2.5rem 2rem;
		text-align: center;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		color: #1e293b;
		background-color: #f0f4ff;
		border-radius: 12px;
		box-shadow: 0 8px 20px rgb(37 99 235 / 0.2);
		/* ทำให้ main อยู่บนเลเยอร์ที่สูงขึ้น ถ้ามี navbar ซ้อน */
		position: relative;
		z-index: 10;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		color: #2563eb;
	}

	p {
		font-size: 1.25rem;
		margin-bottom: 2.5rem;
		white-space: normal; /* ให้ขึ้นบรรทัดตามปกติ */
		word-wrap: break-word; /* ตัดคำเมื่อยาวเกิน */
		overflow-wrap: break-word; /* รองรับเบราว์เซอร์อื่น ๆ */
		hyphens: auto; /* ตัดคำกลางบรรทัด (ถ้าเบราว์เซอร์รองรับ) */
	}

	a.button {
		display: inline-block;
		background-color: #2563eb;
		color: white;
		padding: 0.75rem 2rem;
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: 8px;
		text-decoration: none;
		transition: background-color 0.3s ease;
	}
	a.button:hover {
		background-color: #1e40af;
	}

  .d-flex.flex-column.align-items-center.gap-2.mt-3 a.btn {
    width: 220px;              /* กำหนดความกว้างเท่ากัน */
    font-size: 1.2rem;         /* ตัวหนังสือใหญ่ขึ้น */
    font-weight: 700;          /* ตัวหนา */
    padding: 0.85rem 1rem;     /* เพิ่ม padding */
    border-radius: 12px;       /* มุมโค้งมนมากขึ้น */
    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4); /* เงาเพิ่มความลึก */
    transition: all 0.3s ease;
  }

  .d-flex.flex-column.align-items-center.gap-2.mt-3 a.btn-primary:hover {
    background-color: #1e40af;
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.6);
    transform: translateY(-3px);
  }

  .d-flex.flex-column.align-items-center.gap-2.mt-3 a.btn-outline-secondary {
    color: #2563eb;
    border-width: 2px;
    font-weight: 600;
  }
  
  .d-flex.flex-column.align-items-center.gap-2.mt-3 a.btn-outline-secondary:hover {
    background-color: #2563eb;
    color: white;
    box-shadow: 0 8px 15px rgba(37, 99, 235, 0.4);
    transform: translateY(-3px);
    border-color: #2563eb;
  }
  .btn-icon {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
</style>
