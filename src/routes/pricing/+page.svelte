<script>
	const packages = [
		{
			name: '🟢 เริ่มต้น',
			price: 29,
			credits: 10,
			maxAccounts: 2,
			bonus: ''
		},
		{
			name: '🔵 เล็ก',
			price: 99,
			credits: 30,
			maxAccounts: 6,
			bonus: ''
		},
		{
			name: '🟠 กลาง',
			price: 199,
			credits: 60,
			maxAccounts: 12,
			bonus: ''
		},
		{
			name: '🟣 ใหญ่',
			price: 299,
			credits: 100,
			maxAccounts: 20,
			bonus: ''
		},
		{
			name: '🟤 โปรหนัก',
			price: 499,
			credits: 200,
			maxAccounts: 40,
			bonus: '⭐️ ฟรี +1 บัญชี'
		},
		{
			name: '⚫️ โปรสุด',
			price: 999,
			credits: 250,
			maxAccounts: 50,
			bonus: '⭐️ ฟรี +1 บัญชี'
		}
	];

	function selectPackage(pkg) {
		alert(`คุณเลือกแพ็กเกจ ${pkg.name} ราคา ${pkg.price} บาท`);
		window.location.href = 'https://lin.ee/EhRoCZ9U'; // LINE OA
	}
</script>

<svelte:head>
	<title>แพ็กเกจเชื่อมบัญชี Twitter - iMaster</title>
	<meta
		name="description"
		content="ซื้อเครดิตเพื่อเชื่อมบัญชี Twitter และใช้งานโปรแกรมโพสต์อัตโนมัติ"
	/>
</svelte:head>

<div class="container py-5">
	<h2 class="text-center mb-4">💳 แพ็กเกจเครดิต – เชื่อมบัญชี Twitter</h2>
	<p class="text-center mb-4 fw-semibold text-muted">
		🔁 ใช้ 5 เครดิตเพื่อเชื่อม 1 บัญชี Twitter<br />
		⏳ เครดิตมีอายุ 30 วัน – บัญชีที่เชื่อมจะหมดอายุตามเครดิตที่ใช้เชื่อม
	</p>

	<div class="row justify-content-center">
		{#each packages as pkg}
			<div class="col-md-4 col-sm-6 mb-4">
				<div class="card h-100 border-{pkg.recommended ? 'primary' : 'secondary'} shadow">
					<div class="card-header text-center text-white bg-{pkg.recommended ? 'primary' : 'dark'}">
						<h4>{pkg.name}</h4>
					</div>
					<div class="card-body text-center">
						<h3 class="text-primary">฿{pkg.price}</h3>
						<p><strong>{pkg.credits} เครดิต</strong></p>
						<p>เชื่อมได้สูงสุด <strong>{pkg.maxAccounts} บัญชี</strong></p>
						{#if pkg.bonus}
							<p class="text-success fw-bold">{pkg.bonus}</p>
						{/if}
						{#if pkg.recommended}
							<span class="badge bg-success">แนะนำ</span>
						{/if}
					</div>
					<div class="card-footer text-center">
						<button class="btn btn-outline-primary w-100" on:click={() => selectPackage(pkg)}>
							เลือกแพ็กเกจนี้
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="alert alert-warning text-center mt-4" role="alert">
		❗️หากเครดิตหมดหรือหมดอายุ บัญชีที่เชื่อมจะไม่สามารถโพสต์ได้จนกว่าจะเติมเครดิตใหม่
	</div>
</div>
