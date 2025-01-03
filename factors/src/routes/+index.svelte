<script>
  import { onMount } from 'svelte';

  let secretNumber;
  let primeFactors = [];
  let userGuess = "";
  let results = [];

  // Function to generate a random 3-digit number
	function generateSecretNumber() {
	  // Primes ≤ 29
	  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
	
	  // Function to check if a number's factors are all ≤ 29
	  function hasValidPrimeFactors(num) {
	    for (let prime of primes) {
	      while (num % prime === 0) {
	        num /= prime;
	      }
	    }
	    return num === 1;
	  }
	
	  // Precompute all valid 3-digit numbers
	  const validNumbers = [];
	  for (let i = 100; i <= 999; i++) {
	    if (hasValidPrimeFactors(i)) {
	      validNumbers.push(i);
	    }
	  }
	
	  // Use today's date to seed randomness
	  const today = new Date();
	  const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
	
	  function seededRandom(seed) {
	    const x = Math.sin(seed) * 10000;
	    return x - Math.floor(x);
	  }
	
	  // Select a random number from the valid list
	  const randomIndex = Math.floor(seededRandom(seed) * validNumbers.length);
	  return validNumbers[randomIndex];
	}


  // Function to calculate prime factors of a number
  function getPrimeFactors(number) {
    const factors = [];
    let divisor = 2;
    while (number > 1) {
      if (number % divisor === 0) {
        factors.push(divisor);
        number /= divisor;
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
    const guessFactors = getPrimeFactors(parseInt(userGuess));
    const factorCounts = {};

    // Count occurrences of each factor in the secret number
    for (const factor of primeFactors) {
      factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    }

    const roundResults = guessFactors.map(factor => {
      if (factorCounts[factor]) {
        factorCounts[factor]--; // Decrease count for matched factor
        return { factor, isCorrect: true };
      }
      return { factor, isCorrect: false };
    });

    results = roundResults;

    // Check if all factors are guessed correctly
    if (
      Object.values(factorCounts).every(count => count === 0) &&
      primeFactors.every(f => results.filter(r => r.isCorrect).map(r => r.factor).includes(f))
    ) {
      alert(`Congratulations! You guessed all prime factors of ${secretNumber}!`);
      resetGame();
    }

    userGuess = "";
  }

  // Reset the game
  function resetGame() {
    secretNumber = generateSecretNumber();
    primeFactors = getPrimeFactors(secretNumber);
    results = [];
    console.log(`New secret number: ${secretNumber}, Prime factors: ${primeFactors}`);
  }
</script>

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
</style>

<main>
  <h1>Prime Factor Guessing Game</h1>
  <p>Guess the 3-digit number's prime factors.</p>

  <form on:submit|preventDefault={handleGuess}>
    <input
      type="number"
      bind:value={userGuess}
      placeholder="Enter your guess"
      required
    />
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
</main>

