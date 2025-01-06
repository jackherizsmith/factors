<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';

	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
	}

	type Result = { factor: number; isCorrect: boolean };
	type Guess = { guess: number; results: Result[]; correctProduct: number };

	let secretNumber: number;
	let primeFactors: number[] = [];
	let userGuess = '';
	let results: Result[] = [];
	let allGuesses: Guess[] = [];
	let isSuccess = false;
	let isCopied = false;
	let errorMessage = '';

	function generateSecretNumber() {
		const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

		function hasValidPrimeFactors(num: number) {
			for (let prime of primes) {
				while (num % prime === 0) {
					num /= prime;
				}
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
		secretNumber = generateSecretNumber();
		primeFactors = getPrimeFactors(secretNumber);
	});

	function handleGuess() {
		errorMessage = '';
		const parsedGuess = parseInt(userGuess);

		if (isNaN(parsedGuess) || parsedGuess < 100 || parsedGuess > 999) {
			errorMessage = 'Please enter a valid 3-digit number!';
			document.querySelector<HTMLInputElement>('.guess-input')?.focus();
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

		results = roundResults;
		allGuesses = [{ guess: parsedGuess, results: roundResults, correctProduct }, ...allGuesses];

		if (isExactMatch) {
			isSuccess = true;
		} else {
			document.querySelector<HTMLInputElement>('.guess-input')?.focus();
		}

		userGuess = '';
	}

	async function copyResultsToClipboard() {
		const today = new Date();
		const todayDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
		const allGuessesFlat = allGuesses.flatMap((g) => g.results);
		const incorrectGuesses = allGuessesFlat.filter((g) => !g.isCorrect);
		const incorrectPct = incorrectGuesses.length / allGuessesFlat.length;
		const score = allGuesses.length + incorrectGuesses.length - 1;
		const resultText = [
			todayDate,
			`🔁: ${allGuesses.length}`,
			`🔴: ${(incorrectPct * 100).toFixed(1)}%`,
			`👌: ${score}`,
			'jackherizsmith.github.io/factors'
		].join('\n');

		await navigator.clipboard.writeText(resultText);
		isCopied = true;
	}
</script>

<main>
	<div class="header-wrapper">
		<div class="header">
			<h1>Prime Factory</h1>
			<p>{new Date().toLocaleDateString()}</p>
		</div>
		<button class="info-btn" on:click={toggleModal}>How?</button>
	</div>

	<dialog open={showModal}>
		<h2>Rules</h2>
		<p>
			Guess today's three digit number, using the correct prime factors of your previous guesses.
		</p>
		<ul>
			<li>The biggest prime factor is <b>29</b></li>
			<li>
				Factors will be <b class="correct-text">correct</b> or
				<b class="incorrect-text">incorrect</b>
			</li>
			<li>Keep going until you strike <b class="win-text">gold</b></li>
			<li>A lower score is better 🏆</li>
		</ul>
		<button on:click={toggleModal}>Close</button>
	</dialog>

	{#if isSuccess}
		<div class="success correct" transition:fade>
			<h2>🎉 You did it! 🎉</h2>
			<p>Today's solution: {secretNumber}</p>
			<button on:click={copyResultsToClipboard} class="copy-btn"
				>{isCopied ? 'Copied!' : 'Share'}</button
			>
		</div>
	{:else}
		<form on:submit|preventDefault={handleGuess}>
			<input
				type="number"
				bind:value={userGuess}
				placeholder="Enter your guess (3-digit)"
				required
				class="guess-input"
			/>
			<button type="submit">Guess</button>
		</form>
	{/if}

	{#if errorMessage}
		<p class="error-message" transition:fade>{errorMessage}</p>
	{/if}

	<h2 hidden>Your Guesses</h2>
	<div class="guesses">
		{#each allGuesses as { guess, results, correctProduct }, index}
			<div class="guess-card" transition:slide>
				<p class="guess-header">
					{guess}
				</p>
				<div class="guess-results">
					{#each results as { factor, isCorrect }}
						<span
							class="result {isSuccess && index === 0
								? 'win'
								: isCorrect
									? 'correct'
									: 'incorrect'}"
						>
							{factor}
						</span>
					{/each}
				</div>
				<div
					class="result {isSuccess && index === 0
						? 'win'
						: results.some((r) => r.isCorrect)
							? 'correct'
							: 'incorrect'}"
				>
					{correctProduct}
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	:root {
		--bg-color: #f9f9f9;
		--primary-color: #007bff;
		--win-text: #d4af37;
		--win-color: #fdde6c;
		--success-color: #28a745;
		--danger-color: #dc3545;
		--font-color: #333;
		--padding: 1rem;
		color: var(--font-color);
		background-color: var(--bg-color);
	}
	main {
		font-family: sans-serif;
		padding: var(--padding);
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		overflow-x: hidden;
	}

	h1,
	h2,
	p {
		margin: 0;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: var(--primary-color);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: filter 0.3s;
		font-size: 1rem;
	}

	button:hover {
		filter: brightness(0.9);
	}

	.header {
		margin-bottom: 0.5rem;
	}

	.header-wrapper {
		display: flex;
		align-items: start;
		justify-content: space-between;
		width: 100%;
		max-width: 400px;
	}

	.header h1 {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.header p {
		font-size: 1rem;
		color: #555;
	}

	dialog {
		background: white;
		padding: 1rem 0.5rem;
		border-radius: 8px;
		margin: 0 1.5rem;
		max-width: 400px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		text-align: center;
		position: absolute;
		z-index: 10;
	}

	dialog ul {
		text-align: left;
		padding-left: 1.25rem;
	}

	dialog li {
		margin-bottom: 0.25rem;
	}

	dialog h2 {
		margin-bottom: 0.5rem;
	}

	form {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
	}

	.guess-input {
		padding: 0.8rem;
		margin-bottom: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.error-message {
		color: var(--danger-color);
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	.success {
		text-align: center;
		padding: 1rem;
		border-radius: 8px;
	}

	.success h2 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.copy-btn {
		background-color: white;
		color: var(--font-color);
		margin-top: 1rem;
	}

	.guesses {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
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
		display: inline-block;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.9rem;
		text-align: center;
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

	.correct {
		background-color: var(--success-color);
		color: #fff;
	}

	.incorrect {
		background-color: var(--danger-color);
		color: #fff;
	}

	@media (min-width: 460px) {
		main {
			padding: 2rem;
		}

		.header-wrapper {
			display: initial;
			text-align: center;
		}

		.header h1 {
			font-size: 1.25rem;
		}

		.info-btn {
			top: 0.5rem;
			right: 0.5rem;
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
