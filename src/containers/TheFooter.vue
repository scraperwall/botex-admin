<template>
  <CFooter :fixed="false">
    <div>
      <a href="https://scraperwall.com/" target="_blank">ScraperWall</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} Tobias von Dewitz.</span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1" target="_blank">Powered by</span>
      <a href="https://scraperwall.com/botex">botex v1.0</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
