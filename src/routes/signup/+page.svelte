<script>
	let username = '';
	let usernameError = '';
	let email = '';
	let password = '';
	let confirm = '';
	let error = '';
	let loading = false;

	function validateUsername() {
		if (!/^[a-z0-9]*$/.test(username)) {
			usernameError = 'Username ต้องใช้ตัวพิมพ์เล็ก a-z และตัวเลข 0-9 เท่านั้น';
		} else {
			usernameError = '';
		}
	}

	async function signup(event) {
		event.preventDefault();
		error = '';

		if (!/^[a-z0-9]+$/.test(username)) {
			error = 'Username must contain only lowercase letters and numbers.';
			return;
		}

		// ✅ ตรวจสอบว่าทุกช่องถูกกรอก
		if (!username.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
			error = 'Please fill in all fields.';
			return;
		}

		if (password !== confirm) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password, confirm })
			});

			if (res.ok) {
				alert('Signup successful! Please login.');
				location.href = '/login';
			} else {
				const text = await res.text();
				error = text || 'Signup failed.';
			}
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<style>
	.is-invalid {
		border: 1px solid red;
	}
	.invalid-feedback {
		color: red;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>

<svelte:head>
	<title>สมัครสมาชิก - iMaster</title>
	<meta
		name="description"
		content="สมัครสมาชิกเพื่อใช้งานโปรแกรมโพสต์ออโต้ Twitter และเลือกแพ็กเกจเครดิต"
	/>
</svelte:head>

<div class="container mt-5" style="max-width: 400px;">
	<h2>Sign Up</h2>
	<form on:submit={signup} novalidate>
		<div class="mb-3">
			<label class="form-label" for="username">Username</label>
			<input
				id="username"
				class="form-control {usernameError ? 'is-invalid' : ''}"
				bind:value={username}
				required
				on:input={() => {
					username = username.replace(/[^a-z0-9]/g, '');
					validateUsername();
				}}
			/>
		</div>

		<div class="mb-3">
			<label class="form-label" for="email">Email</label>
			<input id="email" type="email" class="form-control" bind:value={email} required />
		</div>

		<div class="mb-3">
			<label class="form-label" for="password">Password</label>
			<input id="password" type="password" class="form-control" bind:value={password} required />
		</div>
		{#if usernameError}
			<div class="invalid-feedback" style="display: block;">{usernameError}</div>
		{/if}
		<div class="mb-3">
			<label class="form-label" for="confirm">Confirm Password</label>
			<input id="confirm" type="password" class="form-control" bind:value={confirm} required />
		</div>

		{#if error}
			<div class="alert alert-danger" role="alert">{error}</div>
		{/if}

		<button class="btn btn-success w-100" type="submit" disabled={loading}>
			{#if loading}Signing up...{:else}Sign Up{/if}
		</button>

		<!-- ข้อความและลิงก์เข้าสู่ระบบ และดูแพ็กเกจราคา -->
		<div class="text-center mt-3">
			<small>มีบัญชีอยู่แล้ว? <a href="/login">เข้าสู่ระบบ</a></small><br />
			<small>หรือ <a href="/pricing">ดูแพ็กเกจราคา</a> ก่อนสมัคร</small>
		</div>
	</form>
</div>
