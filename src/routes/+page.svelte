<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
	}

	type Result = { factor: number; isCorrect: boolean };
	type Guess = { guess: number; results: Result[]; correctProduct: number };
	type StoredGuesses = { allGuesses: Guess[]; todayDate: string; isSuccess: boolean };

	let secretNumber: number;
	let primeFactors: number[] = [];
	let userGuess = '';
	let results: Result[] = [];
	let allGuesses: Guess[] = [];
	let isSuccess = false;
	let isCopied = false;
	$: parsedGuess = parseInt(userGuess);
	$: isTooHigh = parsedGuess > 999;
	$: isTooLow = parsedGuess < 100;
	$: correctFactors = allGuesses.reduce((a: Record<string, number>, b) => {
		const counts: Record<string, number> = {};
		b.results.forEach((r) => {
			if (r.isCorrect) {
				counts[r.factor] = (counts[r.factor] || 0) + 1;
			}
		});
		const correctGuessFactors = Object.keys(counts);
		const aCopy = { ...a };
		correctGuessFactors.forEach((f) => {
			if (counts[f] > (aCopy[f] || 0)) {
				aCopy[f] = counts[f];
			}
		});
		return aCopy;
	}, {});
	$: correctGuess = Object.entries(correctFactors).flatMap(([key, count]) =>
		Array(count).fill(Number(key))
	);
	$: correctProduct = correctGuess.reduce((a, b) => a * b, 1);
	let isReady = false;
	const todayDate = new Date().toLocaleDateString();
	let input: HTMLInputElement | null = null;

	function generateSecretNumber() {
		const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

		function hasValidPrimeFactors(num: number) {
			let factors = [];
			for (let prime of primes) {
				while (num % prime === 0) {
					num /= prime;
					factors.push(prime);
				}
			}
			if (factors.length < 3) {
				return false;
			}
			return num === 1;
		}

		const validNumbers: number[] = [];
		for (let i = 100; i <= 999; i++) {
			if (hasValidPrimeFactors(i)) {
				validNumbers.push(i);
			}
		}

		const today = new Date();
		const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();

		function seededRandom(seed: number) {
			const x = Math.sin(seed) * 10000;
			return x - Math.floor(x);
		}

		const randomIndex = Math.floor(seededRandom(seed) * validNumbers.length);
		return validNumbers[randomIndex];
	}

	function getPrimeFactors(num: number) {
		const factors = [];
		let divisor = 2;
		while (num > 1) {
			if (num % divisor === 0) {
				factors.push(divisor);
				num /= divisor;
			} else {
				divisor++;
			}
		}
		return factors;
	}

	onMount(() => {
		const localGuesses = localStorage.getItem('guesses');
		if (localGuesses) {
			const guesses: StoredGuesses = JSON.parse(localGuesses);
			if (todayDate === guesses.todayDate) {
				allGuesses = guesses.allGuesses;
			}
			if (guesses.isSuccess) {
				isSuccess = true;
			}
		}
		isReady = true;
		secretNumber = generateSecretNumber();
		primeFactors = getPrimeFactors(secretNumber);

		const dialog = document.querySelector('dialog');
		const showButton = document.querySelector('dialog + button');
		const closeButton = document.querySelector('dialog button');
		input = document.querySelector('input');

		if (dialog && showButton && closeButton) {
			showButton.addEventListener('click', () => {
				dialog.showModal();
			});

			closeButton.addEventListener('click', () => {
				dialog.close();
			});
		}
	});

	function handleGuess() {
		if (isTooHigh) {
			return;
		}

		if (isTooLow) {
			input?.classList.add('error');
			return;
		}

		const guessFactors = getPrimeFactors(parsedGuess);

		const isExactMatch =
			guessFactors.length === primeFactors.length &&
			guessFactors.every((factor) => primeFactors.includes(factor)) &&
			guessFactors.reduce((product, factor) => product * factor, 1) === secretNumber;

		const factorCounts: Record<number, number> = {};
		for (const factor of primeFactors) {
			factorCounts[factor] = (factorCounts[factor] || 0) + 1;
		}

		const roundResults = guessFactors.map((factor) => {
			if (factorCounts[factor]) {
				factorCounts[factor]--;
				return { factor, isCorrect: true };
			}
			return { factor, isCorrect: false };
		});

		const correctProduct = roundResults
			.filter((res) => res.isCorrect)
			.reduce((prod, res) => prod * res.factor, 1);

		results = roundResults.sort((a, b) => +b.isCorrect - +a.isCorrect);
		allGuesses = [{ guess: parsedGuess, results: roundResults, correctProduct }, ...allGuesses];

		if (isExactMatch) {
			isSuccess = true;
		} else {
			document.querySelector<HTMLInputElement>('input')?.focus();
		}

		const storedGuesses: StoredGuesses = { allGuesses, todayDate, isSuccess };
		localStorage.setItem('guesses', JSON.stringify(storedGuesses));

		userGuess = '';
	}

	async function copyResultsToClipboard() {
		const guessesToEmojis = allGuesses.map((g, i) =>
			g.results.map((r) => (i == 0 ? '🟠' : r.isCorrect ? '🟢' : '🔴')).join('')
		);
		const resultText = [`${todayDate}\n`, ...guessesToEmojis.reverse(), '\nprimer-game.com'].join(
			'\n'
		);

		await navigator.clipboard.writeText(resultText);
		isCopied = true;
	}
</script>

<main>
	<div class="header-wrapper">
		<header>
			<h1>PRIMER</h1>
			<p>{todayDate}</p>
		</header>
		<dialog>
			<h2>How to play</h2>
			<p>Guess today's three-digit number.</p>
			<ul>
				<li>Its prime factors are less than <b>50</b></li>
				<li><b class="win-text">Progress</b> is shown at the top</li>
				<li>
					Guessed factors will be <b class="correct-text">right</b> or
					<b class="incorrect-text">wrong</b>
				</li>
			</ul>
			<p>Devised by Ramsay, built by Jack 🚀</p>
			<button on:click={toggleModal}>Close</button>
		</dialog>
		<button class="info-btn" on:click={toggleModal}>How?</button>
	</div>

	<div class="primes">
		<div class="guess-card share">
			<p class={`guess-header ${isSuccess ? 'guess-success' : 'hide-text'}`}>
				{isSuccess ? correctProduct : '100'}
			</p>
			<div class="guess-results">
				{#each correctGuess as f}
					<span class={`result win  ${isSuccess ? '' : 'hide-text'}`}>{f}</span>
				{/each}
				{#each primeFactors.slice(correctGuess.length) as f}
					<span class="result pregame"></span>
				{/each}
			</div>
			{#if isSuccess}
				<button on:click={copyResultsToClipboard} autofocus>{isCopied ? 'Copied!' : 'Share'}</button
				>
			{:else}
				<div class="result product"></div>
			{/if}
		</div>
	</div>

	<form on:submit|preventDefault={handleGuess}>
		<input
			type="number"
			bind:value={userGuess}
			placeholder={isSuccess
				? `Solved in ${allGuesses.length} guesses!`
				: 'Guess a three-digit number'}
			required
			disabled={!isReady || isSuccess}
			on:input={() => {
				if (!isTooLow && !isTooHigh && input?.classList.contains('error')) {
					input.classList.remove('error');
				}
			}}
			class={isTooHigh ? 'error' : ''}
		/>
		<button type="submit" disabled={!isReady || isSuccess}>Guess</button>
	</form>

	<h2 hidden>Your guesses</h2>
	<div class="guesses">
		{#each allGuesses as { guess, results, correctProduct }, index}
			{#if !isSuccess || index > 0}
				<div class="guess-card" transition:slide>
					<p class="guess-header">
						{guess}
					</p>
					<div class="guess-results">
						{#each results as { factor, isCorrect }}
							<span class="result {isCorrect ? 'correct' : 'incorrect'}">
								{factor}
							</span>
						{/each}
					</div>
					<div class="result product">
						{correctProduct}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</main>

<style>
	@font-face {
		font-family: 'BluuNext Bold';
		font-style: normal;
		font-weight: 700;
		src: url('/fonts/BluuNext-Bold.otf') format('opentype');
	}

	:root {
		--bg-color: #f9f9f9;
		--win-text: #d4af37;
		--win-color: #fdde6c;
		--success-color: #28a745;
		--danger-color: #dc3545;
		--font-color: #333;
		--font-grey: #666;
		color: var(--font-color);
		background-color: var(--bg-color);
	}
	main {
		font-family: sans-serif;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		overflow-x: hidden;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	h1 {
		font-family: 'BluuNext Bold', serif;
		font-size: 2rem;
	}

	h1,
	h2,
	p {
		margin: 0;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: var(--bg-color);
		color: var(--font-color);
		border: 2px solid var(--font-color);
		border-radius: 4px;
		cursor: pointer;
		transition: filter 0.3s;
		font-size: 1rem;
	}

	button:hover {
		filter: brightness(0.95);
	}

	button:disabled {
		cursor: default;
		filter: opacity(0.6);
	}

	.header-wrapper {
		align-items: start;
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		max-width: 400px;
		width: 100%;
	}

	header p {
		font-size: 1rem;
		color: var(--font-grey);
	}

	dialog {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		top: 1.5rem;
		margin: 1rem;
		max-width: 400px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	dialog h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	dialog p {
		margin-bottom: 1rem;
		text-align: left;
	}

	dialog ul {
		text-align: left;
		padding-left: 1.25rem;
	}

	dialog li {
		margin-bottom: 0.25rem;
	}

	form {
		align-items: center;
		width: 100%;
		max-width: 400px;
		margin-bottom: 1rem;
		display: flex;
		gap: 0.5rem;
		justify-content: space-between;
	}

	form button {
		height: 100%;
	}

	input {
		padding: 0.8rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		flex: 1;
		color: var(--font-color);
		border: 2px solid var(--font-color);
	}

	input.error {
		border: 2px solid var(--danger-color);
	}

	*:focus {
		border-color: var(--win-color);
		outline: none;
	}

	input:disabled {
		cursor: default;
		filter: opacity(0.6);
	}

	input:focus::placeholder {
		color: transparent;
	}

	input:disabled::placeholder {
		color: var(--font-color);
	}

	.primes {
		margin-bottom: 1rem;
		max-width: 400px;
		width: 100%;
	}

	.hide-text {
		color: transparent;
	}

	.guesses {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
		padding: 2px 0;
	}

	.share > button {
		height: 2rem;
		padding: 0.25rem 0.5rem;
	}

	.guesses::-webkit-scrollbar {
		display: none;
	}

	.guess-card {
		align-items: center;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		padding: 0.8rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.guess-success {
		font-weight: 700;
	}

	.guess-header {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		margin: 0;
	}

	.guess-results {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		flex: 1;
	}

	.result {
		display: flex;
		border-radius: 50%;
		font-size: 0.9rem;
		height: 2rem;
		width: 2rem;
		justify-content: center;
		align-items: center;
	}

	.product {
		border-radius: 0;
	}

	.win-text {
		color: var(--win-text);
	}

	.correct-text {
		color: var(--success-color);
	}

	.incorrect-text {
		color: var(--danger-color);
	}

	.win {
		background-color: var(--win-color);
	}

	.pregame {
		background-color: var(--font-grey);
		color: white;
	}

	.correct {
		background-color: var(--success-color);
		color: #fff;
	}

	.incorrect {
		background-color: var(--danger-color);
		color: #fff;
	}

	@media (min-width: 460px) {
		.header-wrapper {
			display: initial;
			text-align: center;
			margin-bottom: 1.5rem;
		}

		header h1 {
			font-size: 2.5rem;
		}

		.info-btn {
			top: 1rem;
			right: 1rem;
			position: fixed;
		}

		dialog {
			margin: 0 auto;
		}

		dialog ul {
			padding-left: 5rem;
		}
	}
</style>
