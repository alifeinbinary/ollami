<script>
    /**
	 * @type {string | string[]}
	 */
     export let input = [];
  
    $: inputColor =
      input.includes('text')
        ? "bg-green-100 dark:bg-green/10 dark:text-green"
        : input.includes('image')
          ? "bg-orange-100 dark:bg-orange-400/10 dark:text-orange-400"
          : "bg-red-100 dark:bg-red-400/10 dark:text-red-400";
  </script>
  
  <span
    class="text-xs text-black-500 {inputColor} dark:text-black-300 px-2 py-1 rounded-full"
    >{input}</span
  >