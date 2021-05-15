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
    <CRow v-if="sums">
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="Number(sums.total).toLocaleString()"
          text="Total"
          color="gradient-warning"
          :icon-padding="false"
        >
          <CIcon name="cilSpeedometer" width="24" />
        </CWidgetIcon>
      </CCol>
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="'' + Math.round(100 * (sums.human / sums.total)) + '%'"
          text="Human"
          color="gradient-success"
          :icon-padding="false"
        >
          <CIcon name="cil-smile" width="24" />
        </CWidgetIcon>
      </CCol>
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="'' + Math.round(100 * (sums.blocked / sums.total)) + '%'"
          text="Blocked"
          color="gradient-danger"
          :icon-padding="false"
        >
          <CIcon name="cil-ban" width="24"/>
        </CWidgetIcon>
      </CCol>
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="'' + Math.round(100 * (sums.whitelisted / sums.total)) + '%'" 
          text="Whitelisted"
          color="gradient-info"
          :icon-padding="false"
        >
          <CIcon name="cil-check" width="24"/>
        </CWidgetIcon>
      </CCol>
    </CRow>

    <CRow v-if="statsData">
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              Stats
            </slot>
          </CCardHeader>
          <CCardBody>
            <CChartLine
                :datasets="statsData" 
                :options="statsOptions" 
                :labels="statsLabels" 
                style="height:250px"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

     <CRow v-if="blocked">
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              {{ blocked.length }} Blocked IPs
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                hover
                small
                :fields="['IPAddress', 'Hostname', 'Network', 'Organization', 'Country', 'Requests', 'Ratio', 'Blocked At']"
                :items="blocked"
                :items-per-page="10"
                :sorter="true"
                :tableFilter="true"
                pagination
              >
              <template #Network="{item}">
                <td>
                  <router-link :to="{ name: 'network', params: { cidr: item.Network }}">{{ item.Network }}</router-link>
                </td>
              </template>   
              <template #Organization="{item}">
                <td>
                  <router-link :to="{ name: 'asn', params: { asn: item.asn }}">{{ item.Organization }}</router-link>
                </td>
              </template>    
              <template #Country="{item}">
                <td :title="item.country_name">
                  <country-flag :country='item.country_code' size='normal'/>
                </td>
              </template>
              <template #Ratio="{item}">
                <td>
                  <CProgress :value="item.Ratio * 100" :showPercentage="true" color="gradient-danger" />
                </td>
              </template>
              <template #IPAddress="{item}">
                <td>
                  <router-link :to="{ name: 'ip-page', params: { ip: item.IP }}">{{ item.IP }}</router-link>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow>
      <CCol sm="12" md="6">
        <CCard>
          <CCardHeader>
            <slot name="header">
              Blocked Networks
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                hover
                small
                :fields="['Network', 'IPs', 'Organization', 'Requests', 'Ratio']"
                :items="blockedNetworks"
                :items-per-page="10"
                :sorter="true"
                :tableFilter="true"
                pagination
              >
               <template #Network="{item}">
                <td>
                  <router-link :to="{ name: 'network', params: { cidr: item.Network }}">{{ item.Network }}</router-link>
                </td>
              </template>   
              <template #Organization="{item}">
                <td>
                  <router-link :to="{ name: 'asn', params: { asn: item.asn }}">{{ item.Organization }}</router-link>
                </td>
              </template>    
              <template #Ratio="{item}">
                <td>
                  <CProgress :value="item.Ratio * 100" :showPercentage="true" color="gradient-danger" />
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol sm="12" md="6">
        <CCard>
          <CCardHeader>
            <slot name="header">
              Blocked Autonomous Systems
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                hover
                small
                :fields="['ASN', 'Organization', 'IPs', 'Requests', 'Ratio']"
                :items="blockedASNs"
                :items-per-page="10"
                :sorter="true"
                :tableFilter="true"
                pagination
              >
              <template #ASN="{item}">
                <td>
                  <router-link v-if="item.ASN" :to="{ name: 'asn', params: { asn: item.ASN }}">{{ item.ASN }}</router-link>
                  <span v-else>n/a</span>
                </td>
              </template>    
              <template #Organization="{item}">
                <td>
                  <router-link v-if="item.ASN" :to="{ name: 'asn', params: { asn: item.ASN }}">{{ item.Organization }}</router-link>
                  <span v-else>{{ item.Organization }}</span>
                </td>
              </template>    
              <template #Ratio="{item}">
                <td>
                  <CProgress :value="item.Ratio * 100" :showPercentage="true" color="gradient-danger" />
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
import { freeSet } from '@coreui/icons'

export default {
  name: 'Dashboard',
  components: {
    CountryFlag,
    freeSet,
  },
  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('loadBlocked')
    this.$store.dispatch('loadBlockedNetworks')
    this.$store.dispatch('loadBlockedASNs')
    this.$store.dispatch('loadStats')
  },
  computed: {
    blocked () { 
      let $list = []
      this.$store.state.blockedIPs.forEach((i) => {
        $list.push({
          "IP": i.ip, 
          "Hostname": i.hostname, 
          "Organization": i.asn.organization, 
          "Network": i.asn.cidr,
          "Reason": i.block_reason, 
          "App Requests": i.app, 
          "Requests": i.total, 
          "Ratio": i.ratio,
          "Blocked At": moment(new Date(i.blocked_at)).format('HH:mm:ss'),
          "country_code": i.city.registered_country_code,
          "country_name": i.city.registered_country,
          "asn": i.asn.asn,
        })
      })
      return $list
    },
    blockedNetworks () { 
      let $list = []
      this.$store.state.blockedNetworks.forEach((i) => {
        $list.push({
          "IPs": i.ips, 
          "Organization": i.asn.organization, 
          "Network": i.asn.cidr,
          "Reason": i.reason, 
          "App Requests": i.app, 
          "Requests": i.total, 
          "Ratio": i.ratio,
        })
      })
      return $list
    },
    blockedASNs () { 
      let $list = []
      this.$store.state.blockedASNs.forEach((i) => {
        $list.push({
          "ASN": i.asn.asn,
          "IPs": i.ips, 
          "Organization": i.asn.organization, 
          "Reason": i.reason, 
          "App Requests": i.app, 
          "Requests": i.total, 
          "Ratio": i.ratio,
        })
      })
      return $list
    },
    statsData () {
      return [
        {
                label: 'Bad Bots',
                backgroundColor: 'rgb(200, 0, 0, 0.9)',
                data: this.$store.state.stats.blocked,
        },
        {
                label: 'Human',
                backgroundColor: 'rgb(0, 200, 0, 0.9)',
                data: this.$store.state.stats.human,
        },
        {
                label: 'Good Bots',
                backgroundColor: 'rgb(0, 0, 200, 0.9)',
                data: this.$store.state.stats.whitelisted,
        },
      ]
    },
    statsOptions () {
      return {
        type: "line",
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
              type: "time",
              display: false,
          }],
          yAxes: [{
              display: true,
              stacked: true,
              gridLines: {
                display: false,
              }
          }]
        },
        elements: {
          line: {
              borderWidth: 2
          },
          point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4
          }
        }
      }
    },
    statsLabels() {
      if (!this.$store.state.stats.total) { return [] }
      return this.$store.state.stats.total.map(rs => rs.x)
    },
    sums() {
      return this.$store.state.sums
    }
  },
  methods: {}
}
</script>
