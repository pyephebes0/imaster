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

<div class="container py-5">
	<h1 class="mb-4 custom-title">จัดการบัญชี Twitter ของคุณ</h1>

	<!-- ฟอร์มตัวอย่าง -->
	<form on:submit|preventDefault={submitForm}>
		<label for="textInput"> ข้อความ (ไม่เกิน 100 ตัวอักษร): </label>
		<textarea
			bind:value={text}
			on:input={autoResize}
			maxlength="280"
			placeholder="พิมพ์ข้อความที่นี่..."
			rows="6"
		></textarea>

		<label for="selectTime"> เลือกระยะเวลา: </label>
		<select id="selectTime" bind:value={selectTime} required>
			<option value="1">1 นาที</option>
			<option value="3">3 นาที</option>
			<option value="5">5 นาที</option>
		</select>

		<label for="imageInput"> เลือกรูปภาพ: </label>
		<input id="imageInput" type="file" accept="image/*" on:change={handleFileChange} />

		<button type="submit" class="btn btn-success mb-4" disabled={text.length === 0}>
			โพสต์
		</button>
	</form>

	<button class="btn btn-primary mb-4" on:click={connectTwitter}>
		<i class="bi bi-twitter me-2"></i> เชื่อมบัญชี Twitter ใหม่
	</button>

	<h2 class="h4">บัญชีที่เชื่อมไว้</h2>
	<ul class="list-group">
		{#if accounts.length === 0}
			<li class="list-group-item text-muted">ยังไม่มีบัญชีที่เชื่อมไว้</li>
		{/if}
		{#each accounts as acc}
			<li class="list-group-item d-flex justify-content-between align-items-center">
				<span>@{acc.username}</span>
				<div>
					<span class="badge bg-success me-2">เชื่อมแล้ว</span>
					<button
						class="btn btn-sm btn-outline-danger"
						on:click={() => revokeAccount(acc.twitterUserId)}
					>
						ยกเลิก
					</button>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	div.container {
		max-width: 400px;
	}

	.custom-title {
    font-size: 1.5rem; /* ปรับขนาดให้เล็กลงจาก h1 ปกติ */
    font-weight: 600; /* เน้นหนาเล็กน้อย */
  }
  @media (max-width: 576px) {
    .custom-title {
      font-size: 1.25rem; /* ย่อขนาดลงอีกสำหรับหน้าจอเล็ก */
    }
  }

	ul.list-group li.list-group-item {
		max-width: 350px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	button.btn-sm {
		width: 60px;
		padding: 0.2rem 0.4rem;
		font-size: 0.75rem;
	}
	textarea {
		width: 100%;
		min-height: 120px; /* ประมาณ 6 บรรทัด */
		max-height: 180px; /* สูงสุดประมาณ 9 บรรทัด */
		resize: none;
		padding: 8px;
		font-size: 1rem;
		margin-bottom: 1rem;
		border: 1px solid #ced4da;
		border-radius: 0.375rem;
		line-height: 1.5; /* ช่วยให้คำนวณความสูงบรรทัดชัดเจน */
	}

	select,
	input[type='file'] {
		width: 100%;
		margin-bottom: 1rem;
		padding: 0.375rem 0.75rem;
		font-size: 1rem;
		border: 1px solid #ced4da;
		border-radius: 0.375rem;
	}
	button.btn-primary,
	button.btn-success {
		width: 100%;
	}
	label {
		font-weight: 600;
		display: block;
		margin-bottom: 0.25rem;
	}
</style>
