<script>
	const packages = [
		{
			name: 'เริ่มต้น',
			price: 29,
			credits: 30,
			days: '1–2 วัน',
			postsPerDay: 'ประมาณ 17 โพสต์/วัน',
			recommended: true
		},
		{
			name: 'เล็ก',
			price: 99,
			credits: 120,
			days: 'ประมาณ 7 วัน',
			postsPerDay: '17 โพสต์/วัน',
			recommended: true
		},
		{
			name: 'กลาง',
			price: 199,
			credits: 260,
			days: 'ประมาณ 15 วัน',
			postsPerDay: '17 โพสต์/วัน',
			recommended: false
		}
	];

	function selectPackage(pkg) {
		alert(`คุณเลือกแพ็กเกจ ${pkg.name} ราคา ${pkg.price} บาท`);
		// TODO: redirect ไปหน้าชำระเงินหรือสมัครสมาชิก
    // Redirect ไปที่ LINE
		window.location.href = 'https://lin.ee/EhRoCZ9U';
	}
</script>

<svelte:head>
	<title>เลือกแพ็กเกจ</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	/>
</svelte:head>

<div class="container py-5">
	<h2 class="text-center mb-4">เลือกแพ็กเกจ</h2>
	<div class="row justify-content-center">
		{#each packages as pkg}
			<div class="col-md-4 mb-4">
				<div class="card h-100 border-{pkg.recommended ? 'primary' : 'secondary'}">
					<div class="card-header bg-{pkg.recommended ? 'primary' : 'light'} text-white text-center">
						<h4>{pkg.name}</h4>
					</div>
					<div class="card-body text-center">
						<h2 class="card-title text-{pkg.recommended ? 'primary' : 'dark'}">฿{pkg.price}</h2>
						<p>{pkg.credits} เครดิต (1 เครดิต = 1 โพสต์)</p>
						<p>ใช้งานได้ {pkg.days}</p>
						<p>{pkg.postsPerDay}</p>
						{#if pkg.recommended}
							<span class="badge bg-success">แนะนำ</span>
						{/if}
					</div>
					<div class="card-footer text-center">
						<button class="btn btn-primary w-100" on:click={() => selectPackage(pkg)}>
							เริ่มต้นใช้งาน
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
