<script>
    export let context = 0;
  
    $: contextColor =
      context < 32000
        ? "bg-green-100 dark:bg-green/10 dark:text-green"
        : context < 128000 && context >= 32000
          ? "bg-orange-100 dark:bg-orange-400/10 dark:text-orange-400"
          : "bg-red-100 dark:bg-red-400/10 dark:text-red-400";
  </script>
  
  <span
    class="text-xs text-black-500 {contextColor} dark:text-black-300 px-2 py-1 rounded-full"
    >{context / 1000}K</span
  >