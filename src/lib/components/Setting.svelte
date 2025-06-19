<script>
	let showModal = false;
	let keyword = '';

	function handleSearch(event) {
		event.preventDefault();
		alert(`Searching for: ${keyword}`);
		// ใส่ logic การค้นหาเพิ่มเติมที่นี่
		showModal = false; // ปิด modal หลัง submit
	}

	function closeModal() {
		showModal = false;
	}

	// ตัวอย่างข้อมูลในลิสต์ (ถ้าจะทำ dynamic)
	let items = [
		{
			id: 1,
			title: 'หัวข้อเนื้อหา',
			description: 'คำอธิบายหรือเนื้อหาย่อยเพิ่มเติม',
			img: 'https://www.refugeesrespond.org/dadaabwikimedia/images/a/a9/Example.jpg'
		},
		{
			id: 2,
			title: 'หัวข้อเนื้อหา 2',
			description: 'คำอธิบายหรือเนื้อหาย่อยเพิ่มเติม',
			img: 'https://www.refugeesrespond.org/dadaabwikimedia/images/a/a9/Example.jpg'
		},
		{
			id: 3,
			title: 'หัวข้อเนื้อหา 3',
			description:
				'คำอธิบายหรือเนื้อหาย่อยเพิ่มเติม คำอธิบายหรือเนื้อหาย่อยเพิ่มเติม คำอธิบายหรือเนื้อหาย่อยเพิ่มเติม คำอธิบายหรือเนื้อหาย่อยเพิ่มเติม',
			img: 'https://www.refugeesrespond.org/dadaabwikimedia/images/a/a9/Example.jpg'
		}
	];

	// ฟังก์ชันคัดลอกข้อความ
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(() => {
			alert('คัดลอกเรียบร้อยแล้ว!');
		});
	}
</script>

<div class="container mt-5" style="max-width: 480px;">
	<button
		type="button"
		class="btn btn-outline-info w-100 py-4 px-5 fs-1 d-flex align-items-center justify-content-center gap-3"
		on:click={() => (showModal = true)}
	>
		<i class="bi bi-person-plus"></i>
		Add new user
	</button>

	<ul class="list-group mt-4" style="max-width: 480px;">
		{#each items as item}
			<li class="list-group-item d-flex align-items-center gap-3">
				<img
					src={item.img}
					alt="Thumbnail"
					class="img-thumbnail"
					style="width: 60px; height: 60px; object-fit: cover;"
				/>
				<div class="flex-grow-1 d-flex align-items-center gap-2">
					<div style="flex-grow:1;">
						<h5 class="mb-1">{item.title}</h5>
						<input
							type="text"
							class="form-control-plaintext text-muted p-0"
							value={item.description}
							readonly
							aria-label="Copyable text"
						/>
					</div>
					<button
						class="btn btn-outline-secondary btn-sm"
						on:click={() => copyToClipboard(item.description)}
						aria-label="Copy description"
					>
						Copy
					</button>
				</div>
			</li>
		{/each}
	</ul>
</div>

{#if showModal}
	<!-- Backdrop -->
	<div
		class="modal-backdrop fade show"
		on:click={closeModal}
		style="position: fixed; inset: 0; z-index: 1040;"
	></div>

	<!-- Modal -->
	<div
  class="modal fade show d-block"
  tabindex="-1"
  role="dialog"
  aria-modal="true"
  style="position: fixed; top: 20px; left: 0; right: 0; bottom: 0; z-index: 1050; overflow-y: auto;"
>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">🔍 Search</h5>
					<button type="button" class="btn-close" aria-label="Close" on:click={closeModal}></button>
				</div>
				<div class="modal-body">
					<form on:submit={handleSearch}>
						<div class="mb-3">
							<label for="searchInput" class="form-label">Enter keyword</label>
							<input
								type="text"
								class="form-control"
								id="searchInput"
								bind:value={keyword}
								required
								autofocus
							/>
						</div>
						<button type="submit" class="btn btn-success">Search</button>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	input.form-control-plaintext {
		background-color: #f5f5f5;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.375rem 0.75rem;
		color: #6c757d;

		width: 100%; /* ขยายเต็มพื้นที่ container */
		white-space: nowrap; /* ห้ามขึ้นบรรทัดใหม่ */
		overflow: hidden; /* ซ่อนข้อความเกิน */
		text-overflow: ellipsis; /* แสดง ... เมื่อข้อความยาวเกิน */
		box-sizing: border-box; /* รวม padding และ border ในขนาด width */
	}
</style>
