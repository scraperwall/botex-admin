<!--
botex-admin - a web UI for ScraperWall's bad bot mitigation tool botex
Copyright (C) 2021 Tobias von Dewitz <tobias@scraperwall.com>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free 
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more 
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.
-->

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
