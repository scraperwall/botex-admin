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
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <h3>Latest IPs</h3>
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                hover
                small
                :fields="fields"
                :items="ips"
                :items-per-page="20"
                :sorter="false"
                :tableFilter="true"
                pagination
              >
              <template #org="{item}">
                <td>
                  <router-link :to="{ name: 'asn', params: { asn: item.asn }}">{{ item.org }}</router-link>
                </td>
              </template>     
              <template #cidr="{item}">
                <td>
                  <router-link :to="{ name: 'network', params: { cidr: item.cidr }}">{{ item.cidr }}</router-link>
                </td>
              </template>     
              <template #country="{item}">
                <td :title="item.country">
                  <country-flag :country='item.country_code' size='normal'/>
                </td>
              </template>
              <template #ratio="{item}">
                <td>
                  <CProgress :value="item.ratio" :showPercentage="true" color="gradient-danger" />
                </td>
              </template>
              <template #ip="{item}">
                <td>
                  <router-link :to="{ name: 'ip-page', params: { ip: item.ip }}">{{ item.ip }}</router-link>
                </td>
              </template>              <
              <template #updated_at="{item}">    
                <td>
                    {{ item.updated_at.format('HH:mm:ss') }}
                </td>
              </template>
              <template #block_reason="{item}">
                  <td style="color: red; text-align: center;" :title="item.block_reason">
                      <CIcon v-if="item.block_reason" name="cil-ban" />
                  </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow> 
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'
import moment from 'moment'

export default {
  name: 'Latest',
  components: {
    CountryFlag
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    fields: {
        type: Array,
        required: true,
    },
    ips: {
        type: Array,
        required: true,
    }

  },
  data () { return {} },
  mounted () {},
  computed: {
    ips () { 
        let list = []
        this.$store.state.latestIPs.forEach(function (ip) {
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
            //{key: 'total', label: 'Reqs'},
            //{key: 'ratio', label: 'Ratio'},
            // {key: 'block_reason', label: 'Blocked'},
            {key: 'updated_at', label: 'Last Seen'},
        ]
    },
  },
  methods: {}
}
</script>
