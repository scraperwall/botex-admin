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
  <div>
    <CRow>
      <CCol sm="12" md="6">
           <CWidgetIcon
          :header="Number(sums.total).toLocaleString()"
          text="Requests"
          color="gradient-info"
          :icon-padding="false"
        >
          <CIcon name="cil-gauge" width="24" />
        </CWidgetIcon>
      </CCol>
      <CCol sm="12" md="6">
           <CWidgetIcon
          :header="Number(sums.app).toLocaleString()"
          text="App Requests"
          color="gradient-success"
          :icon-padding="false"
        >
          <CIcon name="cil-factory" width="24" />
        </CWidgetIcon>
      </CCol>
    </CRow>
     <CRow>
      <CCol sm="12">
          <i-ps :fields="fields" :ips="ips" :title="'Details for Network ' + this.cidr" />
      </CCol>
    </CRow> 
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'
import IPs from './IPs.vue'
import moment from 'moment'

export default {
  name: 'ByNetwork',
  components: {
    CountryFlag,
    IPs,
  },
  props: {
      cidr: {
      type: String,
      required: true,
    },
  },
  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('loadIPsByNetwork', this.cidr)
  },
  computed: {
    ips () { 
        let list = []
        this.$store.state.ips.forEach(function (ip) {
            list.push({
                ip: ip.ip,
                cidr: ip.asn.cidr,
                asn: ip.asn.asn,
                org: ip.asn.organization,
                country: ip.geoip.city.registered_country,
                country_code: ip.geoip.city.registered_country_code,
                total: ip.total,
                ratio: Math.round(100 * ip.ratio),
                block_reason: ip.block_reason,
                updated_at: moment(new Date(ip.updated_at)),
            })
        })
        return list
    },
    fields () {
        return [
            {key: 'ip', label: 'IP'},
            {key: 'cidr', label: 'Network'},
            {key: 'org', label: 'Organization'},
            {key: 'country', label: 'Country'},
            {key: 'total', label: 'Reqs'},
            {key: 'ratio', label: 'Ratio'},
            {key: 'block_reason', label: 'Blocked'},
            {key: 'updated_at', label: 'Last Seen'},
        ]
    },
    sums () {
      let res = {
        "total": 0,
        "app": 0,
      }

      this.$store.state.ips.forEach(function (ip) {
        res.total += ip.total
        res.app += ip.app
      })

      return res
    },
  },
  methods: {}
}
</script>
