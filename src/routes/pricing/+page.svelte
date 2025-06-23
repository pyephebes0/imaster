<script>
	const packages = [
		{
			name: 'เริ่มต้น',
			price: 29,
			credits: 30,
			days: '1–2 วัน',
			postsPerDay: 'เฉลี่ย ~17 โพสต์/วัน',
			recommended: true
		},
		{
			name: 'ประหยัด',
			price: 99,
			credits: 120,
			days: 'ประมาณ 7 วัน',
			postsPerDay: '',
			recommended: true
		},
		{
			name: 'คุ้มค่า',
			price: 199,
			credits: 260,
			days: 'ประมาณ 15 วัน',
			postsPerDay: '',
			recommended: false
		}
	];

	function selectPackage(pkg) {
		alert(`คุณเลือกแพ็กเกจ ${pkg.name} ราคา ${pkg.price} บาท`);
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
	<h2 class="text-center mb-4">🎯 แพ็กเกจโปรแกรมโพสต์ออโต้ Twitter</h2>
	<p class="text-center mb-5">1 เครดิต = 1 โพสต์ (ทวีต)</p>
	<div class="row justify-content-center">
		{#each packages as pkg}
			<div class="col-md-4 mb-4">
				<div class="card h-100 border-{pkg.recommended ? 'primary' : 'secondary'} shadow-sm">
					<div class="card-header bg-{pkg.recommended ? 'primary' : 'light'} text-{pkg.recommended ? 'white' : 'dark'} text-center">
						<h4>{pkg.name}</h4>
					</div>
					<div class="card-body text-center">
						<h2 class="card-title text-{pkg.recommended ? 'primary' : 'dark'}">฿{pkg.price}</h2>
						<p>{pkg.credits} เครดิต (1 เครดิต = 1 โพสต์)</p>
						<p>🕒 ใช้งานได้ {pkg.days}</p>
						{#if pkg.postsPerDay}
							<p>🔹 {pkg.postsPerDay}</p>
						{/if}
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
