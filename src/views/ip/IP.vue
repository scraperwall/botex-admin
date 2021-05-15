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
            <CJumbotron
              color="danger"
              text-color="white"
              border-color="white"
              v-if="ipdetails"
            >

              <h1 class="display-6" v-if="ipdetails != null && (ipdetails.ip != ipdetails.hostname) ">{{ title(ip) }} <small v-if="ipdetails.hostname">({{ ipdetails.hostname }})</small></h1>
              <h1 class="display-6" v-else>{{ title(ip) }}</h1>
              <p class="lead">
                  {{ ipdetails.asn.organization }} (ASN {{ ipdetails.asn.asn }}) &bull; <span v-if="ipdetails.geoip.city.name != ''">{{ ipdetails.geoip.city.name }}, </span>{{ ipdetails.geoip.city.country }}
              </p>
              <p class="leadx" v-if="ipdetails != null && ipdetails.block_reason != '' ">
                  blocked {{ blockedAt.fromNow() }}: {{ ipdetails.block_reason }}
              </p>
            </CJumbotron>
        </CCol>
    </CRow>

    <CRow>
         <CCol sm="4">
            <CWidgetDropdown
                v-if="ipdetails"
                :header="Number(ipdetails.total).toLocaleString() + ' ' + this.$pluralize('Total Requests', ipdetails.total)" 
                text="" 
                color="gradient-info"
            >
                <template #footer>
                <CChartLine
                    :datasets="totalRequestData" 
                    :options="requestOptions" 
                    :labels="totalRequestDataLabels" 
                    style="height:70px"
                />
                </template>
            </CWidgetDropdown>
         </CCol>
         <CCol sm="4">
            <CWidgetDropdown
                v-if="ipdetails"
                :header="Number(ipdetails.app).toLocaleString() + ' ' + this.$pluralize('App Requests', ipdetails.app)" 
                text="" 
                color="gradient-info"
            >
                <template #footer>
                <CChartLine 
                    :datasets="appRequestData" 
                    :options="requestOptions" 
                    :labels="appRequestDataLabels" 
                    style="height:70px"
                />
                </template>
            </CWidgetDropdown>
         </CCol>
         <CCol sm="4">
            <CWidgetProgress
                v-if="ipdetails"
                text="app requests/ total requests"
                :header="'' + Math.round(ipdetails.ratio * 100) + '% Ratio'"
                color="gradient-info"
                inverse
                :value="Math.round(ipdetails.ratio * 100)"
            />
         </CCol>
    </CRow>

     <CRow v-if="useragents">
      <CCol sm="12" md="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              Useragents
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                hover
                small
                :fields="['Useragent', 'Count']"
                :items="useragents"
                :items-per-page="10"
                :sorter="true"
                :tableFilter="false"
                pagination
              >
              <template #Count="{item}">
                <td>
                    {{ Number(item.Count).toLocaleString() }}
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow v-if="useragents">
      <CCol sm="12" md="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              Requests
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                hover
                small
                pagination
                :fields="['host', 'url', 'method']"
                :items="requests"
                :items-per-page="10"
                :sorter="false"
                :tableFilter="true"
              >
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ip',
  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('loadIP', this.ip)
    this.$store.dispatch('loadRequestStats', { ip: this.ip, steps: 40 })
  },
  props: {
    ip: {
      type: String,
      required: true,
    },
  },
  components: {
  },
  methods: {
    title (ip) {
        return 'Detailed stats for ' + ip
    },
    //geo () { return this.$store.state.app.history.geo },
    //history () { return this.$store.state.app.history },
    },
  computed: {
        ipdetails () { return this.$store.state.ip.ip_details },
        blockedAt () { return moment(new Date(this.$store.state.ip.ip_details.lastblock_at)) },
        useragents () {
            let list = []

            if (!this.$store.state.ip.useragents) { return list }

            for (const [ua, c] of Object.entries(this.$store.state.ip.useragents)) {
                list.push({Useragent: ua, Count: c})
            }

            return list
        },
        requests () {
            return this.$store.state.ip.requests
        },
        appRequestData () {
            return [
                {
                    label: 'App Requests',
                    backgroundColor: 'rgb(239, 237, 244, 0.9)',
                    data: this.$store.state.appRequestStats,
                }
            ]
        },
        appRequestDataLabels() {
            return this.$store.state.appRequestStats.map(rs => rs.x)
        },
        totalRequestData () {
            return [
                {
                    label: 'Total Requests',
                    backgroundColor: 'rgb(239, 237, 244, 0.9)',
                    data: this.$store.state.requestStats,
                }
            ]
        },
        totalRequestDataLabels() {
            return this.$store.state.requestStats.map(rs => rs.x)
        },
        requestOptions () {
            return {
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
                        display: false
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
    },
}
</script>
