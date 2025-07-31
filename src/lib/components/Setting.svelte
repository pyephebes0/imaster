<script>
	import { onMount } from 'svelte';

	let text = ''; // ข้อความใน textarea
	let selectTime = '0'; // เลือกระยะเวลาเริ่มต้น
	let imageFile = null; // เก็บไฟล์รูปภาพ
	let imageUrl = '';

	let loading = false; // สำหรับตอนโพสต์
	let loadingPreview = true; // สำหรับตอนโหลดโพสต์เก่า (onMount)
	let preview = null;
	let error = '';
	let posted = false;
	let previewProcessing = true;
	let showSpinner = false;

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

	async function fetchExistingPost() {
		try {
			const res = await fetch('/api/post/existing', { credentials: 'include' });
			if (res.ok) {
				const data = await res.json();
				const post = data.post;

				if (post) {
					preview = post;
					posted = true;
					text = post.content || '';
					imageUrl = post.imageUrl ? `${post.imageUrl}` : `${'no-image.jpg'}`;
					console.log(post.imageUrl);
					selectTime = (post.duration * 60).toString() || '1800';
					// เช็คสถานะ
					showSpinner = post.status === 'posted';
				} else {
					preview = null;
					posted = false;
					showSpinner = false;
				}
			} else if (res.status === 204) {
				preview = null;
				posted = false;
			} else {
				preview = null;
				posted = false;
			}
		} catch (e) {
			console.error('Error fetching existing post:', e);
			error = 'เกิดข้อผิดพลาดในการโหลดโพสต์เก่า';
		} finally {
			loadingPreview = false;
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
		console.log(files);
		if (files && files.length > 0) {
			imageFile = files[0];
			// คุณสามารถใช้ imageFile เพื่อส่งไปที่ server หรือแสดง preview ได้
		} else {
			imageFile = null;
		}
	}

	async function submitForm() {
		loading = true;
		error = '';

		const formData = new FormData();
		formData.append('content', text);

		// แปลง selectTime (วินาที) เป็นนาที
		const durationInMinutes = parseInt(selectTime) / 60;
		formData.append('duration', durationInMinutes.toString());

		if (imageFile) {
			formData.append('image', imageFile);
		}

		try {
			const res = await fetch('/api/post', {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});

			if (!res.ok) {
				error = await res.text();
			} else {
				preview = await res.json();
				posted = true;
				showSpinner = true;
			}
		} catch (e) {
			error = 'เกิดข้อผิดพลาดระหว่างการส่งโพสต์';
		}

		loading = false;
	}

	async function cancelPost() {
		text = '';
		selectTime = '1800';
		imageFile = null;
		preview = null;
		posted = false;
		showSpinner = false;

		try {
			const res = await fetch('/api/queue/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			const data = await res.json();
			if (data.success) {
				console.log(`ลบ job สำเร็จ ${data.removedJobs} งาน`);
			} else {
				console.warn('ลบ job ไม่สำเร็จ:', data.error);
			}
		} catch (error) {
			console.error('เกิดข้อผิดพลาดในการลบ job:', error);
		}
	}

	onMount(() => {
		fetchAccounts();
		fetchExistingPost();

		if (posted) {
			// จำลองว่าระบบกำลังประมวลผล
			setTimeout(() => {
				previewProcessing = false;
			}, 3000);
		}
	});
</script>

<main>
	<h1>สร้างโพสต์</h1>
	{#if showSpinner}
		<div class="preview-box border p-4 rounded bg-light position-relative">
			<!-- Spinner Overlay ขณะประมวลผล -->
			{#if showSpinner}
				<div class="overlay-spinner d-flex justify-content-center align-items-center">
					<div class="text-center">
						<div
							class="spinner-border text-primary"
							role="status"
							style="width: 3rem; height: 3rem;"
						></div>
						<p class="mt-3">โพสต์ของคุณกำลังทำงาน...</p>
					</div>
				</div>
			{/if}

			<!-- ข้อมูลพรีวิว -->
			{#if preview}
				<h4>🎉 โพสต์ของคุณ</h4>
				<p><strong>ข้อความ:</strong> {preview.content}</p>
				<p><strong>ระยะเวลา:</strong> {preview.duration} นาที</p>
				{#if preview.imageUrl}
					<img
						src={preview.imageUrl}
						alt="รูปภาพ"
						class="img-fluid mt-2"
						style="max-width: 280px; max-height: 280px;"
					/>
				{/if}
			{/if}
		</div>
	{:else}
		<!-- ฟอร์มโพสต์ -->
		<form on:submit|preventDefault={submitForm} class="mb-5">
			<label for="textInput">ข้อความ (ไม่เกิน 280 ตัวอักษร):</label>
			<textarea
				id="textInput"
				bind:value={text}
				on:input={autoResize}
				maxlength="280"
				placeholder="พิมพ์ข้อความที่นี่..."
				rows="6"
				class="form-control mb-3"
			></textarea>

			<label for="selectTime">เลือกระยะเวลา:</label>
			<select id="selectTime" bind:value={selectTime} required class="form-select mb-3">
				<option value="0">เลือกระยะเวลา</option>
				<option value="600">10 นาที</option>
				<option value="1200">20 นาที</option>
				<option value="1800">30 นาที</option>
				<option value="2400">40 นาที</option>
			</select>

			<div class="d-flex align-items-center justify-content-between mb-3">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt="รูปภาพ"
						class="img-thumbnail"
						style="max-width: 200px; max-height: 200px;"
					/>
				{:else}
					<div style="width:200px; height:200px; background:#eee; border-radius: .25rem;"></div>
				{/if}

				<label
					for="imageInput"
					class="btn btn-primary d-flex align-items-center gap-2 mb-0"
					style="cursor: pointer;"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-upload"
						viewBox="0 0 16 16"
					>
						<path
							d="M.5 9.9a.5.5 0 0 1 .5-.5h3.6a.5.5 0 0 1 .35.15l.65.65V5.5a.5.5 0 0 1 1 0v4.7l.65-.65a.5.5 0 0 1 .35-.15h3.6a.5.5 0 0 1 0 1h-2.3l-1.65 1.65a.5.5 0 0 1-.7 0L3.3 10.4H1a.5.5 0 0 1-.5-.5z"
						/>
						<path d="M.5 13a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z" />
					</svg>
					เลือกรูป
				</label>

				<input
					type="file"
					id="imageInput"
					accept="image/*"
					class="d-none"
					on:change={handleFileChange}
				/>
			</div>

			<button
				type="submit"
				class="btn btn-success mb-4 btn-lg"
				disabled={text.length === 0 || loading}
			>
				{#if loading}
					<span class="spinner-border spinner-border-sm me-2"></span> กำลังโพสต์...
				{:else}
					โพสต์
				{/if}
			</button>
			{#if error}
				<p class="text-danger mt-2">{error}</p>
			{/if}
		</form>
	{/if}
	{#if showSpinner}
		<button
			class="btn btn-danger mb-4 btn-lg"
			on:click={cancelPost}
			style="margin-top: 10px !important;">หยุด</button
		>
	{/if}
</main>

<main>
	<button class="btn btn-primary mb-4 btn-lg" on:click={connectTwitter}>
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
						<button
							class="btn btn-sm btn-outline-danger"
							on:click={() => revokeAccount(acc.twitterUserId)}
						>
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
		margin: 3rem auto 3rem; /* top 3rem, ลดจาก 5rem */
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
		font-size: 2.5rem; /* ลดจาก 3rem */
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
	button.btn-success,
	button.btn-danger {
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

	.overlay-spinner {
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.85);
		z-index: 10;
	}

	form {
		margin-bottom: 0rem !important;
	}

	.mb-4 {
		margin-bottom: unset !important;
	}
</style>
