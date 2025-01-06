<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';

	type Result = { factor: number; isCorrect: boolean };
	type Guess = { guess: number; results: Result[]; correctProduct: number };

	let secretNumber: number;
	let primeFactors: number[] = [];
	let userGuess = '';
	let results: Result[] = [];
	let allGuesses: Guess[] = [];
	let isSuccess = false;
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
		}

		userGuess = '';
	}

	async function copyResultsToClipboard() {
		const today = new Date();
		const todayDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
		const allGuessesFlat = allGuesses.flatMap((g) => g.results);
		const incorrectGuesses = allGuessesFlat.filter((g) => !g.isCorrect);
		const incorrectPct = incorrectGuesses.length / allGuessesFlat.length;
		const sumOfBadGuesses = incorrectGuesses.reduce((a, b) => a + b.factor, 0);
		const score = secretNumber / (sumOfBadGuesses + allGuesses.length - 1);
		const resultText = [
			todayDate,
			`🔁: ${allGuesses.length}`,
			`🔴: ${(incorrectPct * 100).toFixed(1)}%`,
			`👌: ${isNaN(score) ? 0 : (1 / score).toFixed(4)}`,
			'jackherizsmith.github.io/factors'
		].join('\n');

		try {
			await navigator.clipboard.writeText(resultText);
			alert('Results copied to clipboard!');
		} catch (err) {
			alert('Failed to copy results.');
		}
	}
</script>

<main>
	<div class="header">
		<h1>Prime Factor Challenge</h1>
		<p>Daily Challenge for {new Date().toLocaleDateString()}</p>
	</div>

	{#if isSuccess}
		<div class="success" transition:fade>
			<h2>🎉 You did it! 🎉</h2>
			<p>Secret Number: {secretNumber}</p>
			<button on:click={copyResultsToClipboard} class="copy-btn">Copy Results</button>
		</div>
	{:else}
		<form on:submit|preventDefault={handleGuess} transition:fly={{ x: 100 }}>
			<input
				type="number"
				bind:value={userGuess}
				placeholder="Enter your guess (3-digit)"
				required
				class="guess-input"
			/>
			<button type="submit" class="guess-btn">Submit Guess</button>
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
						<span class="result {isCorrect ? 'correct' : 'incorrect'}">
							{factor}
						</span>
					{/each}
				</div>
				{#if results.some((r) => r.isCorrect)}
					<div class="result correct">{correctProduct}</div>
				{/if}
			</div>
		{/each}
	</div>
</main>

<style>
	/* General Styles */
	:root {
		--bg-color: #f9f9f9;
		--primary-color: #007bff;
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
	}

	.header h1 {
		margin: 0.5rem 0;
		font-size: 1.5rem;
		text-align: center;
	}

	.header p {
		font-size: 1rem;
		color: #555;
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

	.guess-btn {
		padding: 0.8rem;
		background-color: var(--primary-color);
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.guess-btn:hover {
		background-color: #0056b3;
	}

	.error-message {
		color: var(--danger-color);
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	.success {
		text-align: center;
		background-color: var(--success-color);
		color: #fff;
		padding: 1rem;
		border-radius: 8px;
	}

	.success h2 {
		margin-bottom: 0.5rem;
	}

	.copy-btn {
		padding: 0.8rem;
		background-color: var(--primary-color);
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		margin-top: 1rem;
	}

	.copy-btn:hover {
		background-color: #0056b3;
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

	.correct {
		background-color: var(--success-color);
		color: #fff;
	}

	.incorrect {
		background-color: var(--danger-color);
		color: #fff;
	}

	/* Responsive Design */
	@media (min-width: 768px) {
		main {
			padding: 2rem;
		}

		.header h1 {
			font-size: 2rem;
		}

		.guess-input,
		.guess-btn {
			font-size: 1.2rem;
		}
	}
</style>
