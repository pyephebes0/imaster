<script>
	import { onMount } from 'svelte';

	let text = ''; // ข้อความใน textarea
	let selectTime = '1'; // เลือกระยะเวลาเริ่มต้น
	let imageFile = null; // เก็บไฟล์รูปภาพ

	const baseUrl = import.meta.env.VITE_BASE_URL;
	let accounts = [];

	const twitterAccountsEndpoint = `${baseUrl}/auth/twitter/accounts`;
	const twitterAuthUrl = `${baseUrl}/auth/twitter`;

	function autoResize(event) {
		const el = event.target;
		el.style.height = 'auto';
		el.style.height = el.scrollHeight + 'px';
	}

	async function fetchAccounts() {
		try {
			const res = await fetch(twitterAccountsEndpoint, {
				credentials: 'include'
			});
			if (res.ok) {
				accounts = await res.json();
			} else {
				accounts = [];
				console.error('Failed to fetch accounts:', res.statusText);
			}
		} catch (error) {
			accounts = [];
			console.error('Error fetching accounts:', error);
		}
	}

	function connectTwitter() {
		window.location.href = twitterAuthUrl;
	}

	async function revokeAccount(twitterUserId) {
		if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการเชื่อมบัญชีนี้?')) return;

		const deleteUrl = `${twitterAccountsEndpoint}/${twitterUserId}`;
		try {
			const res = await fetch(deleteUrl, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (res.ok || res.status === 204) {
				accounts = accounts.filter((acc) => acc.twitterUserId !== twitterUserId);
			} else {
				alert('ลบบัญชีไม่สำเร็จ');
				console.error('Failed to delete account:', res.statusText);
			}
		} catch (error) {
			alert('เกิดข้อผิดพลาด');
			console.error('Error deleting account:', error);
		}
	}

	function handleFileChange(event) {
		const files = event.target.files;
		if (files && files.length > 0) {
			imageFile = files[0];
			// คุณสามารถใช้ imageFile เพื่อส่งไปที่ server หรือแสดง preview ได้
		} else {
			imageFile = null;
		}
	}

	function submitForm() {
		alert(
			`ส่งข้อมูล:\nข้อความ: ${text}\nเวลา: ${selectTime} นาที\nรูปภาพ: ${imageFile ? imageFile.name : 'ไม่มี'}`
		);
		// เพิ่มโค้ดส่งข้อมูลจริง ๆ ได้ที่นี่
	}

	onMount(() => {
		fetchAccounts();
	});
</script>

<main>
	<h1>จัดการบัญชี Twitter ของคุณ</h1>

	<!-- ฟอร์มตัวอย่าง -->
	<form on:submit|preventDefault={submitForm}>
		<label for="textInput">ข้อความ (ไม่เกิน 280 ตัวอักษร):</label>
		<textarea
			id="textInput"
			bind:value={text}
			on:input={autoResize}
			maxlength="280"
			placeholder="พิมพ์ข้อความที่นี่..."
			rows="6"
		></textarea>

		<label for="selectTime">เลือกระยะเวลา:</label>
		<select id="selectTime" bind:value={selectTime} required>
			<option value="1">1 นาที</option>
			<option value="3">3 นาที</option>
			<option value="5">5 นาที</option>
		</select>

		<label for="imageInput">เลือกรูปภาพ:</label>
		<input id="imageInput" type="file" accept="image/*" on:change={handleFileChange} />

		<button type="submit" class="btn btn-success mb-4" disabled={text.length === 0}>
			โพสต์
		</button>
	</form>

	<button class="btn btn-primary mb-4" on:click={connectTwitter}>
		<i class="bi bi-twitter me-2"></i> เชื่อมบัญชี Twitter ใหม่
	</button>

	<h2>บัญชีที่เชื่อมไว้</h2>
	<ul class="list-group">
		{#if accounts.length === 0}
			<li class="list-group-item text-muted">ยังไม่มีบัญชีที่เชื่อมไว้</li>
		{:else}
			{#each accounts as acc}
				<li class="list-group-item d-flex justify-content-between align-items-center">
					<span>@{acc.username}</span>
					<div>
						<span class="badge bg-success me-2">เชื่อมแล้ว</span>
						<button class="btn btn-sm btn-outline-danger" on:click={() => revokeAccount(acc.twitterUserId)}>
							ยกเลิก
						</button>
					</div>
				</li>
			{/each}
		{/if}
	</ul>
</main>

<style>
	main {
		max-width: 600px;
		margin: 3rem auto 3rem;    /* top 3rem, ลดจาก 5rem */
		padding: 2.5rem 2rem;
		text-align: center;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		color: #1e293b;
		background-color: #f0f4ff;
		border-radius: 12px;
		box-shadow: 0 8px 20px rgb(37 99 235 / 0.2);
		position: relative;
		z-index: 10;
	}

	h1 {
		font-size: 2.5rem;         /* ลดจาก 3rem */
		margin-bottom: 1rem;
		color: #2563eb;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
		color: #2563eb;
	}

	p,
	label {
		font-size: 1rem;
		text-align: left;
	}

	textarea,
	select,
	input[type='file'] {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		margin: 0.5rem 0 1.5rem;
		border: 1px solid #ced4da;
		border-radius: 0.375rem;
	}

	textarea {
		min-height: 120px;
		max-height: 200px;
		resize: none;
		line-height: 1.5;
	}

	.button {
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

	.button:hover {
		background-color: #1e40af;
	}

	button.btn-primary,
	button.btn-success {
		width: 100%;
	}

	button.btn-sm {
		width: 60px;
		padding: 0.2rem 0.4rem;
		font-size: 0.75rem;
	}

	.list-group-item {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>