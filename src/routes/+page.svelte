<script lang="ts">
	import { onMount } from 'svelte';
	type Result = { factor: number; isCorrect: boolean };
	type Guess = { guess: number; results: Result[] };

	let secretNumber: number;
	let primeFactors: number[] = [];
	let userGuess = '';
	let results: Result[] = [];
	let allGuesses: Guess[] = []; // Track all user guesses

	// Function to generate a random 3-digit number
	function generateSecretNumber() {
		// Primes ≤ 29
		const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

		// Function to check if a number's factors are all ≤ 29
		function hasValidPrimeFactors(num: number) {
			for (let prime of primes) {
				while (num % prime === 0) {
					num /= prime;
				}
			}
			return num === 1;
		}

		// Precompute all valid 3-digit numbers
		const validNumbers: number[] = [];
		for (let i = 100; i <= 999; i++) {
			if (hasValidPrimeFactors(i)) {
				validNumbers.push(i);
			}
		}

		// Use today's date to seed randomness
		const today = new Date();
		const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();

		function seededRandom(seed: number) {
			const x = Math.sin(seed) * 10000;
			return x - Math.floor(x);
		}

		// Select a random number from the valid list
		const randomIndex = Math.floor(seededRandom(seed) * validNumbers.length);
		return validNumbers[randomIndex];
	}

	// Function to calculate prime factors of a number
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

	// Initialize the game
	onMount(() => {
		secretNumber = generateSecretNumber();
		primeFactors = getPrimeFactors(secretNumber);
		console.log(`Secret number: ${secretNumber}, Prime factors: ${primeFactors}`);
	});

	// Handle the user's guess
	function handleGuess() {
		const parsedGuess = parseInt(userGuess);
		if (isNaN(parsedGuess)) return; // Ensure the guess is valid

		const guessFactors = getPrimeFactors(parsedGuess);
		const factorCounts: Record<number, number> = {};

		// Count occurrences of each factor in the secret number
		for (const factor of primeFactors) {
			factorCounts[factor] = (factorCounts[factor] || 0) + 1;
		}

		const roundResults = guessFactors.map((factor) => {
			if (factorCounts[factor]) {
				factorCounts[factor]--; // Decrease count for matched factor
				return { factor, isCorrect: true };
			}
			return { factor, isCorrect: false };
		});

		results = roundResults;

		// Track the user's guess and results
		allGuesses = [...allGuesses, { guess: parsedGuess, results: roundResults }];

		// Check if all factors are guessed correctly
		if (
			Object.values(factorCounts).every((count) => count === 0) &&
			primeFactors.every((f) =>
				results
					.filter((r) => r.isCorrect)
					.map((r) => r.factor)
					.includes(f)
			)
		) {
			alert(`Congratulations! You guessed all prime factors of ${secretNumber}!`);
			resetGame();
		}

		userGuess = '';
	}

	// Reset the game
	function resetGame() {
		//complete game
	}
</script>

<main>
	<h1>Prime Factor Guessing Game</h1>
	<p>Guess the 3-digit number's prime factors.</p>

	<form on:submit|preventDefault={handleGuess}>
		<input type="number" bind:value={userGuess} placeholder="Enter your guess" required />
		<button type="submit">Submit Guess</button>
	</form>

	<h2>Results</h2>
	{#if results.length > 0}
		<div>
			{#each results as { factor, isCorrect }}
				<span class="result {isCorrect ? 'correct' : 'incorrect'}">
					{factor}
				</span>
			{/each}
		</div>
	{/if}

	<h2>All Guesses</h2>
	{#each allGuesses as { guess, results }, index}
		<div class="guess">
			<div class="guess-number">Guess {index + 1}: {guess}</div>
			<div>
				{#each results as { factor, isCorrect }}
					<span class="result {isCorrect ? 'correct' : 'incorrect'}">
						{factor}
					</span>
				{/each}
			</div>
		</div>
	{/each}
</main>

<style>
	.result {
		display: inline-block;
		margin: 0.2rem;
		padding: 0.5rem;
		border-radius: 5px;
	}

	.correct {
		background-color: #d4edda;
		color: #155724;
	}

	.incorrect {
		background-color: #f8d7da;
		color: #721c24;
	}

	.guess {
		margin-top: 1rem;
	}

	.guess-number {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
</style>
