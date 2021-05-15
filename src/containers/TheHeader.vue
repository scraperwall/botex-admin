<template>
  <CHeader fixed with-subheader light>
    
    <CHeaderBrand class="mx-4 d-lg-nonex" to="/">
      <CIcon name="logo" height="48" alt="Logo"/>
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-nonex mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/latest" exact>
          Latest IPs
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3" style="display: none;">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
  </CHeader>
</template>

<script>

export default {
  name: 'TheHeader',
  components: {
  }
}
</script>
